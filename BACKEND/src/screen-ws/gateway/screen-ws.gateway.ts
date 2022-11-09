import {
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
import { Logger, UnauthorizedException } from "@nestjs/common";
import { ScreenEntity } from "../../shared/entities/screen.entity";
import { SETTINGS_UPDATE_EVENT } from "../../screen-events/events/settings-update.event";
import { MESSAGE_UPDATE_EVENT } from "../../screen-events/events/messages-update.event";

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

  private readonly logger = new Logger(ScreenWsGateway.name);

  constructor(private screenService: ScreenService) {
  }

  @SubscribeMessage("ping")
  handleEvent(client: Socket) {
    const conn = this.clients.find((conn) => conn.socketId == client.id);
    if (conn == undefined) {
      this.logger.debug("Emm... client not found? Do something?");
      client.disconnect();
    } else {
      this.logger.debug("Ping from " + conn.screen.name);
      client.emit("pong");
    }
  }

  @OnEvent(MESSAGE_UPDATE_EVENT)
  onMessageUpdateEvent() {
    this.logger.debug("Emmiting messages update!");
    this.clients.forEach(x => x.socket.emit(MESSAGE_UPDATE_EVENT));

  }

  @OnEvent(MODE_CHANGE_EVENT)
  onModeChange(modeChange: ModeChangeEvent) {
    this.logger.debug("Emmimting event! " + modeChange.screenId + " " + modeChange.newMode);
    const c = this.clients.find(
      (conn) => conn.screen.id == modeChange.screenId
    );
    if (c !== undefined) {
      this.logger.debug("Screen connected! Emmiting signal...");
      c.socket.emit(MODE_CHANGE_EVENT, modeChange.newMode);
    }
  }

  @OnEvent(SETTINGS_UPDATE_EVENT)
  onSettingsUpdate() {
    this.logger.debug("Emmiting settings update!");
    this.clients.forEach(x => x.socket.emit(SETTINGS_UPDATE_EVENT));
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    const token =
      client.handshake.auth?.token || client.handshake.headers.authorization;
    this.logger.debug("Trying to connect with token " + token);
    if (token !== undefined) {
      const screen = await this.screenService.getScreenByID(token);
      if (screen === null) {
        client.disconnect();
        return new UnauthorizedException();
      } else {
        const c = this.clients.find(
          (conn) => conn.screen.id == screen.id
        );
        if (c !== undefined) {
          this.logger.debug("Killing old screen connection!");
          c.socket.disconnect();
        }
        this.logger.debug(screen.name + " connected to the gateway!");
        this.clients.push(new ConnectedClient(client.id, screen, client));
        return this.screenService.connect(screen.id);
      }
    } else {
      client.disconnect();
      return new UnauthorizedException();
    }
  }

  handleDisconnect(client: Socket): any {
    const conn = this.clients.findIndex((conn) => conn.socketId == client.id);
    if (conn !== -1) {
      const screen = this.clients.splice(conn, 1)[0];
      this.screenService.disconnect(screen.screen.id);
      this.logger.debug("Screen " + screen.screen.name + " disconnected!");

    }
  }
}
