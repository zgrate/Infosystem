import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InfoModeEntity } from "./info-mode.entity";
import { InfoModeController } from "./info-mode.controller";
import { InfoModeService } from "./info-mode.service";
import { ProgramModule } from "../../program/program.module";

@Module({
  imports: [TypeOrmModule.forFeature([InfoModeEntity]), ProgramModule],
  controllers: [InfoModeController],
  providers: [InfoModeService]
})
export class InfoModeModule {
}
