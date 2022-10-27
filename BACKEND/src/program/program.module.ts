import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
import { ProgramMockService } from "./integrations/program-mock.service";
import { Module } from "@nestjs/common";

const ProgramSourceProvider = {
  provide: ProgramIntegrationInterface,
  useClass: ProgramMockService
};

@Module({
  imports: [],
  providers: [ProgramSourceProvider]
})
export class ProgramModule {
}
