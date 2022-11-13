import { Module } from "@nestjs/common";
import { PhotosShowService } from "./photos-show.service";
import { PhotosShowController } from "./photos-show.controller";
import { SftpModule } from "nest-sftp";
import { AdminAuthModule } from "../../admin/auth/admin-auth.module";
import { DbConfigModule } from "../../db-config/db-config.module";

@Module({
  imports: [
    SftpModule.forRoot(
      {}, true
    ),
    AdminAuthModule,
    DbConfigModule
  ],
  providers: [PhotosShowService],
  controllers: [PhotosShowController]
})
export class PhotosShowModule {
}
