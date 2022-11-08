import { InjectBot, Update } from "nestjs-telegraf";
import { TelegramCommandEntity } from "../entity/telegram-command.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Telegraf } from "telegraf";
import { OnModuleInit } from "@nestjs/common";
import { DbConfigService } from "../../db-config/db-config.service";

@Update()
export class TelegramCommandsUpdate implements OnModuleInit {
  private commandsList: TelegramCommandEntity[];

  constructor(
    @InjectRepository(TelegramCommandEntity)
    private repository: Repository<TelegramCommandEntity>,
    @InjectBot() private bot: Telegraf,
    private dbConfig: DbConfigService
  ) {
  }

  async onModuleInit(): Promise<any> {
    this.commandsList = await this.repository.find();
    await this.loadCommands();
  }

  getResponse(command) {
    return this.commandsList.find((it) => it.command == command)?.response;
  }

  async loadCommands() {
    this.commandsList.forEach((it) => {
      console.log(
        "Registering " + it.command + " with response " + it.response
      );
      this.bot.command(it.command, async (ctx) => {
        console.log(it.command);
        const allowed = await this.dbConfig.config("group-chats", []);
        console.log(allowed);
        console.log(ctx.chat.type);
        if (ctx.chat.id in allowed || ctx.chat.type in allowed) {
          const res = this.getResponse(ctx.message.text.split(" ")[0].slice(1));
          if (res === undefined) {
            await ctx.reply("Komenda nie znaleziona!");
          } else {
            await ctx.reply(res);
          }
        }
      });
    });
  }
}
