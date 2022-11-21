import { Module } from "@nestjs/common";
import { ScreenController } from "./controllers/screen.controller";
import { ScreenService } from "./services/screen.service";
import { ScreenEntity } from "../shared/entities/screen.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbConfigModule } from "../db-config/db-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ScreenEntity]),
    DbConfigModule
  ],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService]
})
export class ScreenModule {
}
