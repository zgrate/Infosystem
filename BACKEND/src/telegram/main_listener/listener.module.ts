import { Module } from "@nestjs/common";
import { CatchThemAllModule } from "../../catch-them-all/base/catch-them-all.module";
import { ChatForwarderModule } from "../chat-forwarder/chat-forwarder.module";
import { ListenerService } from "./listener.service";
import { PhotoUploadModule } from "../photo-uploader/photo-upload.module";
import { DbConfigModule } from "../../db-config/db-config.module";

@Module({
  imports: [CatchThemAllModule, ChatForwarderModule, PhotoUploadModule, DbConfigModule],
  providers: [ListenerService]
})
export class ListenerModule {
}
