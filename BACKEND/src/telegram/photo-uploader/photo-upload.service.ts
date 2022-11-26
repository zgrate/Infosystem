import { Injectable } from "@nestjs/common";
import { SftpClientService } from "nest-sftp";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { handleException } from "../../exception.filter";

// import fetch from 'node-fetch';
const fetch = require('node-fetch');

@Injectable()
export class PhotoUploadService {
  constructor(
    private sftpService: SftpClientService,
    @InjectBot() private tgBot: Telegraf,
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

      return url;
      return fetch(url.toString())
        .then((it) => {
          return it.body;
        })
        .then(async (it) => {
          return this.sftpService
            .upload(
              'pierwsza.png',
              process.env.SFTP_PHOTOS_DIRECTORY +
                '/' +
                randomStringGenerator() +
                '_' +
                url.pathname.split('/').reverse()[0],
              {
                readStreamOptions: {
                  autoClose: true,
                },
                pipeOptions: {
                  end: true,
                },
              },
            )
            .then((it) => {
              console.log('OK ' + it);
              return it;
            })
            .finally(() => {
              console.log('FINALLY');
            })
            .catch((error) => {
              handleException(error);
              return 'error';
            });
        });
    });
  }
}
