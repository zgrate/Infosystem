import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScreenModule } from "./screen-main/screen.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminMainModule } from "./admin/admin.module";
import { TelegramModule } from "./telegram/telegram.module";
import { ScreenWebSocketModule } from "./screen-ws/screen-ws.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScreenAdmin } from "./screen-admin/screen-admin.module";
import { ProgramModule } from "./program/program.module";
import { ScreenModesModule } from "./screen-modes/screen-modes.module";
import { AccreditationModule } from "./accreditation/accreditation.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      database: process.env.DB_DB,
      host: process.env.DB_IP,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      synchronize: true
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScreenModule,
    ScreenAdmin,
    AdminMainModule,
    ProgramModule,
    TelegramModule,
    ScreenWebSocketModule,
    ScreenModesModule,
    AccreditationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
