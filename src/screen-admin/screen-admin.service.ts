import { InjectRepository } from "@nestjs/typeorm";
import { ScreenEntity } from "../shared/entities/definitions";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AdminEntity } from "../admin/admin.entity";

@Injectable()
export class ScreenAdminService {

  constructor(@InjectRepository(ScreenEntity) private screenRepo: Repository<ScreenEntity>,
              @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>) {
  }
}
