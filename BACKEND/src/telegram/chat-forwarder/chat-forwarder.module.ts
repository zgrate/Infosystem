import { Module } from "@nestjs/common";
import { ChatForwarderUpdate } from "./chat-forwarder.update";
import { ChatForwarderService } from "./chat-forwarder.service";
import { DbConfigModule } from "../../db-config/db-config.module";

@Module({
  imports: [DbConfigModule],
  providers: [ChatForwarderUpdate, ChatForwarderService]
})
export class ChatForwarderModule {
}
