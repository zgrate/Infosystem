import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AdminAuth } from "../admin/auth/admin-auth.decorators";
import { ProgramService } from "./program.service";

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
}
