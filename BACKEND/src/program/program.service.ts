import { Injectable } from "@nestjs/common";
import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ProgramEntity } from "./entities/program.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProgramService {
  constructor(
    private provider: ProgramIntegrationInterface,
    @InjectRepository(ProgramEntity)
    private programRepository: Repository<ProgramEntity>
  ) {
  }

  pushPullProgramService() {
    return this.provider.getListProgram(undefined).then((it) => {
      return this.programRepository
        .clear()
        .then(() => this.programRepository.save(it));
    });
  }
}
