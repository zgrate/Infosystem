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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      // database: 'test',
      autoLoadEntities: true,
      synchronize: true
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScreenModule,
    ScreenAdmin,
    AdminMainModule,
    ProgramModule,
    TelegramModule,
    ScreenWebSocketModule,
    ScreenModesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
