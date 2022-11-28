import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { Like, Repository } from "typeorm";
import { handleException } from "../../exception.filter";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { AccreditationService } from "../../accreditation/accreditation.service";
import { DbConfigService } from "../../db-config/db-config.service";

export interface RecentlyCaught {
  fursuitId: string;
  tgId: number;
  catchId: number;
  catchTime: number;
}

export interface FursuitBadgeDTO {
  id: number;
  fileName: string;
  fursuitID: string;
  fursuitName: string;
}

@Injectable()
export class CatchThemAllService {
  private lastCatches: RecentlyCaught[] = [];

  constructor(
    @InjectRepository(CatchThemAllEntity)
    private catchRepo: Repository<CatchThemAllEntity>,
    @InjectRepository(CatchThemAllCatchEntity)
    private catchesRepo: Repository<CatchThemAllCatchEntity>,
    private eventEmitter: EventEmitter2,
    private accreditionService: AccreditationService,
    private dbService: DbConfigService
  ) {
  }

  @OnEvent('forwarder.enabled')
  onForwarder(id: number) {
    if (this.isCatching(id)) {
      this.doneCatching(id);
    }
  }

  findFursuits(limit = 99999) {
    return this.catchRepo.query(
      'SELECT "fursuitName" as "name", "fileName" as "img", COUNT(b."catchId") as "count" FROM public.catch_them_all_entity a LEFT JOIN PUBLIC.catch_them_all_catch_entity b ON a."fursuitId" = b."fursuitFursuitId" GROUP BY a."fursuitId" ORDER BY "count" DESC, "name" ASC LIMIT $1',
      [limit],
    );

    // return this.repository
    //   .find({
    //     select: {
    //       fursuitName,
    //       COUNT(catched)
    //     },
    //     relations: {
    //       catched: true,
    //     },
    //     order: {
    //       fursuitName: 'ASC',
    //     },
    //   })
    //   .then((response) => {
    //     return response
    //       .map((it) => {
    //         return {
    //           name: it.fursuitName,
    //           count: it.catched.length,
    //         };
    //       })
    //       .sort((it) => it.count)
    //       .reverse();
    //   });
  }

  findFursuit(fursuitId: string, retrieveCatches = false) {
    return this.catchRepo.findOne({
      relations: {
        catched: retrieveCatches,
      },
      where: { fursuitId: fursuitId },
    });
  }

  async uploadPhotoRecentlyCatched(
    tgId: number,
    fileId: string,
  ): Promise<'not_catch' | 'error' | 'ok'> {
    const recentCatch = this.lastCatches.find((it) => it.tgId == tgId);
    if (recentCatch === undefined) {
      return 'not_catch';
    } else {
      const fursuitCatch = await this.catchesRepo.findOneBy({
        catchId: recentCatch.catchId,
      });
      if (fursuitCatch == undefined) {
        return 'not_catch';
      } else {
        fursuitCatch.photos.push(fileId);
        return await this.catchesRepo.save(fursuitCatch).then((it) => {
          if (!it) return 'error';
          else {
            recentCatch.catchTime = Date.now();
            return 'ok';
          }
        });
      }
    }
  }

  findFursuitByNameId(fursuitNameOrId: string, loadCatches = false) {
    return this.catchRepo.findOne({
      relations: {
        catched: loadCatches,
      },
      where: [
        { fursuitId: fursuitNameOrId },
        { fursuitName: Like('%' + fursuitNameOrId + '%') },
      ],
    });
  }

  switchCatch(fursuitIdName: string, tgId: number) {
    return this.findFursuitByNameId(fursuitIdName, true).then((fursuit) => {
      if (!fursuit) {
        return 'fursuit_not_found';
      } else {
        const catched = fursuit.catched.find((it) => it.tgId == tgId);
        if (catched === undefined) {
          return 'didnt_catch';
        } else {
          const c = this.lastCatches.find((it) => it.tgId == tgId);
          if (!c) {
            const newEle: RecentlyCaught = {
              tgId: tgId,
              catchId: catched.catchId,
              fursuitId: fursuit.fursuitId,
              catchTime: Date.now(),
            };
            this.lastCatches.push(newEle);
          } else {
            c.fursuitId = fursuit.fursuitId;
            c.catchId = catched.catchId;
          }
          return 'ok';
        }
      }
    });
  }

  getCaughtOfUser(tgId: number) {
    return this.catchesRepo
      .find({
        where: {
          tgId: tgId,
        },
        relations: {
          fursuit: true,
        },
      })
      .then((items) => items.map((it) => it.fursuit.fursuitName));
  }

  catchFursuit(
    fursuitId: string,
    tgId: number,
    tgUser: string
  ): Promise<'error' | 'caught' | 'db_error' | string> {
    return this.findFursuit(fursuitId, true).then((fursuit) => {
      if (fursuit == null) {
        return 'error';
      } else {
        // console.log(fursuit);
        if (fursuit.catched.some((it) => it.tgId == tgId)) {
          return 'caught';
        } else {
          const catched = new CatchThemAllCatchEntity();
          catched.fursuit = fursuit;
          catched.tgId = tgId;
          catched.tgUsername = tgUser;
          catched.photos = [];
          catched.catchDate = new Date();
          fursuit.catched.push(catched);
          return this.catchRepo
            .save(fursuit, { reload: true })
            .then((it) => {
              if (it == null) return 'db_error';
              else {
                this.lastCatches.push({
                  fursuitId: it.fursuitId,
                  tgId: tgId,
                  catchId: it.catched.find((it) => it.tgId == tgId)?.catchId,
                  catchTime: Date.now(),
                });
                this.eventEmitter.emit('catch.enable', tgId);
                return it.fursuitName;
              }
            })
            .catch((error) => {
              handleException(error);
              return 'db_error';
            });
        }
      }
    });
  }

  cleanupCatches() {
    this.lastCatches = this.lastCatches.filter(
      (it) => Date.now() - it.catchTime < 60000,
    );
  }

  isCatching(tgId: number) {
    return this.lastCatches.findIndex((it) => it.tgId == tgId) !== -1;
  }

  doneCatching(id: number): 'ok' | 'no_catch' {
    const recentCatch = this.lastCatches.findIndex((it) => it.tgId == id);
    if (recentCatch !== -1) {
      this.lastCatches.splice(recentCatch, 1);
      return 'ok';
    }
    return 'no_catch';
  }

  addFursuits(body: FursuitBadgeDTO[]) {
    return Promise.all(
      body.map(async (badge) => {
        return this.catchRepo.save({
          catched: undefined,
          fursuitName: badge.fursuitName,
          fileName: this.dbService.configSync("fursuits-link")+badge.fileName,
          fursuitId: badge.fursuitID,
          accredition: await this.accreditionService.findOne(badge.id),
        });
      }),
    );
  }

  getCatches(number: number) {

  }
}
