import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ScreenEntity } from "../../shared/entities/definitions";
import { randomInt } from "crypto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ScreenService {
  constructor(
    @InjectRepository(ScreenEntity) private screenDB: Repository<ScreenEntity>
  ) {
  }

  getScreensAdmin(): Promise<ScreenEntity[]> {
    return this.screenDB.find();
  }

  getScreenByID(id: string): Promise<ScreenEntity> {
    return this.screenDB.findOneBy({ id: id });
  }

  getScreenByIDUnregistered(id: string): Promise<any> {
    return this.getScreenByID(id).then((screen) => {
      if (screen != null) {
        const {
          authKey,
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

  async authScreen(screenId: string, authKey: string) {
    const screen = await this.getScreenByID(screenId);
    if (screen == null || screen.isRegistered || screen.authKey != authKey) {
      return false;
    }
    screen.isRegistered = true;
    await this.screenDB.save(screen);
    return true;
  }

  async setMode(screenId: string, mode: string): Promise<boolean> {
    const screen = await this.getScreenWithAuthCheck(screenId);
    if (screen === undefined)
      return false;
    screen.currentDisplayMode = mode;
    await this.screenDB.save(screen);
    return true;

  }
}
