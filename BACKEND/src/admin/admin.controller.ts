import { Controller, Logger, Post } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { AdminAuth } from "./auth/admin-auth.decorators";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { REFRESH_CACHE } from "./admin.events";

@Controller("admin")
export class AdminController {
  // constructor(@Inject(forwardRef(()=>ScreenService))private screenService: ScreenService) {}
  private logger = new Logger(AdminController.name);

  constructor(
    @InjectBot() private tgAdmin: Telegraf,
    private eventEmmiter: EventEmitter2
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
}
