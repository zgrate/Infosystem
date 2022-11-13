import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AdminService } from "../admin.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DbConfigService } from "../../db-config/db-config.service";

@Injectable()
export class AdminAuthService implements OnModuleInit {
  authKey: string;
  adminPassword: string;
  private blacklist: string[] = [];
  private logger = new Logger(AdminAuthService.name);

  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: DbConfigService
  ) {
  }

  async onModuleInit() {
    //this.authKey = randomStringGenerator();
    this.authKey = "af5bb535-1efc-4d23-ad53-9d84e7174f1f";
    console.log("KEY: " + this.authKey);

    const tempPasswordBCrypt = await this.configService.config(
      "admin-password",
      "Zgrate123"
    );
    try {
      bcrypt.getRounds(tempPasswordBCrypt);
      this.logger.debug("Password fetched!");
      this.adminPassword = tempPasswordBCrypt;
    } catch (e) {
      this.logger.log("Updating password to BCrypt...");
      this.adminPassword = await bcrypt.hash(tempPasswordBCrypt, 5);
      await this.configService.saveConfig("admin-password", this.adminPassword);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleBlacklistClean() {
    this.blacklist = this.blacklist.filter((x) => {
      return this.jwtService.verify(x);
    });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.adminService.findAdmin(username);
    if (user && bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  logout(id: string) {
    this.blacklist.push(id);
  }

  isTokenBlacklisted(token: string, id: string) {
    if (this.blacklist.includes(token)) return true;
    else if (this.blacklist.includes(id)) {
      delete this.blacklist[id];
      this.blacklist.push(token);
    }
    return this.blacklist.includes(token);
  }
}
