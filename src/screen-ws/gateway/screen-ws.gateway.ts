import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class ScreenWsGateway {
  @SubscribeMessage("mode")
  handleEvent(@MessageBody() body) {
    return body;
  }
}
