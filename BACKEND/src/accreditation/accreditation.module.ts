import { Module } from "@nestjs/common";
import { AccreditationService } from "./accreditation.service";
import { AccreditationController } from "./accreditation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Accreditation } from "./entities/accreditation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Accreditation])],
  controllers: [AccreditationController],
  providers: [AccreditationService]
})
export class AccreditationModule {
}
