import { Controller, Get, Post } from "@nestjs/common";
import { AdminAuth } from "../../admin/auth/admin-auth.decorators";
import { PhotosShowService } from "./photos-show.service";
import { DbConfigService } from "../../db-config/db-config.service";

@Controller("photos")
export class PhotosShowController {
  constructor(private photosShowService: PhotosShowService, private dbConfig: DbConfigService) {
  }

  @Post("refresh")
  @AdminAuth()
  updatePhotos() {
    return this.photosShowService.updateDirectory().then((it) => {
      return {
        status: "ok",
        response: it
      };
    });
  }

  @Get()
  async getPhotos() {
    return this.dbConfig.config("photos-source").then(it => {
      return {
        status: "ok",
        photos: this.photosShowService.getPhotosList(),
        endpoint: it

      };
    });
  }
}
