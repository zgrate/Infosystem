import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { AdminEntity } from "../admin.entity";

@Injectable()
export class AdminAccountsService {

  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>
  ) {
  }
}
