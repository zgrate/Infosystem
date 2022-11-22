import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { User } from "typegram/manage";
import { DbConfigService } from "../../db-config/db-config.service";
import { NEW_EVENT_REGISTERED, ProgramEntity } from "../../program/entities/program.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { TelegramCommandEntity } from "../entity/telegram-command.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { handleException } from "../../exception.filter";

@Injectable()
export class TelegramService implements OnModuleInit {
  lastRegEvent: number = undefined;
  adminsTG = [];
  logger = new Logger(TelegramService.name);
  private commandsList: TelegramCommandEntity[];

  constructor(
    @InjectBot() private bot: Telegraf,
    private dbConfig: DbConfigService,
    @InjectRepository(TelegramCommandEntity)
    private repository: Repository<TelegramCommandEntity>
  ) {
  }

  async throwException() {
    return this.bot.telegram.sendMessage("621", "ERROR");
  }

  async isBanned(nickname: string): Promise<boolean> {
    return this.dbConfig
      .config<string[]>("banned", [])
      ?.then((it) => it.includes(nickname));
  }

  isAdminNickname(nickname: string) {
    return this.adminsTG.includes(nickname?.toLowerCase());
  }

  isAdmin(user: User) {
    return this.adminsTG.includes(user.username?.toLowerCase());
  }

  async getUsernameUsingChatID(tgId: number) {
    return this.bot.telegram.getChat(tgId).then((it) => {
      if (it["username"]) {
        return it["username"];
      } else {
        return undefined;
      }
    }).catch(error => handleException(error));
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
    return this.sendMessageOnAdminChat(html).catch(error => handleException(error));
  }

  async onModuleInit(): Promise<any> {
    await this.refreshAdmins().catch(error => handleException(error));

    this.commandsList = await this.repository.find();
    await this.loadCommands().catch(error => handleException(error));
  }

  getCommands() {
    return this.commandsList;
  }

  getResponse(command) {
    return this.commandsList.find((it) => it.command == command)?.response;
  }

  async loadCommands() {
    this.commandsList.forEach((it) => {
      this.logger.log(
        "Registering " + it.command
      );
      this.bot.command(it.command, async (ctx) => {
        const allowed = await this.dbConfig.config("group-chats", []);
        if (allowed.includes(ctx.chat.id) || allowed.includes(ctx.chat.type)) {
          const res = this.getResponse(ctx.message.text.split(" ")[0].slice(1));
          if (!res) {
            await ctx.reply("Komenda nie znaleziona!");
          } else {
            await ctx.reply(res);
          }
        }
      }).catch(error => handleException(error));
    });
  }

  async getTimeLeftToConvention() {
    return this.dbConfig
      .config("convention-start", new Date(2022, 12, 1, 12, 0).getTime())
      .then((it) => {
        return (it - Date.now());
      });
  }
}
