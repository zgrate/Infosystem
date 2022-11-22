import { InjectBot, Update } from "nestjs-telegraf";
import { Telegraf } from "telegraf";
import { DbConfigService } from "../../db-config/db-config.service";

@Update()
export class TelegramCommandsUpdate {

  constructor(
    @InjectBot() private bot: Telegraf,
    private dbConfig: DbConfigService
  ) {
  }


}
