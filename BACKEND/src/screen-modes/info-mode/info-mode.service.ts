import { Injectable } from "@nestjs/common";
import { ProgramIntegrationInterface } from "../../program/integrations/program-integration.interface";

@Injectable()
export class InfoModeService {
  constructor(private programIntegration: ProgramIntegrationInterface) {
  }
}
