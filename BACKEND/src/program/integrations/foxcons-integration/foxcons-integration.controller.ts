import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { FoxconsIntegrationService } from "./foxcons-integration.service";
import { AdminEventDTO } from "../../entities/admin-event.dto";

@Controller('foxcons')
export class FoxconsIntegrationController {
  constructor(private foxconsIntegrationService: FoxconsIntegrationService) {}

  @Get('halls')
  getHalls() {
    return this.foxconsIntegrationService.listHalls();
  }

  @Get('halls/:name')
  getHall(@Param('name') name: string) {
    return this.foxconsIntegrationService.getHallBySystemName(name);
  }

  @Post('schedule/dto')
  getScheduleDTO(@Body() event: AdminEventDTO[]) {
    return event.map((it) =>
      this.foxconsIntegrationService.getAdminToFoxconsDTO(it, 1),
    );
  }

  @Put('schedule/upload')
  uploadAllScheduleAdmin(@Body() events: AdminEventDTO[]) {
    return Promise.all(
      events.map(
        async (it) =>
          it.name +
          ':' +
          (await this.foxconsIntegrationService.addAdminEvent(it, 26)),
      ),
    );
  }

  @Get('schedule/lastdiff')
  getLastDiff(@Query('id') id: number) {
    return this.foxconsIntegrationService
      .getListProgram(undefined)
      .then((it) => {
        // console.log(it)
        return it
          .find((it) => it.externalId == id)

      });
  }

  // @Get('schedule/search')
  // searchProgramInDB(@Query('query') query: string) {
  //   return this.foxconsIntegrationService
  //     .getListProgram(undefined)
  //     .then((it) => {
  //       // console.log(it)
  //       return it
  //         .find((it) => it.externalId == id)
  //
  //     });
  // }
}
