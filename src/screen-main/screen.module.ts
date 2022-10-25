import { Module } from "@nestjs/common";
import { ScreenController } from "./controllers/screen.controller";
import { ScreenService } from "./services/screen.service";
import { ScreenEntity } from "../shared/entities/definitions";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ScreenEntity])],
  controllers: [ScreenController],
  providers: [ScreenService],
  exports: [ScreenService]
})
export class ScreenModule {
}
