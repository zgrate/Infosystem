import { Module } from "@nestjs/common";
import { AdminAccountsController } from "./admin-accounts.controller";
import { AdminAccountsService } from "./admin-accounts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "../admin.entity";
import { AdminService } from "../admin.service";
import { AdminAuthService } from "../auth/admin-auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminAccountsController],
  providers: [AdminAccountsService, AdminService, AdminAuthService]
})
export class AdminAccountsModule {
}
