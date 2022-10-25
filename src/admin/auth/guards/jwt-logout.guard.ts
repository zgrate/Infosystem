import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AdminAuthService } from "../admin-auth.service";

@Injectable()
export class JwtLogoutGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    return (
      !("authorization" in request.headers) ||
      !this.adminAuth.isTokenBlacklisted(
        request.headers["authorization"],
        user.id
      )
    );
  }
}
