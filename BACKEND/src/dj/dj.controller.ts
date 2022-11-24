import { Controller } from "@nestjs/common";
import { DjService } from "./dj.service";

@Controller("dj")
export class DjController{
  constructor(private djService: DjService){}
}
