import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DbConfigEntity } from "./db-config.entity";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { OnEvent } from "@nestjs/event-emitter";
import { REFRESH_CACHE } from "../admin/admin.events";

export type SettingsKeys =
  | "admin-group"
  | "photos-source"
  | "group-chats"
  | "admin-password"
  | "acc-password"
  | "main-stream-link"
  | "tg-admins"
  | "org_chat"
  | "security_chat"
  | "chat-forward-timeout"
  | "photos_chat"
  | "admin-message"
  | "banned"
  | "convention-start";

@Injectable()
export class DbConfigService implements OnModuleInit {
  private configurationsTemp: DbConfigEntity[] = [];
  private logger = new Logger(DbConfigService.name);

  constructor(
    @InjectRepository(DbConfigEntity)
    private repository: Repository<DbConfigEntity>
  ) {
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async refreshCache() {
    await this.cacheRefresh();
  }

  @OnEvent(REFRESH_CACHE)
  cacheRefresh() {
    this.logger.log("Refreshing settings....");
    return this.repository.find().then((items) => {
      this.configurationsTemp = items;
      this.logger.debug("Loaded " + items.length);
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
  }

  async saveConfig(key: SettingsKeys, value: any) {
    const k: DbConfigEntity = {
      key: key,
      value: value
    };
    return this.repository.save(k).then(() => this.cacheRefresh());
  }
}
