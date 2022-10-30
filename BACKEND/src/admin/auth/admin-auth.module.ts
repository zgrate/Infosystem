import { Module } from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { AdminAuthController } from "./admin-auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AdminService } from "../admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "../admin.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "1d" }
    })
  ],
  providers: [AdminAuthService, LocalStrategy, JwtStrategy, AdminService],
  controllers: [AdminAuthController],
  exports: [AdminAuthService]
})
export class AdminAuthModule {
}