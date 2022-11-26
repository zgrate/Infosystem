import { Module } from "@nestjs/common";
import { TelegramService } from "./service/telegram.service";
import { TelegramUpdate } from "./service/telegram.update";
import { DbConfigModule } from "../db-config/db-config.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegramCommandsUpdate } from "./service/telegram-commands.update";
import { TelegramCommandEntity } from "./entity/telegram-command.entity";
import { AuthorisedTgUserEntity } from "./entity/authorised-tg-user.entity";

@Module({
  imports: [
    DbConfigModule,
    TypeOrmModule.forFeature([TelegramCommandEntity, AuthorisedTgUserEntity]),
  ],
  providers: [TelegramUpdate, TelegramService, TelegramCommandsUpdate],
  // controllers: [TelegramUpdate]
  // providers: [],
  exports: [TelegramService],
})
export class TelegramModule {}
