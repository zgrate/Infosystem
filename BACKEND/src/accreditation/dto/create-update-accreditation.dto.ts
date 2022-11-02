import { PartialType } from "@nestjs/mapped-types";
import { Accreditation } from "../entities/accreditation.entity";

export class CreateUpdateAccreditationDto extends PartialType(Accreditation) {
}
