import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnEvent } from "@nestjs/event-emitter";
import { MODE_CHANGE_EVENT, ModeChangeEvent } from "../../screen-events/events/mode-change.event";
import { ScreenService } from "../../screen-main/services/screen.service";
import { UnauthorizedException } from "@nestjs/common";
import { ScreenEntity } from "../../shared/entities/definitions";

export class ConnectedClient {
  socketId: string;
  screen: ScreenEntity;
  socket: Socket;

  constructor(socketId: string, screen: ScreenEntity, socket: Socket) {
    this.socketId = socketId;
    this.screen = screen;
    this.socket = socket;
  }
}

@WebSocketGateway({
  transports: ["websocket"],
  cors: true
  // port: parseInt(process.env.WEBSOCKET_PORT || ''),
})
export class ScreenWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  clients: ConnectedClient[] = [];
  @WebSocketServer()
  server!: Server;

  constructor(private screenService: ScreenService) {
  }

  @SubscribeMessage("test")
  handleEvent(@MessageBody() body, @ConnectedSocket() client: Socket) {
    console.log("TEST ", body);
    client.emit("mode", "TEST");
    this.server.emit("mode", "GLOBAL?");
    return "TEST2";
  }

  @OnEvent(MODE_CHANGE_EVENT)
  onModeChange(modeChange: ModeChangeEvent) {
    const c = this.clients.find(
      (conn) => conn.screen.id == modeChange.screenId
    );
    if (c !== undefined) {
      c.socket.emit(MODE_CHANGE_EVENT, modeChange.newMode);
    }
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const token =
      client.handshake.auth?.token || client.handshake.headers.authorization;

    if (token !== undefined) {
      const screen = await this.screenService.getScreenByID(token);
      console.log(screen);
      if (screen === null) {
        client.disconnect();
        return new UnauthorizedException();
      } else {
        this.clients.push(new ConnectedClient(client.id, screen, client));
      }
    } else {
      return new UnauthorizedException();
    }
  }

  handleDisconnect(client: Socket): any {
    const conn = this.clients.findIndex((conn) => conn.socketId == client.id);
    if (conn !== -1) {
      this.clients.splice(conn, 1);
    }
    console.log(this.clients);
  }
}
