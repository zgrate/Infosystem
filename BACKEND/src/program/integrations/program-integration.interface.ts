import { ProgramEntity } from "../entities/program.entity";


export interface ProgramFilter {

  startTime: string | null;
  endTime: string | null;
  name: string | null;
  conventionDay: number | null;
  room: string | null;


}

export abstract class ProgramIntegrationInterface {

  abstract getListProgram(filter: ProgramFilter | undefined): Promise<Array<ProgramEntity>>;

  abstract getProgramEntry(id: string): ProgramEntity | Promise<ProgramEntity>;

}
