import { ProgramEntity } from "../entities/program.entity";
import { AdminEventDTO } from "../entities/admin-event.dto";

export interface ProgramFilter {
  startTime: string | null;
  endTime: string | null;
  name: string | null;
  conventionDay: number | null;
  room: string | null;
}

export abstract class ProgramIntegrationInterface {
  abstract getListProgram(
    filter: ProgramFilter | undefined,
  ): Promise<ProgramEntity[]>;

  abstract getProgramEntry(id: string): ProgramEntity | Promise<ProgramEntity>;

  abstract addAdminEvent(adminEventDTO: AdminEventDTO): Promise<boolean>;

  abstract updateAdminEvent(externalEventID: number, adminEventDTO: AdminEventDTO): Promise<any>;

  abstract delayEventStart(externalEventID: number, startDelay: number): Promise<boolean>;

  abstract delayEventEnd(externalEventId: number, durationDelay: number): Promise<boolean>;
}
