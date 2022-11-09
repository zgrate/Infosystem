import { Injectable, OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { ScreenEntity } from "../../shared/entities/screen.entity";
import { randomInt } from "crypto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MODE_CHANGE_EVENT, ModeChangeEvent } from "../../screen-events/events/mode-change.event";

export type ModeType = "program" | "info" | "stream" | "document";

@Injectable()
export class ScreenService implements OnModuleInit {
  constructor(
    @InjectRepository(ScreenEntity) private screenDB: Repository<ScreenEntity>,
    private eventEmitter: EventEmitter2
  ) {
  }

  getScreensAdmin(): Promise<ScreenEntity[]> {
    return this.screenDB.find();
  }

  getScreenByID(id: string): Promise<ScreenEntity> {
    return this.screenDB.findOneBy({ id: id });
  }

  getScreenByKey(key: string): Promise<ScreenEntity> {
    return this.screenDB.findOneBy({ authKey: key });
  }

  getScreenByIDUnregistered(id: string): Promise<any> {
    return this.getScreenByID(id).then((screen) => {
      if (screen != null) {
        const {
          isConnected,
          currentDisplayMode,
          lastConnection,
          lastIp,
          ...results
        } = screen;
        return results;
      } else {
        return null;
      }
    });
  }

  async registerNewScreen(clientIp: string): Promise<ScreenEntity> {
    const authcode = randomInt(100000, 999999);
    const screen = new ScreenEntity();
    screen.authKey = authcode.toString();
    screen.name = randomStringGenerator();
    screen.lastIp = clientIp;
    screen.id = randomStringGenerator();

    await this.screenDB.save(screen);

    console.log(screen.id);
    return screen;
  }

  async getScreenWithAuthCheck(screenId: string) {
    const screen = await this.getScreenByID(screenId);
    if (screen !== null && screen.isRegistered) {
      return screen;
    }
    return undefined;
  }

  async authScreen(authKey: string) {
    const screen = await this.getScreenByKey(authKey);
    if (screen == null || screen.isRegistered || screen.authKey != authKey) {
      return false;
    }
    screen.isRegistered = true;
    await this.screenDB.save(screen);
    return true;
  }

  async setMode(screenId: string, mode: string): Promise<boolean> {
    const screen = await this.getScreenWithAuthCheck(screenId);
    if (screen === undefined) return false;
    screen.currentDisplayMode = mode;
    await this.screenDB.save(screen);
    return true;
  }

  async setAllModes(newMode: ModeType): Promise<boolean> {
    return this.screenDB.findBy({ isRegistered: true }).then((value) => {
      value.forEach((value) => {
        value.currentDisplayMode = newMode;
        this.eventEmitter.emit(
          MODE_CHANGE_EVENT,
          new ModeChangeEvent(value.id, newMode)
        );
      });
      return true;
    });
  }

  onModuleInit(): any {
    this.screenDB
      .find()
      .then((it) => {
        {
          it.forEach((it) => (it.isConnected = false));
          return it;
        }
      })
      .then(async (it) => await this.screenDB.save(it));
  }

  connect(id: string) {
    return this.screenDB.update({ id: id }, { isConnected: true });
  }

  disconnect(id: string) {
    return this.screenDB.update({ id: id }, { isConnected: false });
  }
}
