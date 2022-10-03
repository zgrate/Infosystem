import { Controller, Get, Ip, Query } from "@nestjs/common";
import { ScreenService } from "../services/screen.service";
import { ScreenEntity } from "../../shared/entities/definitions";

@Controller("screen")
export class ScreenController {
  constructor(private screenService: ScreenService) {
  }

  @Get()
  async getScreenByID(@Query("id") id: number): Promise<ScreenEntity> {
    return this.screenService.getScreenByID(id);
  }

  @Get()
  async registerNewScreen(@Ip() ip: string): Promise<ScreenEntity> {
    return this.screenService.registerNewScreen(ip);
  }
}
