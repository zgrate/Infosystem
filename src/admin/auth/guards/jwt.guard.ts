import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminAuthService } from "../admin-auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private adminAuth: AdminAuthService) {
    super();
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
