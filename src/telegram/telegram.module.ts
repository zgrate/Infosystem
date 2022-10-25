import { Module } from "@nestjs/common";
import { TelegramService } from "./service/telegram.service";

@Module({
  providers: [TelegramService],
  exports: [TelegramService]
})
export class TelegramModule {
}
