import { Controller } from "@nestjs/common";
import { InfoModeService } from "./info-mode.service";

@Controller("/screen/mode/info")
export class InfoModeController {
  constructor(private infoModeService: InfoModeService) {
  }
}
