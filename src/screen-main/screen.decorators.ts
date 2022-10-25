import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";
import { RegisteredScreenGuard } from "./guards/screen.guard";

export function RegisteredScreen() {
  return applyDecorators(UseGuards(RegisteredScreenGuard));
}

export const ScreenID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().params.id;
  }
);
