import { Command, Ctx, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CatchThemAllService } from "./catch-them-all.service";

@Update()
export class CatchThemAllUpdate {
  constructor(private catchTheAllService: CatchThemAllService) {
  }

  @Command("catch")
  async catchIt(@Ctx() ctx: Context<any>) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx.reply("Musisz podać przynajmniej jeden Fursuit ID!");
    } else {
      const fursuit = await this.catchTheAllService.findFursuit(commands[0]);
      if (fursuit == undefined)
        await ctx.reply("Fursuit " + commands[0] + " nie znaleziony!");
      else {
        await ctx.reply("Złapano!  " + fursuit.fursuitName);
      }
    }
  }
}
