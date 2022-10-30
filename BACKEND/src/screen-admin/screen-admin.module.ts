import { Module } from "@nestjs/common";
import { AdminMainModule } from "../admin/admin.module";
import { ScreenModule } from "../screen-main/screen.module";
import { ScreenAdminService } from "./screen-admin.service";
import { ScreenAdminController } from "./controllers/screen-admin.controller";
import { AdminAuthModule } from "../admin/auth/admin-auth.module";

@Module({
  imports: [AdminMainModule, ScreenModule, AdminAuthModule],
  providers: [ScreenAdminService],
  controllers: [ScreenAdminController]
})
export class ScreenAdmin {
}
