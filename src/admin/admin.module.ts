import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminAuthModule } from "./auth/admin-auth.module";
import { AdminAccountsModule } from "./accounts/admin-accounts.module";
import { AdminEntityModule } from "./admin-entity/admin-entity.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    AdminAuthModule,
    AdminAccountsModule,
    AdminEntityModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminMainModule {
}
