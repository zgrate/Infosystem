import { Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { AdminAuth } from "../admin/auth/admin-auth.decorators";
import { ProgramService } from "./program.service";
import { RegisteredScreen } from "../screen-main/screen.decorators";

@Controller("program")
export class ProgramController {
  constructor(private programService: ProgramService) {
  }

  @Post("/accept/:id")
  @AdminAuth()
  acceptEvent(@Param("id") id: number) {
    return this.programService.acceptEvent(id).then((it) => {
      return { status: "ok", id: id, result: it };
    });
  }

  @Post("/decline/:id")
  @AdminAuth()
  declineEvent(@Param("id") id: number) {
    return this.programService.denyEvent(id).then((it) => {
      return { status: "ok", id: id, result: it };
    });
  }

  @Get("/toaccept")
  @AdminAuth()
  getAcceptedEvents(@Query("limit") limit: number) {
    return this.programService.getToAcceptProgram(limit).then((it) => {
      return {
        status: "ok",
        limit: limit,
        program: it
      };
    });
  }

  @Get("/current")
  getCurrentProgram(@Query("limit") limit: number) {
    return this.programService.getCurrentProgram(limit).then((it) => {
      return {
        status: "ok",
        limit: limit,
        program: it
      };
    });
  }

  @Get("/screen")
  @RegisteredScreen()
  getProgramForScreen(@Req() request) {
    return this.programService
      .getProgramForScreens(request.screen)
      .then((it) => {
        return {
          status: !!it ? "ok" : "error",
          program: it
        };
      });
  }
}
