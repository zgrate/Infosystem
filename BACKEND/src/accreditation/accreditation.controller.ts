import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AccreditationService } from "./accreditation.service";
import { CreateUpdateAccreditationDto } from "./dto/create-update-accreditation.dto";
import { AccreditationGuard } from "./accreditation.guard";

@Controller("accreditation")
@UseGuards(AccreditationGuard)
export class AccreditationController {
  constructor(private readonly accreditationService: AccreditationService) {
  }

  @Post("items")
  async create(@Body() createAccreditationDto: CreateUpdateAccreditationDto) {
    return this.accreditationService
      .create(createAccreditationDto)
      .then((res) => {
        return {
          status: res ? "OK" : "FAILED"
        };
      });
  }

  @Get("keys/:room")
  async getKeyStatus(@Param("room") room: string) {
    return this.accreditationService.getKeyStatus(+room).then((it) => {
      return { room: room, status: it };
    });
  }

  @Post("checkin/:id")
  async checkIn(@Param("id") id: string) {
    return this.accreditationService.checkInUser(+id);
  }

  @Get("items")
  async findAll() {
    return this.accreditationService.findAll();
  }

  @Get("items/:id")
  findOne(@Param("id") id: string) {
    return this.accreditationService.findOne(+id);
  }

  @Patch("items/:id")
  update(
    @Param("id") id: string,
    @Body() updateAccreditationDto: CreateUpdateAccreditationDto
  ) {
    return this.accreditationService.update(+id, updateAccreditationDto);
  }

  @Delete("items/:id")
  remove(@Param("id") id: string) {
    return this.accreditationService.remove(+id);
  }

  // @Delete('purge')
  // purgeDB() {
  //   return this.accreditationService.clear();
  // }
}
