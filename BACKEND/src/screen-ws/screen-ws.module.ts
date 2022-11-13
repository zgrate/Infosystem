import { Module } from "@nestjs/common";
import { ScreenWsGateway } from "./gateway/screen-ws.gateway";
import { ScreenModule } from "../screen-main/screen.module";
import { AdminMainModule } from "../admin/admin.module";
import { PhotosShowModule } from "../screen-modes/photos-show-mode/photos-show.module";

@Module({
  imports: [ScreenModule, AdminMainModule, PhotosShowModule],
  providers: [ScreenWsGateway]
})
export class ScreenWebSocketModule {
}
