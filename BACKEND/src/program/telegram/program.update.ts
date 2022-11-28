import { Command, Ctx, On, Update } from "nestjs-telegraf";
// import { TGUser } from '../../telegram/service/telegram.update';
import { User } from "typegram/manage";
import { Context } from "telegraf";
import { ActivityFormDto } from "./activity-form.dto";
import { ProgramService } from "../program.service";
import { TGAdminAuth, TGArguments, TGUser } from "../../telegram/telegram.decorators";
import { TelegramService } from "../../telegram/service/telegram.service";
import { UseGuards } from "@nestjs/common";
import { BannedGuard } from "../../telegram/guards/banned.guard";
import { PrivateChatGuard } from "../../telegram/guards/private-chat.guard";
import { handleException } from "../../exception.filter";

@Update()
@UseGuards(BannedGuard)
export class ProgramUpdate {
  constructor(
    private programService: ProgramService,
    private telegramService: TelegramService,
  ) {}

  @Command('proponuj')
  @UseGuards(PrivateChatGuard)
  async getProgramProposition(@Ctx() ctx: Context<any>) {
    if (ctx.chat.type === 'private') {
      await ctx
        .reply('Kliknij w przycisk aby dodać aktywność', {
          reply_markup: {
            one_time_keyboard: true,
            keyboard: [
              [
                {
                  text: 'Proponuj!',
                  web_app: {
                    url: 'https://res.futrolajki.pl/test.html',
                  },
                },
              ],
            ],
          },
        })
        .catch((error) => handleException(error));
    }
  }

  // @On("text")
  // async msg(@Ctx() ctx: Context<any>){
  //   console.log(ctx.chat)
  // }

  @On('web_app_data')
  async processActivity(@Ctx() ctx: Context<any>, @TGUser() tgUser: User) {
    // console.log(ctx.webAppData);
    if (ctx.webAppData.button_text == 'Proponuj!') {
      const dto: ActivityFormDto = ctx.webAppData.data.json<ActivityFormDto>();
      dto['tgId'] = tgUser.id;
      dto['tgUsername'] = tgUser.username;
      this.programService
        .addActivity(dto)
        .then(async (it) => {
          if (it) {
            await ctx.reply(
              'Dziękujemy za zgłoszenie! Administracja przejrzy twoje zgłoszenie!',
              {
                reply_markup: {
                  remove_keyboard: true,
                },
              },
            );
          } else {
            await ctx.reply('Wystąpił błąd! Spróbuj ponownie później!', {
              reply_markup: {
                remove_keyboard: true,
              },
            });
          }
        })
        .catch(async (it) => {
          handleException(it);
          await ctx.reply('Wystąpił błąd! Spróbuj ponownie później!', {
            reply_markup: {
              remove_keyboard: true,
            },
          });
        });
    }
  }

  @Command('/accept')
  async acceptProgram(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[],
  ) {
    if (this.telegramService.isAdmin(user)) {
      // console.log(args);
      let num: number = undefined;
      if (args.length !== 0) {
        num = Number(args[0]);
      }

      if (
        await this.programService.acceptEvent(num).catch((it) => {
          handleException(it);
          return undefined;
        })
      ) {
        await ctx.reply('EVENT ACCEPTED!');
      } else {
        await ctx.reply('ERROR');
      }
    }
  }

  @Command('/deny')
  async DenyProgram(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[],
  ) {
    if (this.telegramService.isAdmin(user)) {
      // console.log(args);
      let num: number = undefined;
      if (args.length !== 0) {
        num = Number(args[0]);
      }

      if (await this.programService.denyEvent(num)) {
        await ctx.reply('EVENT DENIED!');
      } else {
        await ctx.reply('ERROR');
      }
    }
  }

  @Command('/program_search')
  @TGAdminAuth()
  async programSearch(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[],
  ) {
    await this.programService.searchProgram(args.join(' ')).then((items) => {
      return ctx.reply(
        items
          .map(
            (item) =>
              `id=${item.internalId}, external=${item.externalId}, name=${item.title}`,
          )
          .join('\n'),
      );
    });
  }

  @Command('/delay')
  @TGAdminAuth()
  async programDelay(
    @Ctx() ctx: Context<any>,
    @TGUser() user: User,
    @TGArguments() args: string[],
  ) {
    if (args.length !== 2) {
      await ctx.reply('/delay <id> <minutes>');
    } else {
      await this.programService
        .delayProgram(Number(args[0]), Number(args[1]))
        .then((it) => {
          return ctx.reply(`${it}`);
        })
        .catch((err) => {
          handleException(err);
        });
    }
  }

  @Command(['/activity', '/aktywnosci'])
  async getActivityHelp(@Ctx() ctx: Context<any>) {
    await ctx.reply(
      '<b>Zgłaszanie aktywności na konwencie!</b>\n' +
        '\n' +
        'Masz pomysł na integrację, aktywność, wspólna grę, sesję zdjęciową, koncert, prelekcje, cokolwiek, do czego fajnie zebrać ekipę lub chciałbyś/chciałabyś ogłosić??\n' +
        '\n' +
        'Zapraszamy do zgłaszania własnych aktywności!\n' +
        'Gdy zgłosisz aktywność, to pojawi się ona na ekranach w przestrzeniach wspólnych konwentu oraz wysłane zostanie ogłoszenie na grupę drobne ogłoszenia!\n' +
        '\n' +
        '<b>Warunki zgłoszenia aktywności:</b>\n' +
        '- Musi być to wydarzenie SFW!\n' +
        '- Aktywność może być w dowolnym pomieszczeniu na konwencie: jadalni, prelekcyjnej, mainstage, czy nawet w pokoju\n' +
        '- Jeżeli chcesz zrobić coś na mainstage lub w prelekcyjnej, to wymagany jest margines 15min do oficjalnych punktów programu!\n' +
        '- Nie zapewniamy pomocy Helperów, natomiast przyjdź do conopsa jeżeli takowej potrzebujesz, postaramy się pomóc!\n' +
        '\n' +
        'Aby zgłosić aktywność, wpisz komendę /proponuj oraz kliknij w przycisk, który pojawi się na dole. Wypełnij formularz dotyczący aktywności i prześlij go. Gdy administrator zaakceptuje aktywność automatycznie dostaniesz wiadomość o tym i pojawi się na ekranach',
      {
        parse_mode: 'HTML',
        reply_markup: {
          remove_keyboard: true,
        },
      },
    );
  }
}
