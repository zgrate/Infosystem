import { Ctx, Start, Update } from "nestjs-telegraf";
import { CanActivate, ExecutionContext, OnModuleInit, UseGuards } from "@nestjs/common";
import { Context } from "telegraf";
import { Observable } from "rxjs";

export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("awooga");
    console.log(context);
    return true;
  }
}

@Update()
export class TelegramUpdate implements OnModuleInit {
  @Start()
  @UseGuards(TestGuard)
  async test(@Ctx() ctx: Context<any>) {
    console.log(ctx.chat.type);
    await ctx.reply("TEST");
  }

  onModuleInit(): any {
  }
}
