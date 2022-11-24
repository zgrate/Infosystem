import { ProgramFilter, ProgramIntegrationInterface } from "./program-integration.interface";
import { Injectable } from "@nestjs/common";
import { ProgramEntity } from "../entities/program.entity";
import { AdminEventDTO } from "../entities/admin-event.dto";

@Injectable()
export class ProgramMockService extends ProgramIntegrationInterface {
  updateAdminEvent(externalEventID: number, adminEventDTO: AdminEventDTO): Promise<any> {
      throw new Error("Method not implemented.");
  }
  delayEventStart(externalEventID: number, startDelay: number): Promise<boolean> {
      throw new Error("Method not implemented.");
  }
  delayEventEnd(externalEventId: number, durationDelay: number): Promise<boolean> {
      throw new Error("Method not implemented.");
  }
  addAdminEvent(adminEventDTO: AdminEventDTO): Promise<boolean> {
    return Promise.resolve(false);
  }
  getListProgram(filter: ProgramFilter | null): Promise<Array<ProgramEntity>> {
    return undefined;
  }

  getProgramEntry(id: string): ProgramEntity | Promise<ProgramEntity> {
    return undefined;
  }

}
