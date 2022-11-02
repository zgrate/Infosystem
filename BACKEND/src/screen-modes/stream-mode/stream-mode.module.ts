import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StreamModeEntity } from "./stream-mode.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StreamModeEntity])]
})
export class StreamModeModule {
}
