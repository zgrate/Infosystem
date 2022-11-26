import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { DbConfigService } from "../../db-config/db-config.service";
import { handleException } from "../../exception.filter";
import { Cron, CronExpression } from "@nestjs/schedule";

export interface VRCDNViewersDTO {
  region: string;
  total: number;
}

export class VRCDNResponseDTO {
  viewers: VRCDNViewersDTO[];
}

export class VRCDNStats {
  stream: string;
  totalViewers: number;
  viewersDetails: VRCDNResponseDTO;
  isOnline: boolean;
}

@Injectable()
export class VrcdnService {
  constructor(
    private httpService: HttpService,
    private dbConfig: DbConfigService,
  ) {}

  private logger = new Logger(VrcdnService.name);
  private lastCacheRefresh = 0;
  private vrcdnCache: VRCDNStats[];

  @Cron(CronExpression.EVERY_5_SECONDS)
  refreshVRCDNStats() {
    return this.dbConfig.config<number>('vrcdn-monitor-refresh').then((it) => {
      if (Date.now() - this.lastCacheRefresh > it) {
        this.logger.debug('Refreshing VRCDN');
        this.lastCacheRefresh = Date.now();
        return this.dbConfig
          .config<string[]>('vrcdn-monitor-channels')
          .then(async (name) => {
            return Promise.all(
              name.map(async (it): Promise<VRCDNStats> => {
                return this.refreshViewers(it).then((v) => {
                  return {
                    stream: it,
                    isOnline: v && v.viewers.length != 0,
                    totalViewers: v
                      ? v.viewers.reduce(
                          (previousValue, currentValue) =>
                            previousValue + currentValue.total,
                          0,
                        )
                      : 0,
                    viewersDetails: v,
                  };
                });
              }),
            );
          })
          .then((it) => {
            this.vrcdnCache = it;
          })
          .catch((error) => {
            handleException(error);
          });
      }
    });
  }

  refreshViewers(channel: string): Promise<VRCDNResponseDTO> {
    return this.httpService.axiosRef
      .get('https://api.vrcdn.live/v1/viewers/' + channel)
      .then((it) => it?.data);
  }

  getVRCDNViewers() {
    return this.vrcdnCache;
  }
}
