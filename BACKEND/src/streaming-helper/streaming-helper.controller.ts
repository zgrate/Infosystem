import { Controller, Get } from "@nestjs/common";
import { StreamingHelperService } from "./streaming-helper.service";

@Controller('stream')
export class StreamingHelperController {
  constructor(private streamingService: StreamingHelperService) {}

  @Get("restreamer")
  getRestreamerStatus(){
    return this.streamingService.getRestreamerStatus()
  }
}
