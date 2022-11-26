import { Module } from "@nestjs/common";
import { StreamingHelperService } from "./streaming-helper.service";
import { HttpModule } from "@nestjs/axios";
import { StreamingHelperController } from "./streaming-helper.controller";
import { DbConfigModule } from "../db-config/db-config.module";

@Module({
  imports: [HttpModule.register({}), DbConfigModule],
  controllers: [StreamingHelperController],
  providers: [StreamingHelperService],
})
export class StreamingHelperModule {}
