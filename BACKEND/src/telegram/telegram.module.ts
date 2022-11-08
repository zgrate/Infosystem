import { Module } from "@nestjs/common";
import { TelegramService } from "./service/telegram.service";
import { TelegramUpdate } from "./service/telegram.update";
import { DbConfigModule } from "../db-config/db-config.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TelegramCommandsUpdate } from "./service/telegram-commands.update";
import { TelegramCommandEntity } from "./entity/telegram-command.entity";

@Module({
  imports: [DbConfigModule, TypeOrmModule.forFeature([TelegramCommandEntity])],
  providers: [TelegramUpdate, TelegramService, TelegramCommandsUpdate],
  // controllers: [TelegramUpdate]
  // providers: [],
  exports: [TelegramService]
})
export class TelegramModule {
}
