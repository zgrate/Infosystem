import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
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
import { FoxconsIntegrationService } from "./integrations/foxcons-integration/foxcons-integration.service";
import { HttpModule } from "@nestjs/axios";
import { FoxconsIntegrationController } from "./integrations/foxcons-integration/foxcons-integration.controller";

const ProgramSourceProvider = {
  provide: ProgramIntegrationInterface,
  useClass: FoxconsIntegrationService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([ProgramEntity, ProgramDescriptionEntity]),
    TelegramModule,
    AdminAuthModule,
    AdminMainModule,
    ScreenModule,
    HttpModule,
  ],
  controllers: [ProgramController, FoxconsIntegrationController],
  providers: [
    FoxconsIntegrationService,
    ProgramService,
    ProgramUpdate,
    ProgramSourceProvider,
  ],
  exports: [FoxconsIntegrationService, ProgramSourceProvider],
})
export class ProgramModule {}
