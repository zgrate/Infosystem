import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class AccreditationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return (
      context.switchToHttp().getRequest().headers["authorization"] ===
      "Bearer " + process.env.ACC_BACKEND_PASSWORD
    );
  }
}
