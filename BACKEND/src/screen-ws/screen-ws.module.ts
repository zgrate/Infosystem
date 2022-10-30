import { Module } from "@nestjs/common";
import { ScreenWsGateway } from "./gateway/screen-ws.gateway";
import { ScreenModule } from "../screen-main/screen.module";
import { AdminMainModule } from "../admin/admin.module";

@Module({
  imports: [ScreenModule, AdminMainModule],
  providers: [ScreenWsGateway]
})
export class ScreenWebSocketModule {
}
