import { Injectable } from "@nestjs/common";
import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { NEW_EVENT_REGISTERED, PROGRAM_ACCEPTED_EVENT, ProgramEntity } from "./entities/program.entity";
import { In, MoreThanOrEqual, Not, Repository } from "typeorm";
import { ProgramFormDTO } from "./telegram/program-form.dto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { EventEmitter2 } from "@nestjs/event-emitter";

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

@Injectable()
export class ProgramService {
  lastProgramID: number;

  constructor(
    private provider: ProgramIntegrationInterface,
    @InjectRepository(ProgramEntity)
    private programRepository: Repository<ProgramEntity>,
    private eventEmitter: EventEmitter2
  ) {
  }

  pushPullProgramService() {
    return this.provider.getListProgram(undefined).then((it) => {
      return this.programRepository
        .clear()
        .then(() => this.programRepository.save(it));
    });
  }

  async getCurrentProgram(limit: number): Promise<ProgramEntity[]> {
    return this.programRepository.find({
      where: {
        eventState: In(["scheduled", "moved", "cancelled"]),
        eventType: Not(In(["private_duration", "private_no_duration"])),
        eventStartTime: MoreThanOrEqual(new Date())
      },
      order: {
        eventStartTime: "ASC"
      },
      relations: {
        translations: true
      },
      take: limit
    });
  }

  async addProgram(dto: ProgramFormDTO) {
    const start = new Date(dto.startDate);
    const programEntity: ProgramEntity = {
      externalId: randomStringGenerator(),
      eventStartTime: new Date(dto.startDate),
      eventEndTime: addMinutes(start, dto.duration),
      eventScheduledLocation: dto.room,
      changeStartTime: undefined,
      eventChangedRoom: undefined,
      changeEventEndTime: undefined,
      tgId: dto.tgId,
      tgUser: dto.tgUsername,
      userId: dto.iden,
      eventType: "public_duration",
      internalId: undefined,
      eventState: "not_accepted",
      translations: [
        {
          lang: "pl",
          description: dto.description,
          title: dto.name,
          id: undefined,
          program: undefined
        }
      ]
    };
    const prog = await this.programRepository
      .save(programEntity, { reload: true })
      .then((it) => {
        return !!it;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    if (prog) {
      this.eventEmitter.emit(NEW_EVENT_REGISTERED, programEntity);
      this.lastProgramID = programEntity.internalId;
    }
    return prog;
  }

  async acceptEvent(eventId: number | undefined) {
    if (!eventId) {
      if (this.lastProgramID) {
        eventId = this.lastProgramID;
      } else {
        return false;
      }
    }
    return this.programRepository
      .findOneBy({ internalId: eventId, eventState: "not_accepted" })
      .then(async (it) => {
        if (it) {
          it.eventState = "scheduled";
          const success = await this.programRepository
            .save(it, { reload: true })
            .then((it) => {
              this.lastProgramID = undefined;
              return !!it;
            });
          if (success) {
            this.eventEmitter.emit(PROGRAM_ACCEPTED_EVENT, it);
          }
          return success;
        }
        return false;
      })
      .catch((it) => {
        console.log(it);
        return false;
      });
  }

  async denyEvent(eventId: number) {
    if (!eventId) {
      if (this.lastProgramID) {
        eventId = this.lastProgramID;
      } else {
        return false;
      }
    }
    return this.programRepository
      .findOneBy({ internalId: eventId, eventState: "not_accepted" })
      .then(async (it) => {
        if (it) {
          it.eventState = "denied";
          return await this.programRepository
            .save(it, { reload: true })
            .then((it) => {
              this.lastProgramID = undefined;
              return !!it;
            });
        }
        return false;
      })
      .catch((it) => {
        console.log(it);
        return false;
      });
  }

  getToAcceptProgram(limit: number) {
    return this.programRepository.find({
      where: {
        eventState: In(["not_accepted"]),
        eventType: Not(In(["private_duration", "private_no_duration"])),
        eventStartTime: MoreThanOrEqual(new Date())
      },
      order: {
        eventStartTime: "ASC"
      },
      relations: {
        translations: true
      },
      take: limit
    });
  }
}
