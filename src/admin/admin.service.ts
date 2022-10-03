import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { AdminEntity } from "./admin.entity";
import { Role } from "./auth/role.enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>
  ) {
  }

  async findAdmin(username: string): Promise<AdminEntity | undefined> {
    return this.adminRepo.findOneBy({ username: username });
  }

  async findOneById(id: number): Promise<AdminEntity | undefined> {
    return this.adminRepo.findOneBy({ id: id });
  }

  async getAllAdmins(): Promise<AdminEntity[]> {
    return this.adminRepo.find();
  }

  async onModuleInit(): Promise<void> {
    if ((await this.adminRepo.count()) == 0) {
      const entity = new AdminEntity();
      entity.username = "admin";
      entity.password = await bcrypt.hash("admin", 10);
      entity.roles = [Role.Sudo];
      return this.adminRepo.save(entity).then();
    }
  }
}
