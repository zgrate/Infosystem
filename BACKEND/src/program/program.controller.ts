import { Body, Controller, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AdminAuth } from "../admin/auth/admin-auth.decorators";
import { ProgramService } from "./program.service";
import { RegisteredScreen } from "../screen-main/screen.decorators";
import { AdminEventDTO } from "./entities/admin-event.dto";

@Controller('program')
export class ProgramController {
  constructor(private programService: ProgramService) {}

  @Post('/refresh')
  @AdminAuth()
  refreshProgramFromExternal() {
    return this.programService.pushPullProgramService();
  }

  @Post('/accept/:id')
  @AdminAuth()
  acceptEvent(@Param('id') id: number) {
    return this.programService.acceptEvent(id).then((it) => {
      return { status: 'ok', id: id, result: it };
    });
  }

  @Post('/decline/:id')
  @AdminAuth()
  declineEvent(@Param('id') id: number) {
    return this.programService.denyEvent(id).then((it) => {
      return { status: 'ok', id: id, result: it };
    });
  }

  @Get('/toaccept')
  @AdminAuth()
  getAcceptedEvents(@Query('limit') limit: number) {
    return this.programService.getToAcceptProgram(limit).then((it) => {
      return {
        status: 'ok',
        limit: limit,
        program: it,
      };
    });
  }

  @Get('/current')
  getCurrentProgram(@Query('limit') limit: number) {
    return this.programService.getCurrentProgram(limit).then((it) => {
      return {
        status: 'ok',
        limit: limit,
        program: it,
      };
    });
  }

  @Get('/screen')
  @RegisteredScreen()
  getProgramForScreen(@Req() request) {
    return this.programService
      .getProgramForScreens(request.screen)
      .then((it) => {
        return {
          status: !!it ? 'ok' : 'error',
          program: it,
        };
      });
  }

  @Put('/admin_event')
  @AdminAuth()
  putAdminEvent(@Body() adminEventDTO: AdminEventDTO) {
    return this.programService.externalAddEvent(adminEventDTO);
  }
  @Put('/mass_admin_events')
  @AdminAuth()
  putMassAdminEvent(@Body() adminEventDTOs: AdminEventDTO[]) {
    return this.refreshProgramFromExternal().then(() =>
      Promise.all(
        adminEventDTOs.map(async (adminEventDTO) => {
          return (
            adminEventDTO.name +
            ' ' +
            await this.programService.externalAddEvent(adminEventDTO)
          );
        }),
      ),
    );
    // return this.programService.externalAddEvent(adminEventDTO)
  }
}
