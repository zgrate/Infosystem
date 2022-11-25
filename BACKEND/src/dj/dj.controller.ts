import { Controller, Get } from "@nestjs/common";
import { DjService } from "./dj.service";

@Controller('dj')
export class DjController {
  constructor(private djService: DjService) {}

  // @Get('twitch')
  // getTwitchStats(@Query('channel') channel: string) {
  //   return this.djService.getTwitchStats(channel);
  // }

  @Get('stats')
  async getAllStats() {
    return this.djService.getStreamStats();
  }
}
