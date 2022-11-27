import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { CatchThemAllUpdate } from "./catch-them-all.update";
import { CatchThemAllService } from "./catch-them-all.service";
import { TelegramModule } from "../../telegram/telegram.module";
import { CatchThemAllController } from "./catch-them-all.controller";
import { AccreditationModule } from "../../accreditation/accreditation.module";
import { AdminAuthModule } from "../../admin/auth/admin-auth.module";
import { DbConfigModule } from "../../db-config/db-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CatchThemAllEntity, CatchThemAllCatchEntity]),
    TelegramModule,
    AccreditationModule,
    AdminAuthModule,
    DbConfigModule,
  ],
  controllers: [CatchThemAllController],
  providers: [CatchThemAllService, CatchThemAllUpdate],
  exports: [CatchThemAllService],
})
export class CatchThemAllModule {}
