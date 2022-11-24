import { Module } from "@nestjs/common";
import { StreamingHelperService } from "./streaming-helper.service";
import { HttpModule } from "@nestjs/axios";
import { StreamingHelperController } from "./streaming-helper.controller";

@Module({
  imports: [
    HttpModule.register({})
  ],
  controllers: [
    StreamingHelperController
  ],
  providers: [
    StreamingHelperService
  ],
})
export class StreamingHelperModule {}
