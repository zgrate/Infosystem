import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CatchThemAllEntity } from "./catch-them-all.entity";
import { Repository } from "typeorm";

@Injectable()
export class CatchThemAllService {
  constructor(
    @InjectRepository(CatchThemAllEntity)
    private repository: Repository<CatchThemAllEntity>
  ) {
  }

  findFursuit(fursuitId: string) {
    return this.repository.findOneBy({ fursuitId: fursuitId });
  }


}
