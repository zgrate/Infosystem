import { BadRequestException, Body, Controller, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { Admin, AdminAuth } from "../../admin/auth/admin-auth.decorators";
import { ScreenEntity } from "../../shared/entities/screen.entity";
import { ModeType, SCREEN_REFRESH_EVENT, ScreenService } from "../../screen-main/services/screen.service";
import { RegisterScreenDTO } from "../../admin/admin.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MODE_CHANGE_EVENT, ModeChangeEvent } from "../../screen-events/events/mode-change.event";
import { SETTINGS_UPDATE_EVENT } from "../../screen-events/events/settings-update.event";
import { MESSAGE_UPDATE_EVENT } from "../../screen-events/events/messages-update.event";

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
    if (registerScreen.authKey == undefined) {
      throw new BadRequestException("not supplied");
    }
    if (!(await this.screenService.authScreen(registerScreen.authKey))) {
      throw new BadRequestException("screen registered or not found");
    }
    return { message: "ok" };
  }

  @Admin()
  @Post("allmodes")
  async setAllModes(@Query("mode") mode: ModeType) {
    if (mode == undefined) {
      throw new BadRequestException();
    }
    return this.screenService.setAllModes(mode).then((it) => {
      return {
        status: "ok",
        success: it
      };
    });
  }

  @Admin()
  @Post("settings")
  async refreshSettingsInScreens() {
    return {
      status: "ok",
      result: this.eventEmitter.emit(SETTINGS_UPDATE_EVENT)
    };
  }

  @Admin()
  @Post("messages")
  async refreshMessages() {
    return {
      status: "ok",
      result: this.eventEmitter.emit(MESSAGE_UPDATE_EVENT)
    };
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
  logger = new Logger(ScreenAdminController.name)

  @Post("/refresh/:name")
  @AdminAuth()
  refreshSite(@Param("name") name: string) {
    this.logger.debug("Reloading screen..." + name);
    return this.eventEmitter
      .emitAsync(SCREEN_REFRESH_EVENT, name)
      .then((it) => {
        return {
          status: "ok",
          response: it
        };
      });
  }
}
