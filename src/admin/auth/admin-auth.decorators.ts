import { Role, ROLES_KEY } from "./role.enum";
import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RolesGuard } from "./guards/roles.guard";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export function AdminAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
}

export const AdminUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

export function Sudo() {
  return applyDecorators(AdminAuth(), Roles(Role.Sudo));
}
