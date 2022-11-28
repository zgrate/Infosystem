import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { User } from "typegram/manage";
import { DbConfigService } from "../../db-config/db-config.service";
import { NEW_EVENT_REGISTERED, PROGRAM_ACCEPTED_EVENT, ProgramEntity } from "../../program/entities/program.entity";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { TelegramCommandEntity } from "../entity/telegram-command.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { handleException } from "../../exception.filter";
import { GET_USER } from "../../accreditation/accreditation.service";
import { AccreditationEntity } from "../../accreditation/entities/accreditation.entity";

export const FormatTime = (data: Date) =>{
  return data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");
}

export const FormatDate = (data: Date) => {
  return data.getDate().toString().padStart(2, "0")  +"-"+(data.getMonth()+1).toString().padStart(2, "0")
}

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  lastRegEvent: number = undefined;
  adminsTG = [];
  logger = new Logger(TelegramService.name);
  private commandsList: TelegramCommandEntity[];

  constructor(
    @InjectBot() private bot: Telegraf,
    private dbConfig: DbConfigService,
    @InjectRepository(TelegramCommandEntity)
    private repository: Repository<TelegramCommandEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async throwException() {
    return this.bot.telegram.sendMessage('621', 'ERROR');
  }

  async isBanned(nickname: string): Promise<boolean> {
    return this.dbConfig
      .config<string[]>('banned', [])
      ?.then((it) => it.includes(nickname));
  }



  @OnEvent(PROGRAM_ACCEPTED_EVENT)
  programAcceptedEvent(entity: ProgramEntity) {
    return this.eventEmitter
      .emitAsync(GET_USER, entity.userId)
      .then(async (user: AccreditationEntity[]) => {
        await this.bot.telegram
          .sendMessage(
            this.dbConfig.configSync('telegram-small-announcement-channel'),
            `<b>Pojawiła się nowa aktywność</b>!
${entity.translations[0].title} dodana przez ${user[0].nickname}
Opis:
${entity.translations[0].description}

Aktywność odbędzie się
${entity.eventStartTime.toLocaleString("pl", {timeZone: "Europe/Warsaw"})}
${
  entity.eventScheduledLocation == 'Aktywność'
    ? ''
    : 'W sali ' + entity.eventScheduledLocation
}`,
            {
              parse_mode: 'HTML',
            },
          )
          .then(async (it) => {
            await this.bot.telegram
              .forwardMessage(
                this.dbConfig.configSync('main_group'),
                it.chat.id,
                it.message_id,
              )
              .catch((it) => handleException(it));
          });
      })
      .catch((ex) => {
        handleException(ex);
      });
  }

  isAdminNickname(nickname: string) {
    return this.adminsTG.includes(nickname?.toLowerCase());
  }

  isAdmin(user: User) {
    return this.adminsTG.includes(user.username?.toLowerCase());
  }

  async getUsernameUsingChatID(tgId: number) {
    return this.bot.telegram
      .getChat(tgId)
      .then((it) => {
        if (it['username']) {
          return it['username'];
        } else {
          return undefined;
        }
      })
      .catch((error) => handleException(error));
  }

  async refreshAdmins() {
    this.adminsTG = await this.dbConfig
      .config<string[]>('tg-admins', ['zgrate'])
      .then((it) => it.map((it) => it.toLowerCase()));
  }

  async sendMessageOnAdminChat(message: any) {
    return await this.bot.telegram.sendMessage(
      await this.dbConfig.config<number>('admin-group'),
      message,
    );
  }

  @OnEvent(NEW_EVENT_REGISTERED)
  async newEventMessage(program: ProgramEntity) {
    const user: AccreditationEntity[] = await this.eventEmitter.emitAsync(
      GET_USER,
      program.userId,
    );
    this.lastRegEvent = program.internalId;
    const html = `
Nowy punkt programu (ID: ${program.internalId})!
Zgłoszony przez: ${program.tgUser} (ID: ${program.userId} - ${
      user[0] ? user[0].nickname : 'BRAK DANYCH W SYSTEMIE'
    })
Tytuł: ${program.translations[0].title}
Opis: ${program.translations[0].description}
Dzień i godzina: ${program.eventStartTime.toLocaleString("pl", {timeZone: "Europe/Warsaw"})}
Zakończenie planowane: ${program.eventEndTime.toLocaleString("pl", {timeZone: "Europe/Warsaw"})}
Sala: ${program.eventScheduledLocation}
/accept or /deny
      `;

    // console.log(html);
    return this.sendMessageOnAdminChat(html).catch((error) =>
      handleException(error),
    );
  }

  async onModuleInit(): Promise<any> {
    await this.refreshAdmins().catch((error) => handleException(error));

    this.commandsList = await this.repository.find();
    await this.loadCommands().catch((error) => handleException(error));
    const me = await this.bot.telegram.getMe();
    await this.bot.telegram.sendMessage(
      this.dbConfig.configSync('admin-group'),
      '@' + me.username + ' - RENIA 2.0 SYSTEMS\nMADE BY Z-GRATE',
    );
  }

  getCommands() {
    return this.commandsList;
  }

  getResponse(command) {
    return this.commandsList.find((it) => it.command == command)?.response;
  }

  async loadCommands() {
    this.commandsList.forEach((it) => {
      this.logger.log('Registering ' + it.command);
      this.bot
        .command(it.command, async (ctx) => {
          const allowed = await this.dbConfig.config('group-chats', []);
          if (
            allowed.includes(ctx.chat.id) ||
            allowed.includes(ctx.chat.type)
          ) {
            const res = this.getResponse(
              ctx.message.text.split(' ')[0].slice(1),
            );
            if (!res) {
              await ctx.reply('Komenda nie znaleziona!');
            } else {
              await ctx.reply(res);
            }
          }
        })
        .catch((error) => handleException(error));
    });
  }

  async getTimeLeftToConvention() {
    return this.dbConfig
      .config('convention-start', new Date(2022, 12, 1, 12, 0).getTime())
      .then((it) => {
        return it - Date.now();
      });
  }

  async onModuleDestroy() {
    const me = await this.bot.telegram.getMe();
    await this.bot.telegram.sendMessage(
      this.dbConfig.configSync('admin-group'),
      '@' + me.username + ' - Shutting down ',
    );
  }
}
