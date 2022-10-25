import { Controller } from "@nestjs/common";
import { AdminService } from "../admin.service";

@Controller("admin/accounts")
export class AdminAccountsController {
  constructor(private adminService: AdminService) {
  }


}
