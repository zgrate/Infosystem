import { Command, Ctx, On, Update } from "nestjs-telegraf";
// import { TGUser } from '../../telegram/service/telegram.update';
import { User } from "typegram/manage";
import { Context } from "telegraf";
import { ProgramFormDTO } from "./program-form.dto";
import { ProgramService } from "../program.service";
import { TGArguments, TGUser } from "../../telegram/telegram.decorators";
import { TelegramService } from "../../telegram/service/telegram.service";

@Update()
export class ProgramUpdate {
  constructor(
    private programService: ProgramService,
    private telegramService: TelegramService
  ) {
  }

  @Command("proponuj")
  async getProgramProposition(@Ctx() ctx: Context<any>) {
    if (ctx.chat.type === "private") {
      await ctx.reply("Kliknij w przycisk aby dodać punkt programu", {
        reply_markup: {
          one_time_keyboard: true,
          keyboard: [
            [
              {
                text: "Dodaj punkt programu!",
                web_app: {
                  url: "https://res.futrolajki.pl/test.html"
                }
              }
            ]
          ]
        }
      });
    }
  }

  // @On("text")
  // async msg(@Ctx() ctx: Context<any>){
  //   console.log(ctx.chat)
  // }

  @On("web_app_data")
  async processProgram(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    if (ctx.webAppData.button_text == "Dodaj punkt programu!") {
      const dto: ProgramFormDTO = JSON.parse(ctx.webAppData.data.text());
      dto["tgId"] = tgUser.id;
      dto["tgUsername"] = tgUser.username;
      this.programService.addProgram(dto).then(async (it) => {
        if (it) {
          await ctx.reply(
            "Dziękujemy za zgłoszenie! Administracja przejrzy twoje zgłoszenie!"
          );
        } else {
          await ctx.reply("Wystąpił błąd! Spróbuj ponownie później!");
        }
      });
    }
  }

  @Command("/accept")
  async acceptProgram(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[]
  ) {
    if (this.telegramService.isAdmin(user)) {
      console.log(args);
      let num: number = undefined;
      if (args.length !== 0) {
        num = Number(args[0]);
      }

      if (await this.programService.acceptEvent(num)) {
        await ctx.reply("EVENT ACCEPTED!");
      } else {
        await ctx.reply("ERROR");
      }
    }
  }

  @Command("/deny")
  async DenyProgram(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[]
  ) {
    if (this.telegramService.isAdmin(user)) {
      console.log(args);
      let num: number = undefined;
      if (args.length !== 0) {
        num = Number(args[0]);
      }

      if (this.programService.denyEvent(num)) {
        await ctx.reply("EVENT ACCEPTED!");
      } else {
        await ctx.reply("ERROR");
      }
    }
  }
}
