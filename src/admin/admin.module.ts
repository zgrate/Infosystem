import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { AdminAuthModule } from "./auth/admin-auth.module";
import { ScreenService } from "../screen-main/services/screen.service";
import { ScreenEntity } from "../shared/entities/definitions";

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, ScreenEntity]), AdminAuthModule],
  controllers: [AdminController],
  providers: [AdminService, ScreenService],
  exports: [AdminService]
})
export class AdminMainModule {
}
