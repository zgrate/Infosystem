import { Controller, Get, Query } from "@nestjs/common";
import { CatchThemAllService } from "./catch-them-all.service";

@Controller("catch")
export class CatchThemAllController {

  constructor(private catchThemAllService: CatchThemAllService) {
  }

  @Get("fursuits")
  getFursuits(@Query("limit") limit: number = 10) {
    return this.catchThemAllService.findFursuits(limit);
  }

}
