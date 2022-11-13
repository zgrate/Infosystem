import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
import { ProgramMockService } from "./integrations/program-mock.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgramService } from "./program.service";
import { ProgramEntity } from "./entities/program.entity";
import { ProgramDescriptionEntity } from "./entities/program-description.entity";
import { ProgramUpdate } from "./telegram/program.update";
import { TelegramModule } from "../telegram/telegram.module";
import { ProgramController } from "./program.controller";
import { AdminAuthModule } from "../admin/auth/admin-auth.module";
import { AdminMainModule } from "../admin/admin.module";
import { ScreenModule } from "../screen-main/screen.module";

const ProgramSourceProvider = {
  provide: ProgramIntegrationInterface,
  useClass: ProgramMockService
};

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramEntity, ProgramDescriptionEntity]),
    TelegramModule,
    AdminAuthModule,
    AdminMainModule,
    ScreenModule
  ],
  controllers: [ProgramController],
  providers: [ProgramSourceProvider, ProgramService, ProgramUpdate],
  exports: [ProgramIntegrationInterface]
})
export class ProgramModule {
}
