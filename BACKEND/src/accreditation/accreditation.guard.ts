import { CanActivate, ExecutionContext, Injectable, OnModuleInit } from "@nestjs/common";
import { DbConfigService } from "../db-config/db-config.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AccreditationGuard implements CanActivate, OnModuleInit {
  constructor(private dbConfig: DbConfigService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.dbConfig
      .config("acc-password")
      .then(async (it) =>
        bcrypt.compare(
          context
            ?.switchToHttp()
            ?.getRequest()
            ?.headers["authorization"]?.replace("Bearer ", ""),
          it
        )
      );
  }

  async onModuleInit() {
    //this.authKey = randomStringGenerator();

    const tempPasswordBCrypt = await this.dbConfig.config(
      "acc-password",
      "Zgrate123"
    );
    try {
      bcrypt.getRounds(tempPasswordBCrypt);
    } catch (e) {
      return bcrypt.hash(tempPasswordBCrypt, 5).then(async (it) => {
        return this.dbConfig.saveConfig("acc-password", it);
      });
    }
  }
}
