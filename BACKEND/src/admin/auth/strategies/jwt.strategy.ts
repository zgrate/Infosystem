import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AdminService } from "../../admin.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    });
  }

  async validate(payload: any): Promise<any> {
    const admin = await this.adminService.findOneById(payload.sub);
    const { password, ...result } = admin;
    return result;
  }
}
