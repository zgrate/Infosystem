import { Injectable } from "@nestjs/common";
import { TwitchService } from "./external-services/twitch.service";
import { DbConfigService } from "../db-config/db-config.service";
import { VrcdnService } from "./external-services/vrcdn.service";

@Injectable()
export class DjService {
  constructor(
    private twitchService: TwitchService,
    private dbConfig: DbConfigService,
    private vrcdnService: VrcdnService,
  ) {}

  getStreamStats() {
    return {
      twitch: this.twitchService.getTwitchStats(),
      vrcdn: this.vrcdnService.getVRCDNViewers(),
    };
  }
}
