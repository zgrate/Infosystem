import { ProgramEntity } from "./program.entity";

export interface ProgramDescriptionEntity {
  id: string;

  lang: string;

  title: string;

  description: string;

  program: ProgramEntity;
}
