import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Admin } from "./auth/admin-auth.decorators";
import { ScreenService } from "../screen-main/services/screen.service";
import { RegisterScreenDTO } from "./admin.entity";

@Controller("admin/screen")
export class AdminController {

  constructor(private screenService: ScreenService) {

  }

  @Post("/register")
  @Admin()
  async registerScreen(@Body() registerScreen: RegisterScreenDTO) {
    if (registerScreen.screenId == undefined || registerScreen.authKey == undefined) {
      throw new BadRequestException("not supplied");
    }
    if (!await this.screenService.authScreen(registerScreen.screenId, registerScreen.authKey)) {
      throw new BadRequestException("screen registered or not found");
    }
    return { message: "ok" };

  }


}
