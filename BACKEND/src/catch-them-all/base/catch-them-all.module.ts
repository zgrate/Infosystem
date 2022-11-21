import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { CatchThemAllUpdate } from "./catch-them-all.update";
import { CatchThemAllService } from "./catch-them-all.service";
import { TelegramModule } from "../../telegram/telegram.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CatchThemAllEntity, CatchThemAllCatchEntity]), TelegramModule
  ],
  providers: [CatchThemAllService, CatchThemAllUpdate]
})
export class CatchThemAllModule {
}
