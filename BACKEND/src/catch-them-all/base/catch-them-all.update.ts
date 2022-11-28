import { Command, Ctx, InjectBot, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { CatchThemAllService } from "./catch-them-all.service";
import { UseGuards } from "@nestjs/common";
import { handleException } from "../../exception.filter";
import { TGUser } from "../../telegram/telegram.decorators";
import { User } from "typegram/manage";
import { BannedGuard } from "../../telegram/guards/banned.guard";
import { PrivateChatGuard } from "../../telegram/guards/private-chat.guard";

@Update()
@UseGuards(BannedGuard)
export class CatchThemAllUpdate {
  constructor(
    private catchTheAllService: CatchThemAllService,
    @InjectBot() private bot: Telegraf,
  ) {}

  // @On(["document", "video", "photo", "animation"])
  async getDocument(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {}

  @Command(['done', 'koniec'])
  @UseGuards(PrivateChatGuard)
  async done(@Ctx() ctx: Context<any>, @TGUser() tg: User) {
    if (this.catchTheAllService.doneCatching(tg.id) == 'ok') {
      await ctx.reply('Koniec wysyłania zdjęć!');
    } else {
      await ctx.reply('Nie masz fursuitera zapisanego jako wysyłanie zdjęć!');
    }
  }

  @Command(['catch_help', 'zlap_pomoc'])
  async catchHelp(@Ctx() ctx: Context<any>) {
    await ctx
      .reply(
        '<b>W jaki sposób łapać fursuiterów?</b>\n' +
          'Każdy fursuiter będzie miał specjalnego Badge fursuitowego (zobacz zdjęcie). W lewym górnym rogu tego badge znajduje się <b>5 znakowy kod</b> ' +
          'Ten kod należy zapisać oraz (opcjonalnie) <b>zrobić sobie zdjecie z fursuiterem</b>.\n' +
          'Następnie za pomocą komendy /zlap łapiesz fursuitera.\n Np dla zdjęcia wpisujesz /zlap 00000\n' +
          'System zwróci potwierdzenie i poprosi cię o wysłanie zdjęć. <b>Wyślij zdjęcia z fursuiterem w pliku lub jako wideo</b>\n' +
          'Zakończ wysyłanie zdjęć komendą /done\n' +
          'Możesz zobaczyć złapanych fursuiterów komendą /zlapane\n' +
          'Jezeli chcesz dodać zdjęcia do złapanych już fursuiterów, wpisz komendę /wyslij_zdjecia nazwa_fursuita, np /wyslij_zdjecia Z-Grate\n' +
          'Możesz też wpisać kod z badge, np /wyslij_zdjecia 00000\n' +
          'Lista fursuiterów znajduje się pod komendą /fursuity',
        { parse_mode: 'HTML' },
      )
      .then(async () => {
        await ctx.replyWithPhoto({
          url: 'https://res.futrolajki.pl/sample_fursuit_badge.jpg',
        });
      })
      .catch((error) => handleException(error));
  }

  @Command(['upload', 'wyslij_zdjecia'])
  @UseGuards(PrivateChatGuard)
  async upload(@Ctx() ctx: Context<any>, @TGUser() tg: User) {
    const commands = ctx.message.text.split(' ').slice(1);
    if (commands.length === 0) {
      await ctx
        .reply('Musisz podać Fursuit ID lub częśc nazwy fursuita!')
        .catch((error) => handleException(error));
    } else {
      await this.catchTheAllService
        .switchCatch(commands.join(' '), tg.id)
        .then((it) => {
          if (it === 'ok') {
            return ctx.reply(
              'Wyślij teraz zdjęcia w pliku! Zakończ komendą /done',
            );
          } else if (it === 'didnt_catch') {
            return ctx.reply('Nie złapałeś jeszcze tego fursuitera!');
          } else if (it === 'fursuit_not_found') {
            return ctx.reply('Nie znaleziono fursuita!');
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

  @Command(['fursuits', 'fursuity'])
  async fursuitList(@Ctx() ctx: Context<any>) {
    await ctx.reply(
      'Lista fursuiterów znajduje się na https://info.futrolajki.pl/fursuits',
    );
  }

  @Command(['catched', 'zlapane'])
  @UseGuards(PrivateChatGuard)
  async getCached(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    return this.catchTheAllService
      .getCaughtOfUser(tgUser.id)
      .then(async (it) => {
        if (it.length === 0) {
          await ctx.reply('Nie złapałeś nikogo dotychczas :(');
        } else {
          await ctx.reply('Złapałeś dotychczas: ' + it.join(', '));
        }
      })
      .catch((error) => handleException(error));
  }

  @Command(['fursuit_photos'])
  async getFursuitPhotos(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    const commands = ctx.message.text.split(' ').slice(1);
    if (commands.length === 0) {
      await ctx
        .reply('Musisz podać Fursuit ID!')
        .catch((error) => handleException(error));
    } else {
      return this.catchTheAllService
        .findFursuit(commands[0], true)
        .then(async (fursuit) => {
          if (!fursuit) {
            await ctx.reply('Fursuit nie znaleziono!');
          } else {
            if (fursuit.catched.length === 0) {
              await ctx.reply('Jeszcze nikt nie złapał tego fursuita :(');
            } else {
              fursuit.catched.forEach(async (it) =>
                it.photos.forEach(async (photo) => {
                  await ctx
                    .sendDocument(photo, {
                      caption: fursuit.fursuitName,
                    })
                    .catch((it) => {
                      handleException(it);
                    });
                }),
              );
            }
          }
        })
        .catch((error) => handleException(error));
    }
  }

  @Command(['catch', 'zlap'])
  @UseGuards(PrivateChatGuard)
  async catchIt(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    const commands = ctx.message.text.split(' ').slice(1);
    if (commands.length === 0) {
      await ctx.reply('Musisz podać przynajmniej jeden Fursuit ID!');
    } else {
      if (commands[0] === '00000') {
        await ctx.reply('Beep boop! Dobrze wpisałeś! :P');
        return;
      }
      const status = await this.catchTheAllService.catchFursuit(
        commands[0],
        tgUser.id,
        !tgUser.username ? tgUser.first_name + (!tgUser.last_name ? "" : tgUser.last_name) : tgUser.username,
      );
      if (status == 'error')
        await ctx.reply('Fursuit ' + commands[0] + ' nie znaleziony!');
      else if (status == 'db_error') {
        await ctx.reply('Wystąpił problem. Prosimy spróbować później!');
      } else if (status == 'caught') {
        await ctx.reply('Fursuit został już złapany!');
      } else {
        await ctx.reply(
          'Złapano ' +
            status +
            '\nAby dokończyć łapanie, wyślij przynajmniej 1 zdjęcie (w pliku) z fursuiterem. Zakoncz wysyłanie /done',
        );
      }
    }
  }
}
