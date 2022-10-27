import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  bot: Telegraf = new Telegraf(process.env.BOT_TOKEN);

  admin_group = -1001760351196;

  onModuleDestroy(): any {
  }

  async onModuleInit(): Promise<any> {
    this.bot.command("list_program", async (ctx) => {
      if (ctx.chat.id !== this.admin_group) {
        return;
      }
      await ctx.replyWithHTML("<b>TEST</b>");
    });

    this.bot.command("zaproponuj_program", async (ctx) => {

    });
    this.bot.command("badge_request", async (ctx) => {
      await ctx.reply("Test");
    });

    await this.bot.launch();
  }
}
