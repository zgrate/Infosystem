import { Command, Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CatchThemAllService } from "./catch-them-all.service";
import { UseGuards } from "@nestjs/common";
import { handleException } from "../../exception.filter";
import { TGUser } from "../../telegram/telegram.decorators";
import { User } from "typegram/manage";
import { BannedGuard } from "../../telegram/guards/banned.guard";
import { PrivateChatGuard } from "../../telegram/guards/private-chat.guard";

@Update()
@UseGuards(BannedGuard, PrivateChatGuard)
export class CatchThemAllUpdate {
  constructor(private catchTheAllService: CatchThemAllService) {
  }

  @On(["document", "video", "photo", "animation"])
  async getDocument(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    if (this.catchTheAllService.isCatching(tgUser.id)) {
      let id = ctx.message?.document?.file_id;
      if (!id && ctx.message?.video.file_id) {
        id = ctx.message.video;
      }
      if (!id && ctx.message?.photo) {
        return ctx.reply("Wyślij w pliku, nie jako zdjęcia!");
      }
      // else if(!id && ctx.message?.photo){
      //   id = ctx.message?.photo.file_id
      // }
      return this.catchTheAllService
        .uploadPhotoRecentlyCatched(tgUser.id, id)
        .then((it) => {
          if (it == "ok") {
            return ctx.reply("Dodano zdjęcie!", {
              reply_to_message_id: ctx.message.id
            });
          } else if (it == "not_catch") {
            return ctx.reply("Nie złapałeś jescze tego fursuita!", {
              reply_to_message_id: ctx.message.id
            });
          } else if (it === "error") {
            return ctx.reply("Wystąpił błąd. Spróbuj ponownie później!", {
              reply_to_message_id: ctx.message.id
            });
          }
        });
    }
  }

  @Command(["done", "koniec"])
  async done(@Ctx() ctx: Context<any>, @TGUser() tg: User) {
    if (this.catchTheAllService.doneCatching(tg.id) == "ok") {
      await ctx.reply("Koniec wysyłania zdjęć!");
    } else {
      await ctx.reply("Nie masz fursuitera zapisanego jako wysyłanie zdjęć!");
    }
  }

  @Command(["upload", "wyslij_zdjecia"])
  async upload(@Ctx() ctx: Context<any>, @TGUser() tg: User) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx
        .reply("Musisz podać Fursuit ID lub częśc nazwy fursuita!")
        .catch((error) => handleException(error));
    } else {
      await this.catchTheAllService
        .switchCatch(commands.join(" "), tg.id)
        .then((it) => {
          if (it === "ok") {
            return ctx.reply("Wyślij teraz zdjęcia w pliku! Zakończ komendą /done");
          } else if (it === "didnt_catch") {
            return ctx.reply("Nie złapałeś jeszcze tego fursuitera!");
          } else if (it === "fursuit_not_found") {
            return ctx.reply("Nie znaleziono fursuita!");
          }
        })
        .catch((error) => handleException(error));
      // await ctx
      //   .reply(
      //     await this.catchTheAllService.switchCatch(commands.join(' '), tg.id),
      //   )
      //   .catch((error) => handleException(error));
    }
  }

  @Command(["fursuits", "fursuity"])
  async fursuitList(@Ctx() ctx: Context<any>) {
    await ctx.reply(
      "Lista fursuiterów znajduje się na https://info.futrolajki.pl/fursuits"
    );
  }

  @Command(["catched", "zlapane"])
  async getCached(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    return this.catchTheAllService
      .getCaughtOfUser(tgUser.id)
      .then(async (it) => {
        if (it.length === 0) {
          await ctx.reply("Nie złapałeś nikogo dotychczas :(");
        } else {
          await ctx.reply("Złapałeś dotychczas: " + it.join(", "));
        }
      });
  }

  @Command(["fursuit_photos"])
  async getFursuitPhotos(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx
        .reply("Musisz podać Fursuit ID!")
        .catch((error) => handleException(error));
    } else {
      return this.catchTheAllService
        .findFursuit(commands[0], true)
        .then(async (fursuit) => {
          if (!fursuit) {
            await ctx.reply("Fursuit nie znaleziono!");
          } else {
            if (fursuit.catched.length === 0) {
              await ctx.reply("Jeszcze nikt nie złapał tego fursuita :(");
            } else {
              fursuit.catched.forEach(async (it) =>
                it.photos.forEach(async (photo) => {
                  await ctx.sendDocument(photo, {
                    caption: fursuit.fursuitName
                  });
                })
              );
            }
          }
        });
    }
  }

  @Command(["catch", "zlap"])
  async catchIt(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    const commands = ctx.message.text.split(" ").slice(1);
    if (commands.length === 0) {
      await ctx.reply("Musisz podać przynajmniej jeden Fursuit ID!");
    } else {
      const status = await this.catchTheAllService.catchFursuit(
        commands[0],
        tgUser.id
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
