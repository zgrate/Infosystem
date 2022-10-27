import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScreenModule } from "./screen-main/screen.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AdminMainModule } from "./admin/admin.module";
import { TelegramModule } from "./telegram/telegram.module";

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
    ScreenModule,
    AdminMainModule,
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
