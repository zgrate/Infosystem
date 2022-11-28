import { Injectable, Logger } from "@nestjs/common";
import { ProgramIntegrationInterface } from "./integrations/program-integration.interface";
import { InjectRepository } from "@nestjs/typeorm";
import {
  NEW_EVENT_REGISTERED,
  PROGRAM_ACCEPTED_EVENT,
  PROGRAM_UPDATE_EVENT,
  ProgramEntity
} from "./entities/program.entity";
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from "typeorm";
import { ActivityFormDto } from "./telegram/activity-form.dto";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ProgramDescriptionEntity } from "./entities/program-description.entity";
import { ScreenEntity } from "../shared/entities/screen.entity";
import { AdminEventDTO } from "./entities/admin-event.dto";

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
    @InjectRepository(ProgramDescriptionEntity)
    private programDescRepository: Repository<ProgramDescriptionEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  pushPullProgramService() {
    return this.provider.getListProgram(undefined).then((program) => {
      return this.programRepository
        .findBy({ externalId: Not(IsNull()) })
        .then((items) => {
          return this.programRepository.remove(items);
        })
        .then(() => {
          return this.programRepository.save(program);
        });
    });

    //   return this.programDescRepository
    //     .delete({ id: Not(-1) })
    //     .then(() => this.programRepository.delete({ internalId: Not(-1) }))
    //     .then(() => this.programRepository.delete({ internalId: Not(-1) }))
    //     .then(() => this.programRepository.save(program, { reload: true }));
    // });
  }

  async getProgramDB(limit: number, currentDate: Date) {
    return this.programRepository.find({
      where: [
        {
          eventState: In(['scheduled']),
          eventType: Not(In(['private_duration', 'private_no_duration'])),
          eventStartTime: MoreThanOrEqual(this.currentDate()),
        },
        {
          eventState: In(['moved', 'cancelled']),
          eventType: Not(In(['private_duration', 'private_no_duration'])),
        },
        {
          eventState: In(['scheduled']),
          eventType: Not(In(['private_duration', 'private_no_duration'])),
          eventStartTime: LessThanOrEqual(this.currentDate()),
          eventEndTime: MoreThanOrEqual(this.currentDate()),
        },
      ],
      order: {
        eventStartTime: 'ASC',
      },
      relations: {
        translations: true,
      },
      take: limit,
    });
  }

  async getProgramForScreens(screen: ScreenEntity) {
    // console.log(screen);
    return this.getProgramDB(
      screen.maxMainRoomEntry + screen.maxOtherRoomEntry,
      this.currentDate(),
    );
    // return this.programRepository.find({
    //   take: screen.maxMainRoomEntry + screen.maxOtherRoomEntry,
    //   relations: {
    //     translations: true,
    //   },
    //   where: [
    //     {
    //       eventState: In(['scheduled']),
    //       eventType: Not(In(['private_duration', 'private_no_duration'])),
    //       eventStartTime: MoreThanOrEqual(this.currentDate()),
    //     },
    //     {
    //       eventState: In(['moved', 'cancelled']),
    //       eventType: Not(In(['private_duration', 'private_no_duration'])),
    //     },
    //     {
    //       eventState: In(['scheduled']),
    //       eventType: Not(In(['private_duration', 'private_no_duration'])),
    //       eventStartTime: LessThanOrEqual(this.currentDate()),
    //       eventEndTime: MoreThanOrEqual(this.currentDate()),
    //     },
    //   ],
    // });
  }

  async getCurrentProgram(limit: number): Promise<ProgramEntity[]> {
    return this.getProgramDB(limit, this.currentDate());
    // .then((it) =>
    //   it.filter(
    //     (entity) => true,
    //     // new Date(entity.eventStartTime).getDate() == new Date().getDate(),
    //   ),
    // );
  }

  currentDate = () => {
    //MOCKUP
    return new Date();
  };

  async addActivity(dto: ActivityFormDto) {
    const start = new Date(dto.startDate);
    const desc = {
      lang: 'pl',
      description: dto.description,
      title: dto.name,
      id: undefined,
      program: undefined,
    };
    const programEntity: ProgramEntity = {
      externalId: undefined,
      eventStartTime: new Date(dto.startDate),
      eventEndTime: addMinutes(start, dto.duration),
      eventScheduledLocation: dto.room,
      changeStartTime: undefined,
      eventChangedRoom: undefined,
      changeEventEndTime: undefined,
      tgId: dto.tgId,
      tgUser: dto.tgUsername,
      userId: dto.iden,
      eventType: 'public_duration',
      internalId: undefined,
      eventState: 'not_accepted',
      translations: [],
      coLeaders: [],
      programType: 'activity',
    };
    const prog = await this.programRepository
      .save(programEntity, { reload: true })
      .then(async (it) => {
        desc.program = it;
        return (
          (await this.programDescRepository
            .save(desc, { reload: true })
            .then((it) => !!it)) && !!it
        );
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    if (prog) {
      programEntity.translations = [desc];
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
      .findOneBy({ internalId: eventId, eventState: 'not_accepted' })
      .then(async (it) => {
        if (it) {
          const programEntity = await this.provider.addActivity(it);
          console.log(programEntity);
          if (programEntity) {
            const success = await this.programRepository
              .save(programEntity, { reload: true })
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
        }
        return false;
      })
      .catch((it) => {
        console.log(it);
        return false;
      });
  }

  @OnEvent(PROGRAM_ACCEPTED_EVENT)
  programAcceptEvent() {
    this.eventEmitter.emit(PROGRAM_UPDATE_EVENT);
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
      .findOneBy({ internalId: eventId, eventState: 'not_accepted' })
      .then(async (it) => {
        if (it) {
          it.eventState = 'denied';
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
        eventState: In(['not_accepted']),
        eventType: Not(In(['private_duration', 'private_no_duration'])),
      },
      order: {
        eventStartTime: 'ASC',
      },
      relations: {
        translations: true,
      },
      take: limit,
    });
  }

  externalAddEvent(adminEventDTO: AdminEventDTO) {
    return this.programRepository
      .findOneBy({ translations: { title: adminEventDTO.name } })
      .then((it) => {
        if (it) {
          // return "added"
          return this.provider.updateAdminEvent(it.externalId, adminEventDTO);
        } else {
          return this.provider.addAdminEvent(adminEventDTO);
        }
      });

    // return this.provider.addAdminEvent(adminEventDTO);
  }

  processProgram() {
    // allProgram.forEach((it: AdminEventDTO) => {
    //
    // })
  }

  findProgram(id: number): Promise<ProgramEntity | null> {
    return this.programRepository.findOneBy({ internalId: id });
  }

  searchProgram(
    search: string,
  ): Promise<{ internalId: number; externalId: number; title: string }[]> {
    return this.programRepository.query(
      'SELECT "internalId", "externalId", "title" FROM PUBLIC.program_entity a LEFT JOIN PUBLIC.program_description_entity b ON b."programInternalId" = a."internalId" ORDER BY similarity(b."title", $1) DESC LIMIT 5',
      [search],
    );
  }

  refreshExternalProgram() {
    return this.provider.getListProgram(undefined);
  }
  private logger = new Logger(ProgramService.name);
  async delayProgram(id: number, delayMinutes: number) {
    this.logger.debug('Delying ' + id + ' by ' + delayMinutes);
    return this.findProgram(id).then((program) => {
      if (program) {
        if (program.externalId) {
          return this.provider
            .delayEventStart(program.externalId, delayMinutes)
            .then(async (it) => {
              if (it) {
                program.eventState = 'moved';
                program.changeStartTime = it.timeBegin;
                program.changeEventEndTime = it.timeEnd;
                await this.programRepository.update(
                  { internalId: program.internalId },
                  {
                    eventState: 'moved',
                    changeStartTime: it.timeBegin,
                    changeEventEndTime: it.timeEnd,
                  },
                );
              }
              return !!it;
            });
        } else {
          console.log('DELAY?');
        }
      }
      return false;
    });
  }
}
