import { Module } from "@nestjs/common";
import { DjService } from "./dj.service";

@Module({
  providers: [DjService]
})
export class DjModule{

}
