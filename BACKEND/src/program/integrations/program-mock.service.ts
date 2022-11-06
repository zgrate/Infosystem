import { ProgramFilter, ProgramIntegrationInterface } from "./program-integration.interface";
import { Injectable } from "@nestjs/common";
import { ProgramEntity } from "../entities/program.entity";

@Injectable()
export class ProgramMockService extends ProgramIntegrationInterface {
  getListProgram(filter: ProgramFilter | null): Promise<Array<ProgramEntity>> {
    return undefined;
  }

  getProgramEntry(id: string): ProgramEntity | Promise<ProgramEntity> {
    return undefined;
  }

}
