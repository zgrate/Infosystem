import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { CatchThemAllUpdate } from "./catch-them-all.update";
import { CatchThemAllService } from "./catch-them-all.service";
import { TelegramModule } from "../../telegram/telegram.module";
import { CatchThemAllController } from "./catch-them-all.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([CatchThemAllEntity, CatchThemAllCatchEntity]), TelegramModule
  ],
  controllers: [CatchThemAllController],
  providers: [CatchThemAllService, CatchThemAllUpdate],
  exports: [CatchThemAllService]
})
export class CatchThemAllModule {
}
