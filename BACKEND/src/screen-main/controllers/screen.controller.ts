import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Ip,
  NotFoundException,
  Param,
  Post
} from "@nestjs/common";
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

  @Post("login/:id")
  @RegisteredScreen()
  async loginScreen(@Param() params): Promise<ScreenEntity> {
    throw new InternalServerErrorException();
  }

  @Get("get/:id")
  async getScreen(@ScreenID() screenId) {
    const screen = await this.screenService.getScreenByIDUnregistered(screenId);
    if (screen == null) {
      throw new BadRequestException();
    } else {
      return screen;
    }
  }

  @Post()
  async registerNewScreen(@Ip() ip: string): Promise<ScreenEntity> {
    return this.screenService.registerNewScreen(ip);
  }

}
