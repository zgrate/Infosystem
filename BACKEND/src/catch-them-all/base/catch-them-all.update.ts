import { Command, Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CatchThemAllService } from "./catch-them-all.service";
import { UseGuards } from "@nestjs/common";
import { BannedGuard } from "../../telegram/banned.guard";

@Update()
@UseGuards(BannedGuard)
export class CatchThemAllUpdate {
  constructor(private catchTheAllService: CatchThemAllService) {
  }

  @On("document")
  async getDocument(@Ctx() ctx: Context<any>) {
    await ctx.reply(
      await this.catchTheAllService.uploadPhotoRecentlyCatched(
        ctx.chat.username,
        ctx.message.document.file_id
      )
    );
  }

  @Command("upload")
  async upload(@Ctx() ctx: Context<any>) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx.reply(
        "Musisz podać przynajmniej jeden Fursuit ID lub częśc nazwy fursuita!"
      );
    } else {
      await ctx.reply(
        await this.catchTheAllService.switchCatch(
          commands.join(" "),
          ctx.chat.username
        )
      );
    }
  }

  @Command("catch")
  async catchIt(@Ctx() ctx: Context<any>) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx.reply("Musisz podać przynajmniej jeden Fursuit ID!");
    } else {
      const status = await this.catchTheAllService.catchFursuit(
        commands[0],
        ctx.chat.username
      );
      if (status == "error")
        await ctx.reply("Fursuit " + commands[0] + " nie znaleziony!");
      else if (status == "db_error") {
        await ctx.reply("Wystąpił problem. Prosimy spróbować później!");
      } else if (status == "caught") {
        await ctx.reply("Fursuit został już złapany!");
      } else {
        await ctx.reply(
          "Złapano " +
          status +
          "\nAby dokończyć łapanie, wyślij przynajmniej 1 zdjęcie (w pliku) z fursuiterem."
        );
      }
    }
  }
}
