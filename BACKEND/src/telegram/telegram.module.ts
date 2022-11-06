import { Module } from "@nestjs/common";
import { TelegramService } from "./service/telegram.service";
import { TelegramUpdate } from "./service/telegram.update";

@Module({
  imports: [],
  providers: [TelegramUpdate, TelegramService],
  // controllers: [TelegramUpdate]
  // providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {
}
