import { Module } from "@nestjs/common";
import { DbConfigService } from "./db-config.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbConfigEntity } from "./db-config.entity";
import { DbConfigPipe } from "./db-config.pipe";

@Module({
  imports: [TypeOrmModule.forFeature([DbConfigEntity])],
  providers: [DbConfigService, DbConfigPipe],
  exports: [DbConfigService, DbConfigPipe]
})
export class DbConfigModule {
}
