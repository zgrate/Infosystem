import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AdminAuthService } from "../admin-auth.service";
import { AdminService } from "../../admin.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AcceptGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private adminService: AdminService
  ) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.headers["authorization"] ==
      "Bearer " + this.adminAuthService.authKey ||
      await bcrypt.compare(request.headers["authorization"].replace("Bearer ", ""), this.adminAuthService.adminPassword)
    ) {
      return this.adminService.findAdmin("admin").then((it) => {
        const { password, ...result } = it;
        request.user = result;
        return true;
      });
      // request.user = this.adminService.findAdmin("admin");
    }
    return false;
  }
}
