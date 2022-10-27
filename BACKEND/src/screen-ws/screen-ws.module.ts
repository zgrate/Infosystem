import { Module } from "@nestjs/common";
import { ScreenWsGateway } from "./gateway/screen-ws.gateway";


@Module({
  providers: [ScreenWsGateway]
})
export class ScreenWebSocketModule {

}
