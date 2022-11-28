import { Command, Ctx, Start, Update } from "nestjs-telegraf";
import { OnModuleInit, UseGuards } from "@nestjs/common";
import { Context } from "telegraf";
import { User } from "typegram/manage";
import { TGUser } from "../telegram.decorators";

import { handleException } from "../../exception.filter";
import { TelegramService } from "./telegram.service";
import { BannedGuard } from "../guards/banned.guard";
import { PrivateChatGuard } from "../guards/private-chat.guard";

@Update()
@UseGuards(BannedGuard)
export class TelegramUpdate implements OnModuleInit {
  constructor(private telegramService: TelegramService) {
  }

  @Start()
  @UseGuards(PrivateChatGuard)
  async test(
    @Ctx() ctx: Context<any>
  ) {
    // console.log(ctx.chat.type);

    await ctx
      .reply(
        "Cześć\! Jestem Renia\! Jestem botem Futrołajek\! Co chcesz zrobić?\n" +
        "<b>POMOC</b>\n" +
        "<b>W przypadku sytuacji wyjątkowej dzwoń pod +48571529393</b>\n" +
        "/org - łaczy z czatem z orgami\n" +
        "/sefurity - łączy z czatem z sefurity\n\n" +
        "<b>Złap je wszystkie</b>\n" +
        "/zlap_pomoc - pomoc na temat złap je wszystkie!\n" +
        "/zlap (id) - łapie fursuitera\n" +
        "/fursuity - lista fursuitow\n" +
        "/zlapane - lista zlapanych przez ciebie fursuiterow!\n" +
        "/wyslij_zdjecia (id/nazwa) - dodaje zdjecia do fursuitera\n\n" +
        "<b>AKTYWNOŚCI, PROGRAM i INNE</b>\n" +
        "/aktywnosci - informacje, o co chodzi w aktywnosciach?\n"+
        "/program - pokazuje aktualny program\n" +
        "/proponuj - proponuje dodatkową aktywność\n" +
        "/zdjecia - otwiera czat do wysyłania zdjęc z konwentu!\n\n"+
        "<b>Komendy dodatkowe:</b>\n" +
        "/ile_do_futrolajek - Ile zostalo do futrolajek?\n" +
        this.telegramService
          .getCommands()
          .filter((it) => !!it.description)
          .map((it) => `/${it.command} - ${it.description}`)
          .join("\n")
        +"\nRenia @futrolajkibot made by Z-Grate",
        { parse_mode: "HTML", reply_markup: {remove_keyboard: true} }
      )
      .catch((error) => handleException(error));
  }

  @Command("premium")
  async premium(@Ctx() ctx: Context<any>, @TGUser() user: User) {
    if (user.is_premium) {
      await ctx
        .reply("Ta wiadomość jest dostępna dla ciebie!")
        .catch((error) => handleException(error));
      await ctx
        .replyWithSticker(
          "CAACAgEAAxkBAAEZ2Ddjbkmb7cGYXxrYljABzBMcmZ_BbgACegEAAmHY8QiTp8mpHbnMDysE"
        )
        .catch((error) => handleException(error));
    } else {
      await ctx
        .reply(
          "[ ta wiadomość jest dostępna tylko dla użytkowników telegram premium. ]"
        )
        .catch((error) => handleException(error));
    }
    // if(ctx.messages.from)
  }

  @Command("ile_do_futrolajek")
  async timeLeftCommand(@Ctx() ctx: Context<any>) {
    const timeLeft =
      (await this.telegramService.getTimeLeftToConvention()) / 1000;
    if (timeLeft > 0) {
      const days = timeLeft / 86400;
      const hours = (timeLeft % 86400) / 3600;
      const minutes = ((timeLeft % 86400) % 3600) / 60;
      await ctx.reply(
        "Do Futrołajek 2022 pozostało: " +
        Math.floor(days).toFixed(0) +
        " dni " +
        Math.floor(hours).toFixed(0) +
        "h " +
        Math.floor(minutes).toFixed(0) +
        "min"
      ).catch(error => handleException(error));
    } else {
      await ctx.reply("Futrołajki 2022 już się rozpoczęły!");
    }
  }

  async throwTestException(@Ctx() ctx: Context<any>) {
    return this.telegramService
      .throwException()
      .catch((error) => handleException(error));
  }

  onModuleInit(): any {
  }
}
