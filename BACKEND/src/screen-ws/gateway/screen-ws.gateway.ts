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
import { SCREEN_REFRESH_EVENT, ScreenService } from "../../screen-main/services/screen.service";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { ScreenEntity } from "../../shared/entities/screen.entity";
import { SETTINGS_UPDATE_EVENT } from "../../screen-events/events/settings-update.event";
import { MESSAGE_UPDATE_EVENT } from "../../screen-events/events/messages-update.event";
import { PROGRAM_UPDATE_EVENT } from "../../program/entities/program.entity";

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
  async handleEvent(client: Socket) {
    const token =
      client.handshake.auth?.token || client.handshake.headers.authorization;
    const conn = this.clients.find((conn) => conn.socketId == client.id);
    if (conn == undefined) {
      this.logger.debug("Emm... client not found? Do something?");
      const screen = await this.screenService.getScreenByID(token);
      if(screen != null){
        this.clients = this.clients.filter(it => it.screen.name !== screen.name)
        this.clients.push(new ConnectedClient(client.id, screen, client))
      }else{
        client.disconnect()
      }

    } else {
      this.logger.debug("Ping from " + conn.screen.name);
    }
    client.emit("pong");

  }

  @OnEvent(MESSAGE_UPDATE_EVENT)
  onMessageUpdateEvent() {
    this.logger.debug("Emmiting messages update!");
    this.clients.forEach((x) => x.socket.emit(MESSAGE_UPDATE_EVENT));
  }

  @OnEvent(MODE_CHANGE_EVENT)
  onModeChange(modeChange: ModeChangeEvent) {
    this.logger.debug(
      "Emmimting event! " + modeChange.screenId + " " + modeChange.newMode
    );
    const c = this.clients.filter(
      (conn) => conn.screen.id == modeChange.screenId
    );
    if (c.length > 0) {
      this.logger.debug("Screen connected! Emmiting signal...");
      c.forEach(it => it.socket.emit(MODE_CHANGE_EVENT, modeChange.newMode));
    }
  }

  @OnEvent(SETTINGS_UPDATE_EVENT)
  onSettingsUpdate() {
    this.logger.debug("Emmiting settings update!");
    this.clients.forEach((x) => x.socket.emit(SETTINGS_UPDATE_EVENT));
  }

  @OnEvent(PROGRAM_UPDATE_EVENT)
  onProgramUpdate() {
    this.logger.debug("Emmiting program update!");
    this.clients.forEach((x) => x.socket.emit(PROGRAM_UPDATE_EVENT));
  }

  @OnEvent(SCREEN_REFRESH_EVENT)
  refreshScreens(name: string) {
    if (name == "all") {
      this.clients.forEach((x) => x.socket.emit(SCREEN_REFRESH_EVENT));
      return true;
    } else {
      this.logger.debug(
        this.clients.map((it) => it.socketId + ' ' + it.screen.id),
      );
      const connected = this.clients.filter((it) => it.screen.name === name);
      if (connected.length > 0) {
        connected.forEach(it => it.socket.emit(SCREEN_REFRESH_EVENT));
        return true;
      }
      return false;
    }
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
        this.logger.log(`Screen ${screen.name} Connected!`)
        // const c = this.clients.find((conn) => conn.screen.id == screen.id);
        // if (c !== undefined) {
        //   this.logger.debug("Killing old screen connection!");
        //   c.socket.disconnect();
        //   const index = this.clients.findIndex(it => it.socketId == client.id);
        //   if (index !== -1)
        //     this.clients.splice(index, 1);
        // }
        // this.logger.debug(screen.name + " connected to the gateway!");
        // this.clients.push(new ConnectedClient(client.id, screen, client));
        // return this.screenService.connect(screen.id);
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
