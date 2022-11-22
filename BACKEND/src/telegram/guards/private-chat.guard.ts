import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class PrivateChatGuard implements CanActivate {


  async canActivate(context: ExecutionContext): Promise<boolean> {
    return context.getArgs()[0]?.update?.message?.chat?.type === "private";


    // console.log(await this.tgService.getUsernameUsingChatID(context.getArgs()[0].update.message.from.id))
    // return true;
  }
}
