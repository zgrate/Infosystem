import { Module } from "@nestjs/common";
import { SftpModule } from "nest-sftp";
import { PhotoUploadService } from "./photo-upload.service";

@Module({
  imports: [SftpModule.forRoot({}, true)],
  providers: [PhotoUploadService],
  exports: [PhotoUploadService],
})
export class PhotoUploadModule {}
