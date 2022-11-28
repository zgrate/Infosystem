import { Injectable, Logger } from "@nestjs/common";
import { ProgramFilter, ProgramIntegrationInterface } from "../program-integration.interface";
import { ProgramEntity } from "../../entities/program.entity";
import { HttpService } from "@nestjs/axios";
import { AdminEventDTO } from "src/program/entities/admin-event.dto";
import { HallDto } from "./dto/hall.dto";
import { handleException } from "../../../exception.filter";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ScheduleDto } from "./dto/schedule.dto";
import { AxiosError } from "axios";
import { DbConfigService } from "../../../db-config/db-config.service";

@Injectable()
export class FoxconsIntegrationService extends ProgramIntegrationInterface {
  private logger = new Logger(FoxconsIntegrationService.name);
  constructor(
    private httpService: HttpService,
    private eventEmmiter: EventEmitter2,
    private dbConfig: DbConfigService,
  ) {
    super();
    this.httpService.axiosRef.defaults.baseURL = process.env.FOXCONS_API_URL;
  }

  handleUnauthorized(error) {
    this.logger.error(error);
    console.trace(error);
  }

  authCheck() {
    return this.httpService.axiosRef.get('auth/profile').then((it) => {
      return it.status === 200 && it.data != 'false';
    });
  }

  login() {
    return this.httpService.axiosRef
      .post('auth/login', {
        username: process.env.FOXCONS_EMAIL,
        password: process.env.FOXCONS_PASSWORD,
      })
      .then((it) => {
        if (it.status === 200) {
          this.httpService.axiosRef.defaults.headers['Authorization'] =
            'Bearer ' + it.data.token;
          this.logger.log('Logged in');
          return true;
        } else {
          this.logger.error('Got invalid response! ' + it.status);
          this.logger.error(it.data);
          return false;
        }
      })
      .catch((error) => {
        handleException(error);
        return false;
      });
  }

  onModuleInit() {
    return this.login();
  }

  async getScheduleToProgramEntity(schedule: ScheduleDto) {
    const halls = await this.listHalls();
    if (halls == 'error' || halls == 'unautorized') return undefined;
    const p: ProgramEntity = {
      externalId: schedule.id,
      eventStartTime: new Date(schedule.timeBegin),
      eventEndTime: new Date(schedule.timeEnd),
      eventType: 'public_duration',
      eventScheduledLocation: halls.find((it) => it.id == schedule.hallId)[
        'details'
      ][0].translatedName,
      tgId: undefined,
      tgUser: undefined,
      userId: schedule.leaderId,
      coLeaders: schedule.subLeaders,
      eventState: 'scheduled', //TODO
      changeEventEndTime: undefined,
      changeStartTime: undefined,
      eventChangedRoom: undefined,
      internalId: undefined,
      programType: 'schedule',
      translations: [
        {
          program: undefined,
          id: undefined,
          title: schedule.details[0].displayName,
          lang: schedule.details[0].lang,
          description: schedule.details[0].details,
        },
      ],

      //TODO
    };
    const diffs = this.getDiffsFromSystem(schedule);
    if (diffs) {
      p.changeStartTime = diffs.after.timeBegin;
      p.changeEventEndTime = diffs.after.timeEnd;
      p.eventStartTime = diffs.before.timeBegin;
      p.eventEndTime = diffs.before.timeEnd;
      p.eventState = 'moved';
    }
    return p;
  }

  async getListProgram(
    filter: ProgramFilter | undefined,
  ): Promise<ProgramEntity[]> {
    const halls = await this.listHalls();

    if (halls == 'error' || halls == 'unautorized') return undefined;
    console.log(halls.map((it) => it['details']));
    return this.getInternalScheduleList().then((list) => {
      return Promise.all(
        list.map((schedule) => {
          return this.getScheduleToProgramEntity(schedule);
        }),
      );
    });
  }

  getProgramEntry(id: string): ProgramEntity | Promise<ProgramEntity> {
    return undefined;
  }

