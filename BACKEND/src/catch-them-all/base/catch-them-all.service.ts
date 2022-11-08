import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatchThemAllCatchEntity, CatchThemAllEntity } from "./catch-them-all.entity";
import { Like, Repository } from "typeorm";

export interface RecentlyCaught {
  fursuitId: string;
  chatNickname: string;
  catchId: number;
}

@Injectable()
export class CatchThemAllService {
  private lastCatches: RecentlyCaught[] = [];

  constructor(
    @InjectRepository(CatchThemAllEntity)
    private repository: Repository<CatchThemAllEntity>,
    @InjectRepository(CatchThemAllCatchEntity)
    private catchesRepo: Repository<CatchThemAllCatchEntity>
  ) {
  }

  findFursuit(fursuitId: string, retrieveCatches = false) {
    return this.repository.findOne({
      relations: {
        catched: retrieveCatches
      },
      where: { fursuitId: fursuitId }
    });
  }

  async uploadPhotoRecentlyCatched(
    tg_user: string,
    file_id: string
  ): Promise<"not_catch" | "error" | "ok"> {
    const recentCatch = this.lastCatches.find(
      (it) => it.chatNickname == tg_user
    );
    if (recentCatch === undefined) {
      return "not_catch";
    } else {
      const fursuitCatch = await this.catchesRepo.findOneBy({
        catchId: recentCatch.catchId
      });
      if (fursuitCatch == undefined) {
        return "not_catch";
      } else {
        fursuitCatch.photos.push(file_id);
        return await this.catchesRepo.save(fursuitCatch).then((it) => {
          if (it === undefined) return "error";
          else {
            return "ok";
          }
        });
      }
    }
  }

  findFursuitByNameId(fursuitNameOrId: string, loadCatches = false) {
    return this.repository.findOne({
      relations: {
        catched: loadCatches
      },
      where: [
        { fursuitId: fursuitNameOrId },
        { fursuitName: Like("%" + fursuitNameOrId + "%") }
      ]
    });
  }

  switchCatch(fursuitIdName: string, tgUser: string) {
    return this.findFursuitByNameId(fursuitIdName).then((fursuit) => {
      if (fursuit === undefined) {
        return "fursuit_not_found";
      } else {
        const catched = fursuit.catched.find((it) => it.tgUser == tgUser);
        if (catched === undefined) {
          return "didnt_catch";
        } else {
          const c = this.lastCatches.find((it) => it.chatNickname == tgUser);
          if (c === undefined) {
            const newEle = {
              chatNickname: tgUser,
              catchId: catched.catchId,
              fursuitId: fursuit.fursuitId
            };
            this.lastCatches.push(newEle);
          } else {
            c.fursuitId = fursuit.fursuitId;
            c.catchId = catched.catchId;
          }
          return "ok";
        }
      }
    });
  }

  getCaughtOfUser(tgUser: string) {
    return this.catchesRepo
      .find({
        where: {
          tgUser: tgUser
        },
        relations: {
          fursuit: true
        }
      })
      .then((items) => items.map((it) => it.fursuit.fursuitName));
  }

  catchFursuit(
    fursuitId: string,
    tgUser: string
  ): Promise<"error" | "caught" | "db_error" | string> {
    return this.findFursuit(fursuitId, true).then((fursuit) => {
      if (fursuit == null) {
        return "error";
      } else {
        if (fursuit.catched.some((it) => it.tgUser === tgUser)) {
          return "caught";
        } else {
          const catched = new CatchThemAllCatchEntity();
          catched.fursuit = fursuit;
          catched.tgUser = tgUser;
          catched.photos = [];
          fursuit.catched.push(catched);
          return this.repository
            .save(fursuit, { reload: true })
            .then((it) => {
              console.log("uwuw");
              console.log(it);
              if (it == null) return "db_error";
              else {
                this.lastCatches.push({
                  fursuitId: it.fursuitId,
                  chatNickname: tgUser,
                  catchId: it.catched.find((it) => it.tgUser == tgUser)
                    ?.catchId
                });
                return it.fursuitName;
              }
            })
            .catch(() => "db_error");
        }
      }
    });
  }
}
