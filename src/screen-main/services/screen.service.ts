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

  getScreenByID(id: number): Promise<ScreenEntity> {
    return this.screenDB.findOneBy({ id: id });
  }

  async registerNewScreen(clientIp: string): Promise<ScreenEntity> {
    const authcode = randomInt(100000, 999999);
    const screen = new ScreenEntity();
    screen.authKey = authcode.toString();
    screen.name = randomStringGenerator();
    screen.lastIp = clientIp;

    await this.screenDB.save(screen);

    console.log(screen.id);
    return screen;
  }
}
