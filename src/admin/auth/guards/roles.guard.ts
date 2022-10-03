import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, ROLES_KEY } from "../role.enum";


@Injectable()
export class RolesGuard implements CanActivate {
  s;


  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    const { user: admin } = context.switchToHttp().getRequest();
    if (!requiredRoles || admin.roles.contains(Role.Sudo)) {
      return true;
    }
    return requiredRoles.some((role) => admin.roles.includes(role));
  }
}
