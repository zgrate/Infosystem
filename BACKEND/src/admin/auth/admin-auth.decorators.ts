import { Role, ROLES_KEY } from "./role.enum";
import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { RolesGuard } from "./guards/roles.guard";
import { AcceptGuard } from "./guards/accept.all.guard";

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export function AdminAuth() {
  return applyDecorators(
    UseGuards(AcceptGuard, RolesGuard)
  );
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

export function Admin() {
  return applyDecorators(AdminAuth(), Roles(Role.Admin));
}
