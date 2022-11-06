import { PartialType } from "@nestjs/mapped-types";
import { AccreditationEntity } from "../entities/accreditation.entity";

export class CreateUpdateAccreditationDto extends PartialType(AccreditationEntity) {
}
