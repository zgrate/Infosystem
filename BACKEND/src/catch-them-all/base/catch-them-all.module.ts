import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { CatchThemAllUpdate } from "./catch-them-all.update";
import { CatchThemAllService } from "./catch-them-all.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CatchThemAllEntity, CatchThemAllCatchEntity])
  ],
  providers: [CatchThemAllService, CatchThemAllUpdate]
})
export class CatchThemAllModule {
}
