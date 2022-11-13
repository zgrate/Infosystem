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
    let id = request.params.id;
    if (!id) id = request.headers["authorization"]?.replace("Bearer ", "");
    // console.log(id);
    return this.screenService.getScreenByID(id).then((it) => {
      if (it) {
        if (it.isRegistered) {
          request.screen = it;
        }
        return it.isRegistered;
      } else {
        return false;
      }
    });
  }
}
