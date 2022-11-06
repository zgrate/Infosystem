import { Command, Ctx, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { AccreditationService } from "./accreditation.service";
import { TelegramService } from "../telegram/service/telegram.service";

@Update()
export class AccreditationUpdateTg {
  constructor(
    private accreditationService: AccreditationService,
    private tgService: TelegramService
  ) {
  }

  @Command("check")
  async checkUser(@Ctx() ctx: Context<any>) {
    console.log(ctx.chat.username);
    if (this.tgService.isAdmin(ctx.chat.username)) {
      const commands: string = ctx.message.text.split(" ").slice(1).join(" ");
      const ren = await this.accreditationService.findOneFilter(commands);

      if (ren === undefined) {
        await ctx.reply("Nie znaleziono!");
      } else {
        await ctx.reply(`
Id i Nick: ${ren.id} - ${ren.nickname}
Imię nazwisko data urodzenia ${ren.name} ${ren.surname} ${ren.birthDate}
Email wybrany plan${ren.email} ${ren.planSelected}
Pokój numer ${ren.roomNumber} Śniadanie ${ren.breakfast} Czy jest top 100? ${
          ren.top100
        }
Czy klucze wybrane? ${!ren.keysFree} Czy zameldowany ? ${ren.checkIn}
Hotel płatność ${ren.roomPayment} Hotel niezaplacone ${
          ren.outStandingPaymentHotel
        }
TShirty: ${ren.tshirts.join(", ")} 
Badge: ${ren.badges.join(", ")}

Info:
${ren.additionalInfo}
    `);
      }
    } else {
      await ctx.reply("No");
    }
  }
}
