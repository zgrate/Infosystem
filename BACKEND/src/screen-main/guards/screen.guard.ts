import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ScreenService } from "../services/screen.service";

@Injectable()
export class RegisteredScreenGuard implements CanActivate {
  constructor(private screenService: ScreenService) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    return this.screenService.getScreenByID(id).then((it) => {
      if (it !== null) {
        return it.isRegistered;
      } else {
        return false;
      }
    });
  }
}
