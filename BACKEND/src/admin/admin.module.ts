import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminAuthModule } from "./auth/admin-auth.module";
import { DbConfigModule } from "../db-config/db-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    AdminAuthModule,
    DbConfigModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminMainModule {
}
