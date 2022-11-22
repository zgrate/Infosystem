import { Module } from "@nestjs/common";
import { CatchThemAllModule } from "../../catch-them-all/base/catch-them-all.module";
import { ChatForwarderModule } from "../chat-forwarder/chat-forwarder.module";
import { ListenerService } from "./listener.service";

@Module({
  imports: [CatchThemAllModule, ChatForwarderModule],
  providers: [ListenerService]
})
export class ListenerModule {
}
