import { Command, Ctx, Start, Update } from "nestjs-telegraf";
import { OnModuleInit, Param, UseGuards } from "@nestjs/common";
import { Context } from "telegraf";
import { DbConfigPipe } from "../../db-config/db-config.pipe";
import { User } from "typegram/manage";
import { TGUser } from "../telegram.decorators";
import { BannedGuard } from "../banned.guard";

@Update()
@UseGuards(BannedGuard)
export class TelegramUpdate implements OnModuleInit {
  @Start()
  async test(
    @Ctx() ctx: Context<any>,
    @Param("test", DbConfigPipe) config: any
  ) {
    // console.log(ctx.chat.type);

    await ctx.reply(
      "Cześć! Jestem Renia! Jestem botem Futrołajek! Co chcesz zrobić?"
    );
  }

  @Command("premium")
  async premium(@Ctx() ctx: Context<any>, @TGUser() user: User) {
    if (user.is_premium) {
      await ctx.reply("Ta wiadomość jest dostępna dla ciebie!");
      await ctx.replyWithSticker(
        "CAACAgEAAxkBAAEZ2Ddjbkmb7cGYXxrYljABzBMcmZ_BbgACegEAAmHY8QiTp8mpHbnMDysE"
      );
    } else {
      await ctx.reply(
        "[ ta wiadomość jest dostępna tylko dla użytkowników telegram premium. ]"
      );
    }
    // if(ctx.messages.from)
  }

  onModuleInit(): any {
  }
}
