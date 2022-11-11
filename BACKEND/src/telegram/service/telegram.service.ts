import { Injectable, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { User } from "typegram/manage";
import { DbConfigService } from "../../db-config/db-config.service";
import { NEW_EVENT_REGISTERED, ProgramEntity } from "../../program/entities/program.entity";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class TelegramService implements OnModuleInit {

  lastRegEvent: number = undefined;
  adminsTG = [];

  constructor(
    @InjectBot() private bot: Telegraf,
    private dbConfig: DbConfigService
  ) {
  }

  async getUsernameUsingChatID(tgId: number) {
    return this.bot.telegram.getChat(tgId).then((it) => {
      if (it["username"]) {
        return it["username"];
      } else {
        return undefined;
      }
    });
  }

  isAdminNickname(nickname: string) {
    return this.adminsTG.includes(nickname?.toLowerCase());
  }

  isAdmin(user: User) {
    return this.adminsTG.includes(user.username?.toLowerCase());
  }

  async refreshAdmins() {
    this.adminsTG = await this.dbConfig
      .config<string[]>("tg-admins", ["zgrate"])
      .then((it) => it.map((it) => it.toLowerCase()));
  }

  async sendMessageOnAdminChat(message: any) {
    return await this.bot.telegram.sendMessage(
      await this.dbConfig.config<number>("admin-group"),
      message
    );
  }


  @OnEvent(NEW_EVENT_REGISTERED)
  newEventMessage(program: ProgramEntity) {
    this.lastRegEvent = program.internalId;
    const html = `
Nowy punkt programu (ID: ${program.internalId})!
Zgłoszony przez: ${program.tgUser} (ID: ${program.userId})
Tytuł: ${program.translations[0].title}
Opis: ${program.translations[0].description}
Dzień i godzina: ${program.eventStartTime}
Sala: ${program.eventScheduledLocation}
/accept or /deny
      `;

    console.log(html);
    return this.sendMessageOnAdminChat(html);
  }

  async onModuleInit() {
    await this.refreshAdmins();
  }
}
