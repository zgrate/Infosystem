import { Module } from "@nestjs/common";
import { ChatForwarderUpdate } from "./chat-forwarder.update";
import { ChatForwarderService } from "./chat-forwarder.service";
import { DbConfigModule } from "../../db-config/db-config.module";
import { TelegramModule } from "../telegram.module";

@Module({
  imports: [DbConfigModule, TelegramModule],
  providers: [ChatForwarderUpdate, ChatForwarderService],
  exports: [ChatForwarderService]
})
export class ChatForwarderModule {
}
