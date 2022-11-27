import { Module } from "@nestjs/common";
import { AccreditationService } from "./accreditation.service";
import { AccreditationController } from "./accreditation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccreditationEntity } from "./entities/accreditation.entity";
import { AccreditationUpdateTg } from "./accreditation.update.tg";
import { TelegramModule } from "../telegram/telegram.module";
import { DbConfigModule } from "../db-config/db-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AccreditationEntity]),
    TelegramModule,
    DbConfigModule,
  ],
  controllers: [AccreditationController],
  providers: [AccreditationService, AccreditationUpdateTg],
  exports: [AccreditationService],
})
export class AccreditationModule {}
