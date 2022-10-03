import { All, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuth, AdminUser } from "./admin-auth.decorators";

@Controller("/admin/auth")
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {
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

}
