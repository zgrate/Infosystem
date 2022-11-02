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
    TypeOrmModule.forRoot({
      type: "postgres",
      database: "Futrolajki",
      host: "futrolajki.zgrate.ovh",
      port: 5020,
      username: "futrolajki",
      password: "amamama111",
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
    ScreenModesModule,
    AccreditationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
