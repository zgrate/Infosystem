import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegramService } from "./service/telegram.service";

@Injectable()
export class BannedGuard implements CanActivate {
  constructor(private tgService: TelegramService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(context.getArgs()[0].update.message.from);
    const res = await this.tgService
      .isBanned(context.getArgs()[0].update.message.from.username)
      .then((it) => !it);
    return res;

    // console.log(await this.tgService.getUsernameUsingChatID(context.getArgs()[0].update.message.from.id))
    // return true;
  }
}
