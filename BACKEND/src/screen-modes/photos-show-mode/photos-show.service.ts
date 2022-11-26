import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { SftpClientService } from "nest-sftp";

@Injectable()
export class PhotosShowService implements OnModuleInit {
  private logger = new Logger(PhotosShowService.name);
  private photos: string[] = [];

  constructor(private readonly sftpClient: SftpClientService) {}

  getPhotosList(): string[] {
    return this.photos;
  }

  updateDirectory() {
    return this.sftpClient
      .connect({
        host: process.env.SFTP_HOST,
        port: process.env.SFTP_PORT,
        username: process.env.SFTP_USER,
        password: process.env.SFTP_PASS, // passwords should not contain \ (thy should be espaced like \\) and they cannot contain ! or (
      })
      .then(() =>
        this.sftpClient.list(process.env.SFTP_PHOTOS_DIRECTORY).then((it) => {
          this.photos = it.map((it) => it.name);
          this.sftpClient
            .disconnect()
            .then((r) => console.debug('Disconnected SFTP!'));
          return true;
        }),
      )
      .catch((it) => {
        this.logger.error('SFTP Connection error!');
        this.logger.error(it);
        return false;
      });
  }

  async onModuleInit() {
    this.logger.log('Refreshing directory...');
    return this.updateDirectory();
  }
}
