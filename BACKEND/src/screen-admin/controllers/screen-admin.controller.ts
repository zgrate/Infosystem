import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { Admin } from "../../admin/auth/admin-auth.decorators";
import { ScreenEntity } from "../../shared/entities/definitions";
import { ScreenService } from "../../screen-main/services/screen.service";
import { RegisterScreenDTO } from "../../admin/admin.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MODE_CHANGE_EVENT, ModeChangeEvent } from "../../screen-events/events/mode-change.event";

@Controller("admin/screen")
export class ScreenAdminController {
  constructor(
    private screenService: ScreenService,
    private eventEmitter: EventEmitter2
  ) {
  }

  @Get("list")
  @Admin()
  async getListScreen(): Promise<ScreenEntity[]> {
    return this.screenService.getScreensAdmin();
  }

  @Post("register")
  @Admin()
  async registerScreen(@Body() registerScreen: RegisterScreenDTO) {
    if (
      registerScreen.screenId == undefined ||
      registerScreen.authKey == undefined
    ) {
      throw new BadRequestException("not supplied");
    }
    if (
      !(await this.screenService.authScreen(
        registerScreen.screenId,
        registerScreen.authKey
      ))
    ) {
      throw new BadRequestException("screen registered or not found");
    }
    return { message: "ok" };
  }

  @Admin()
  @Post("mode")
  async setMode(
    @Body("screenId") screenId: string,
    @Body("mode") mode: string
  ) {
    const success = await this.screenService.setMode(screenId, mode);
    if (success) {
      this.eventEmitter.emit(
        MODE_CHANGE_EVENT,
        new ModeChangeEvent(screenId, mode)
      );
      return { status: "OK" };
    } else {
      throw new BadRequestException("Screen not found or invalid mode");
    }
  }
}
