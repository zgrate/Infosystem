import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AdminAuthService } from "../admin-auth.service";
import { AdminService } from "../../admin.service";

@Injectable()
export class AcceptGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private adminService: AdminService
  ) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (
      request.headers["authorization"] ==
      "Bearer " + this.adminAuthService.authKey
    ) {
      console.log("ADMIN");
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
