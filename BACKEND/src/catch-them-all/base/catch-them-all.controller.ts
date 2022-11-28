import { Body, Controller, Get, Put, Query } from "@nestjs/common";
import { CatchThemAllService, FursuitBadgeDTO } from "./catch-them-all.service";
import { AdminAuth } from "../../admin/auth/admin-auth.decorators";


@Controller("catch")
export class CatchThemAllController {



  constructor(private catchThemAllService: CatchThemAllService) {
  }

  @Get("fursuits")
  getFursuits(@Query("limit") limit: number = 10) {
    return this.catchThemAllService.findFursuits(!!limit ? limit : 10);
  }

  @Get("catchers")
  getCatchers(@Query("limit") limit: number = 10){
    return this.catchThemAllService.getCatches(!!limit ? limit : 10)
  }

  @Put("fursuits")
  @AdminAuth()
  addFursuits(@Body() body: FursuitBadgeDTO[]){
    return this.catchThemAllService.addFursuits(body);
  }
}
