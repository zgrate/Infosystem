import { Controller, Get, InternalServerErrorException, Ip, NotFoundException, Param, Post } from "@nestjs/common";
import { ScreenService } from "../services/screen.service";
import { ScreenEntity } from "../../shared/entities/definitions";
import { RegisteredScreen, ScreenID } from "../screen.decorators";

@Controller("screen")
export class ScreenController {
  constructor(private screenService: ScreenService) {
  }

  @Get("info/:id")
  @RegisteredScreen()
  async getScreenByID(@ScreenID() screenId: string): Promise<ScreenEntity> {
    const b = await this.screenService.getScreenByID(screenId);

    if (b == null) {
      throw new NotFoundException();
    } else {
      return b;
    }
  }

  @Post(":id")
  @RegisteredScreen()
  async loginScreen(@Param() params): Promise<ScreenEntity> {
    throw new InternalServerErrorException();
  }

  @Get(":id")
  async getScreen(@ScreenID() screenId) {
    return this.screenService.getScreenByIDUnregistered(screenId);
  }

  @Post()
  async registerNewScreen(@Ip() ip: string): Promise<ScreenEntity> {
    return this.screenService.registerNewScreen(ip);
  }
}
