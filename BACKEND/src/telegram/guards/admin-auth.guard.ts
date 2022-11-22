import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TelegramService } from "../service/telegram.service";


@Injectable()
export class AdminAuthorization implements CanActivate {
  constructor(private tgService: TelegramService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(context.getArgs()[0].update.message.from);
    return this.tgService.isAdmin(
      context.getArgs()[0].update.message.from.username
    );

    // console.log(await this.tgService.getUsernameUsingChatID(context.getArgs()[0].update.message.from.id))
    // return true;
  }
}