  addHall(hall: HallDto): Promise<boolean> {
    return this.httpService.axiosRef
      .put(
        'event/' + process.env.FOXCONS_EVENT_NAME + '/admin/schedules/halls',
        hall,
      )
      .then((it) => {
        console.log(it);
        return true;
      });
  }

  listHalls(): Promise<HallDto[] | 'error' | 'unautorized'> {
    return this.checkLogin().then(
      (check) =>
        check &&
        this.httpService.axiosRef
          .get(
            '/event/' +
              process.env.FOXCONS_EVENT_NAME +
              '/admin/schedules/halls',
          )
          .then((response) => {
            if (response.status === 200) {
              return response.data.rows;
            } else if (response.status >= 400) {
              return 'unautorized';
            }
            return 'error';
          }),
    );
  }

  checkLogin() {
    return this.authCheck().then((it) => {
      if (it) {
        return true;
      } else {
        return this.login().then((it) => {
          return it;
        });
      }
    });
  }

  getHallBySystemName(name: string): Promise<any | undefined> {
    return this.listHalls().then((it) => {
      if (it === 'error' || it == 'unautorized') {
        return undefined;
      } else {
        return it.find((it) => it.name === name);
      }
    });
  }

  timeDiff(startTime: string, endTime: string) {
    return (Date.parse(endTime) - Date.parse(startTime)) / 60000;
  }

  getAdminToFoxconsDTO(
    adminEventDTO: AdminEventDTO,
    helper = 26,
    addComment = false,
  ) {
    const schedule: ScheduleDto = {
      id: undefined,
      attendanceType: 'everyone',
      canBeExtended: false,
      displayTarget: 'everywhere',
      hallId: adminEventDTO.room, //TODO,
      helpers: [5],
      leaderId: adminEventDTO.leaders[0],
      subLeaders: adminEventDTO.leaders.filter((v, i, a) => a.indexOf(v) === i),
      timeBegin: adminEventDTO.startTime,
      timeEnd: adminEventDTO.endTime,
      visibilityLevel: 'always',
      is18Plus: false,
      isDraft: false,
      name: adminEventDTO.name,
      duration: this.timeDiff(adminEventDTO.startTime, adminEventDTO.endTime),
      durationEstimate: this.timeDiff(
        adminEventDTO.startTime,
        adminEventDTO.endTime,
      ),
      details: [
        {
          lang: 'PL',
          displayName: adminEventDTO.name,
          details: adminEventDTO.description,
        },
      ],
      overrideColor: adminEventDTO.color,
      history: undefined,
    };
    if (addComment) {
      schedule['editionComment'] = 'Z-Grate System Update';
    }

    return schedule;
  }

  getInternalScheduleList(): Promise<ScheduleDto[]> {
    return this.httpService.axiosRef
      .get('event/' + process.env.FOXCONS_EVENT_NAME + '/admin/schedules')
      .then((it) => {
        return it.data['rows'];
      });
  }

  async updateAdminEvent(
    externalId: number,
    adminEventDTO: AdminEventDTO,
    helper = 26,
  ): Promise<any> {
    return this.httpService.axiosRef
      .post(
        'event/' +
          process.env.FOXCONS_EVENT_NAME +
          '/admin/schedules/' +
          externalId,
        this.getAdminToFoxconsDTO(adminEventDTO, helper, true),
      )
      .then((it) => {
        return it.data;
      })
      .catch((error) => {
        handleException(error);
        return error.status + ' ' + JSON.stringify(error.response.data);
      });
  }

  addAdminEvent(adminEventDTO: AdminEventDTO, helper = 26): Promise<any> {
    return this.httpService.axiosRef
      .put(
        'event/' + process.env.FOXCONS_EVENT_NAME + '/admin/schedules',
        this.getAdminToFoxconsDTO(adminEventDTO, helper),
      )
      .then((it) => {
        console.log(it.data);
        return it.data;
      })
      .catch((error: AxiosError) => {
        handleException(error);
        return error.status + ' ' + JSON.stringify(error.response.data);
      });
  }

