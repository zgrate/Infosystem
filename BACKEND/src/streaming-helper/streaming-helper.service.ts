import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { handleException } from "../exception.filter";
import { Cron } from "@nestjs/schedule";
import { DbConfigService } from "../db-config/db-config.service";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

@Injectable()
export class StreamingHelperService {
  private logger = new Logger(StreamingHelperService.name);
  constructor(
    private httpService: HttpService,
    private dbConfig: DbConfigService,
  ) {}

  private tokenRefresh = undefined;
  private ffmpegProcess: ChildProcessWithoutNullStreams = undefined;

  private startProcess() {
    if (!this.ffmpegProcess) {
      this.ffmpegProcess = spawn('ffmpeg', ['-version']);
      this.ffmpegProcess.stdout.on('data', (it) => {
        this.logger.verbose(it);
      });
      this.ffmpegProcess.stderr.on('data', (it) => {
        this.logger.error(it);
      });
      this.ffmpegProcess.on('exit', () => {
        this.ffmpegProcess = undefined;
      });
    }
  }

  private stopProcess() {
    if (this.ffmpegProcess) {
      this.ffmpegProcess.kill();
    }
  }

  @Cron('*/2 * * * * *')
  async cronCheck() {}

  async refreshToken() {
    return (
      !!this.tokenRefresh ||
      this.httpService.axiosRef
        .get(`${process.env.RESTREAMER_API_URL}/api/login/refresh`, {
          headers: {
            Authorization: `Bearer ${this.tokenRefresh}`,
          },
        })
        .then((it) => {
          if (it.status > 400) {
            return false;
          } else {
            this.httpService.axiosRef.defaults['Authorization'] =
              'Bearer ' + it.data['access_token'];
            return true;
          }
        })
        .catch(() => false)
    );
  }

  loginRestreamer() {
    this.logger.debug('logging in to restreamer...');
    return this.refreshToken().then((success) => {
      this.logger.debug({
        username: process.env.RESTREAMER_USERNAME,
        password: process.env.RESTREAMER_PASSWORD,
      });
      if (!success) {
        this.logger.debug('Logging in isnide....');
        return this.httpService.axiosRef
          .post(`${process.env.RESTREAMER_API_URL}/api/login`, {
            username: process.env.RESTREAMER_USERNAME,
            password: process.env.RESTREAMER_PASSWORD,
          })
          .then((it) => {
            this.httpService.axiosRef.defaults.headers['Authorization'] =
              'Bearer ' + it.data['access_token'];
            this.tokenRefresh = it.data['refresh_token'];
            return true;
          })
          .catch((error) => {
            this.logger.debug('Error');
            handleException(error.response.data);
            return false;
          });
      }
      return true;
    });
  }

  async checkLogin() {
    return this.httpService.axiosRef
      .get(`${process.env.RESTREAMER_API_URL}/api/v3/log`)
      .then((it) => {
        if (it.status >= 400) return this.loginRestreamer();
        else return true;
      })
      .catch((error) => {
        handleException(error.response.data);
        return this.loginRestreamer();
      });
  }

  async getRestreamerStatus(): Promise<boolean | 'error'> {
    return this.checkLogin().then((it) => {
      if (it) {
        this.logger.log('Login to Restreamer Successfull!');
      }
      // console.log(this.httpService.axiosRef.defaults);
      if (it) {
        return this.httpService.axiosRef
          .get(`${process.env.RESTREAMER_API_URL}/api/v3/rtmp`)
          .then((it) => it.data.length > 0);
      }
      return 'error';
    });
  }
}
