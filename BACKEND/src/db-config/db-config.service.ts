import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DbConfigEntity } from "./db-config.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";


export type SettingsKeys =
  "admin-group"
  | "photos-source"
  | "group-chats"
  | "admin-password"
  | "acc-password"
  | "main-stream-link"
  | "tg-admins"

@Injectable()
export class DbConfigService implements OnModuleInit {
  private configurationsTemp: DbConfigEntity[] = [];

  constructor(
    @InjectRepository(DbConfigEntity)
    private repository: Repository<DbConfigEntity>
  ) {
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshCache() {
    await this.catchRefresh();
  }

  catchRefresh() {
    return this.repository.find().then((items) => {
      this.configurationsTemp = items;
    });
  }

  async config<T>(key: SettingsKeys, defaultValue: T = undefined): Promise<T> {
    const a = this.configurationsTemp.find((it) => it.key == key);
    if (a !== undefined) {
      return a.value;
    }
    return this.repository.findOneBy({ key: key }).then(async (it) => {
      if (it == undefined) {
        const item = new DbConfigEntity();
        item.key = key;
        item.value = defaultValue;
        this.configurationsTemp.push(item);
        await this.repository.save(item);
        return defaultValue;
      } else {
        return it.value;
      }
    });
  }

  async onModuleInit() {
    await this.refreshCache();
    console.log(this.configurationsTemp);
  }
}
