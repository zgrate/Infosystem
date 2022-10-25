import { All, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuth, AdminUser, Sudo } from "./admin-auth.decorators";
import { AdminService } from "../admin.service";

@Controller("/admin/auth")
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService, private adminService: AdminService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Req() req) {
    return this.adminAuthService.login(req.user);
  }

  @AdminAuth()
  @All()
  logout(@AdminUser() { id, ..._ }) {
    return this.adminAuthService.logout(id);
  }

  @Get("list")
  @Sudo()
  async listAccounts(): Promise<any[]> {
    return this.adminService.getAllAdmins().then<any[]>((admin) => {
      return admin.map(({ password, ...result }) => result);
    });
  }

}
