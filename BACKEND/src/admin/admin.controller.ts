import { Body, Controller, Logger, Param, Post } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { AdminAuth } from "./auth/admin-auth.decorators";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { REFRESH_CACHE } from "./admin.events";
import { PROGRAM_UPDATE_EVENT } from "../program/entities/program.entity";
import { SCREEN_REFRESH_EVENT } from "../screen-main/services/screen.service";
import { DbConfigService } from "../db-config/db-config.service";

@Controller("admin")
export class AdminController {
  // constructor(@Inject(forwardRef(()=>ScreenService))private screenService: ScreenService) {}
  private logger = new Logger(AdminController.name);

  constructor(
    @InjectBot() private tgAdmin: Telegraf,
    private eventEmmiter: EventEmitter2,
    private dbConfig: DbConfigService
  ) {
  }

  @Post("/bot/stop")
  @AdminAuth()
  stopBot() {
    this.logger.log("Stopping TG Bot!");
    this.tgAdmin.stop();
    return { status: "ok" };
  }

  @Post("/bot/launch")
  @AdminAuth()
  launchBot() {
    this.logger.log("Starting TG Bot!");
    return this.tgAdmin.launch().then((r) => {
      return { status: "ok" };
    });
  }

  @Post("/settings/refresh")
  @AdminAuth()
  refreshSettings() {
    this.logger.debug("Emmiting refresh signal..");
    this.eventEmmiter.emit(REFRESH_CACHE);
    return { status: "ok" };
  }

  @Post("/program/refresh")
  @AdminAuth()
  programRefresh() {
    this.logger.debug("Emmiting program refresh signal...");
    this.eventEmmiter.emit(PROGRAM_UPDATE_EVENT);
    return { status: "ok" };
  }

  @Post("/message")
  @AdminAuth()
  setMessage(@Body() message: any) {
    // console.log(message["message"])
    return this.dbConfig.saveConfig("admin-message", message["message"]);
  }

  @Post("/reload/:name")
  @AdminAuth()
  refreshSite(@Param("name") name: string) {
    this.logger.debug("Reloading screen..." + name);
    return this.eventEmmiter
      .emitAsync(SCREEN_REFRESH_EVENT, name)
      .then((it) => {
        return {
          status: "ok",
          response: it
        };
      });
  }
}
