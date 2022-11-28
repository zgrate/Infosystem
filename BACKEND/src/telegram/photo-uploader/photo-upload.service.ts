import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { handleException } from "../../exception.filter";
import { HttpService } from "@nestjs/axios";

// import fetch from 'node-fetch';
const fetch = require('node-fetch');

@Injectable()
export class PhotoUploadService {
  constructor(
    // private sftpService: SftpClientService,
    @InjectBot() private tgBot: Telegraf,
    private httpService: HttpService,
  ) {}

  // onModuleInit() {
  //   return this.sftpService
  //     .connect({
  //       host: process.env.SFTP_HOST,
  //       port: process.env.SFTP_PORT,
  //       username: process.env.SFTP_USER,
  //       password: process.env.SFTP_PASS, // passwords should not contain \ (thy should be espaced like \\) and they cannot contain ! or (
  //     })
  //     .then((it) => {
  //       console.log("CONNECTED");
  //     });
  // }

  uploadPhoto(fileId: string) {
    // const c = this.sftpService.client();
    // c.put.then(() =>
    //   this.sftpService
    //     .upload(
    //       'pierwsza.png',
    //       process.env.SFTP_PHOTOS_DIRECTORY +
    //         '/' +
    //         randomStringGenerator() +
    //         '_test.png',
    //       {},
    //     )
    //     .finally(() => this.sftpService.disconnect()),
    // );

    return this.tgBot.telegram.getFileLink(fileId).then((url) => {
      // return url;
      return fetch(url.toString())
        .then((it) => {
          return it.body;
        })
        .then(async (it) => {
          return (
            this.httpService.axiosRef
              .put(
                process.env.NEXT_CLOUD_URL +
                  '/remote.php/dav/files/zgrate/public/photos/' +
                  randomStringGenerator() +
                  '_' +
                  url.pathname.split('/').reverse()[0],
                it,
                {
                  auth: {
                    username: process.env.NEXT_CLOUD_USERNAME,
                    password: process.env.NEXT_CLOUD_PASSWORD,
                  },
                },
              )
              // .upload(
              //   'pierwsza.png',
              //   process.env.SFTP_PHOTOS_DIRECTORY +
              //     '/' +

              //   {
              //     readStreamOptions: {
              //       autoClose: true,
              //     },
              //     pipeOptions: {
              //       end: true,
              //     },
              //   },
              // )
              .then((it) => {
                console.log('OK ' + it);
                return it.status === 201 ? 'ok' : 'error';
              })
              .catch((error) => {
                handleException(error);
                return 'error';
              })
          );
        });
    });
  }
}
