import { Module, OnModuleInit } from "@nestjs/common";
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
import { AccreditationModule } from "./accreditation/accreditation.module";
import { TelegrafModule } from "nestjs-telegraf";
import { CatchThemAllModule } from "./catch-them-all/base/catch-them-all.module";
import { DbConfigModule } from "./db-config/db-config.module";
import { MessagesModule } from "./messages/messages.module";
import { ChatForwarderModule } from "./telegram/chat-forwarder/chat-forwarder.module";
import { ListenerModule } from "./telegram/main_listener/listener.module";
import { EntityManager } from "typeorm";
import { StreamingHelperModule } from "./streaming-helper/streaming-helper.module";
import { DjModule } from "./dj/dj.module";

export const TGException = (ctx, next) => {
  // console.log(next);
  try {
    next();
  } catch (e) {
    console.log(e);
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DB,
      host: process.env.DB_IP,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      synchronize: true,
    }),
    DbConfigModule,
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      // middlewares: [TGException],
      options: {
        telegram: {
          testEnv: process.env.BOT_TEST_ENV === 'true',
        },
      },
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScreenModule,
    ScreenAdmin,
    AdminMainModule,
    ProgramModule,
    TelegramModule,
    ScreenWebSocketModule,
    AccreditationModule,
    MessagesModule,
    CatchThemAllModule,
    ChatForwarderModule,
    ListenerModule,
    StreamingHelperModule,
    DjModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private entityManager: EntityManager) {}
  async onModuleInit() {
    return this.entityManager.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
  }
}
