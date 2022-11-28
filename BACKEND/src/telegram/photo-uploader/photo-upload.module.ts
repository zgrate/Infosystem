import { Module } from "@nestjs/common";
import { PhotoUploadService } from "./photo-upload.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule.register({})],
  providers: [PhotoUploadService],
  exports: [PhotoUploadService],
})
export class PhotoUploadModule {}