  async programEntityToFoxconsDTO(programEntity: ProgramEntity) {
    const halls = await this.listHalls().catch((it) => {
      handleException(it);
      return undefined;
    });
    if ((!halls && halls == 'error') || halls == 'unautorized')
      return undefined;
    let roomID = halls.find(
      (it) =>
        it.name == programEntity.eventScheduledLocation ||
        (it.texts &&
          it.texts.some(
            (it) => it.translatedName == programEntity.eventScheduledLocation,
          )),
    )?.id;
    if (!roomID) {
      roomID = halls.find((it) => it.name == 'activity-room').id;
    }
    console.log(programEntity);
    const schedule: ScheduleDto = {
      id: undefined,
      attendanceType: 'everyone',
      canBeExtended: false,
      displayTarget: 'everywhere',
      hallId: roomID, //TODO,
      helpers: [5],
      leaderId: programEntity.userId,
      subLeaders: [],
      timeBegin: programEntity.eventStartTime.toString(),
      timeEnd: programEntity.eventEndTime.toString(),
      visibilityLevel: 'always',
      is18Plus: false,
      isDraft: false,
      name: programEntity.translations[0].title,
      duration: this.timeDiff(
        programEntity.eventStartTime.toString(),
        programEntity.eventEndTime.toString(),
      ),
      durationEstimate: this.timeDiff(
        programEntity.eventStartTime.toString(),
        programEntity.eventEndTime.toString(),
      ),
      details: [
        {
          lang: 'PL',
          displayName: programEntity.translations[0].title,
          details: programEntity.translations[0].description,
        },
      ],
      overrideColor: this.dbConfig.configSync('activity-color'),
      history: undefined,
    };
    return schedule;
  }

  getDiffsFromSystem(schedule: ScheduleDto): {
    after: {
      timeBegin: Date;
      timeEnd: Date;
    };
    before: {
      timeBegin: Date;
      timeEnd: Date;
    };
  } {
    const c = schedule.history
      .filter((it) => it.reason.includes('delay'))
      .sort((firstEle, sencondEle) => sencondEle.id - firstEle.id);
    if (c.length > 0) {
      return {
        after: c[0].after,
        before: c[c.length - 1].before,
      };
    }
    return undefined;
  }

  async programAcceptedEvent(programEntity: ProgramEntity, helper = 5) {
    const foxconsDTO = await this.programEntityToFoxconsDTO(programEntity);
    console.log(foxconsDTO);
    return this.httpService.axiosRef
      .put(
        'event/' + process.env.FOXCONS_EVENT_NAME + '/admin/schedules',
        foxconsDTO,
      )
      .then((it) => {
        if (it && it.status !== 200) return undefined;
        return this.getScheduleToProgramEntity(it.data);
      }).catch(it => {
        handleException(it)
        console.log(it.config.data)
        return undefined
      });
  }

  delayEventEnd(
    externalEventId: number,
    durationDelay: number,
  ): Promise<boolean> {
    return Promise.resolve(false);
  }

  delayEventStart(
    externalEventID: number,
    startDelay: number,
  ): Promise<{ timeBegin: string; timeEnd: string } | undefined> {
    this.logger.debug('DELAY ' + externalEventID + ' = ' + startDelay);
    return this.httpService.axiosRef
      .patch(
        '/event/' +
          process.env.FOXCONS_EVENT_NAME +
          '/admin/schedules/' +
          externalEventID +
          '/time',
        {
          delayTime: 30,
        },
      )
      .then((it) => {
        if (it.status !== 200) {
          return undefined;
        }
        return {
          timeBegin: it.data['timeBegin'],
          timeEnd: it.data['timeEnd'],
        };
      })
      .catch((error) => {
        handleException(error);
        return undefined;
      });
  }

  addActivity(it: ProgramEntity): Promise<ProgramEntity | undefined> {
    return this.programAcceptedEvent(it);
  }
}
