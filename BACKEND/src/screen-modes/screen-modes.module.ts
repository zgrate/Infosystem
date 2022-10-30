import { Module } from "@nestjs/common";
import { InfoModeModule } from "./info-mode/info-mode.module";
import { StreamModeModule } from "./stream-mode/stream-mode.module";

@Module({
  imports: [InfoModeModule, StreamModeModule]
})
export class ScreenModesModule {
}
