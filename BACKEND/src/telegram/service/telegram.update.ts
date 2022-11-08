import { Ctx, Start, Update } from "nestjs-telegraf";
import { CanActivate, ExecutionContext, OnModuleInit, Param, UseGuards } from "@nestjs/common";
import { Context } from "telegraf";
import { Observable } from "rxjs";
import { DbConfigPipe } from "../../db-config/db-config.pipe";

export class TestGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("awooga");
    console.log(context.getArgs());
    return true;
  }
}

@Update()
export class TelegramUpdate implements OnModuleInit {
  @Start()
  @UseGuards(TestGuard)
  async test(
    @Ctx() ctx: Context<any>,
    @Param("test", DbConfigPipe) config: any
  ) {
    console.log(config);
    // console.log(ctx.chat.type);
    await ctx.reply("TEST");
  }

  onModuleInit(): any {
  }
}
