import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PeopleMessageEntity } from "./people-message.entity";
import { AdminMessageEntity } from "./admin-message.entity";
import { MessagesController } from "./messages.controller";
import { ScreenModule } from "../screen-main/screen.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PeopleMessageEntity, AdminMessageEntity]),
    ScreenModule
  ],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {
}
