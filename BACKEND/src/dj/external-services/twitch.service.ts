import TwitchApi from "node-twitch";
import { Injectable, Logger } from "@nestjs/common";
import { DbConfigService } from "../../db-config/db-config.service";
import { handleException } from "../../exception.filter";
import { Cron, CronExpression } from "@nestjs/schedule";

export interface TwitchStats {
  name: string;
  isOnline: boolean;
  viewerCount: number;
}

@Injectable()
export class TwitchService {
  private twitchApi = new TwitchApi({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_SECRET,
  });
  constructor(private dbConfig: DbConfigService) {}
  private twitchCache: TwitchStats[] = [];
  private logger = new Logger(TwitchService.name)
  private lastCacheRefresh = 0;

  @Cron(CronExpression.EVERY_5_SECONDS)
  async refreshTwitchStats() {
    return this.dbConfig
      .config<number>('twitch-monitor-refresh')
      .then((it) => {
        if (Date.now() - this.lastCacheRefresh > it) {
          this.logger.debug("Refreshing twitch")
          this.lastCacheRefresh = Date.now();
          return this.dbConfig
            .config<string[]>('twitch-monitor-channels')
            .then((it) => {
              this.twitchCache = [];
              it.forEach((it) =>
                this.twitchCache.push({
                  name: it,
                  viewerCount: 0,
                  isOnline: false,
                }),
              );
              return this.getChannelsStats(it);
            })
            .catch((error) => {
              handleException(error);
              return undefined;
            });
        }
        return undefined;
      })
      .then((stats) => {
        if (stats) {
          this.twitchCache.forEach((item) => {
            const found = stats.find((it) => item.name === it.name);
            if (found) {
              item.viewerCount = found.viewerCount;
              item.isOnline = true;
            } else {
              item.viewerCount = 0;
              item.isOnline = false;
            }
          });
          stats.forEach((it2) => {
            const item = this.twitchCache.find((it) => it.name == it2.name);
            item.viewerCount = it2.viewerCount;
            item.isOnline = true;
          });
        }
      });
  }

  getChannelsStats(channels: string[]) {
    return this.twitchApi
      .getStreams({ channels: channels })
      .then((it): TwitchStats[] => {
        return it.data.map((channel) => {
          return {
            name: channel.user_login,
            isOnline: true,
            viewerCount: channel.viewer_count,
          };
        });
      });
  }

  getTwitchStats() {
    return this.twitchCache;
  }
}
