import { Module } from "@nestjs/common";
import { DjService } from "./dj.service";
import { TwitchService } from "./external-services/twitch.service";
import { DjController } from "./dj.controller";
import { HttpModule } from "@nestjs/axios";
import { DbConfigModule } from "../db-config/db-config.module";
import { VrcdnService } from "./external-services/vrcdn.service";

@Module({
  imports: [HttpModule.register({}), DbConfigModule],
  controllers: [DjController],
  providers: [DjService, TwitchService, VrcdnService],
})
export class DjModule {}
