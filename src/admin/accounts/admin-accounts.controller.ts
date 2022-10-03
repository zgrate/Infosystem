import { Controller, Get } from "@nestjs/common";
import { Sudo } from "../auth/admin-auth.decorators";
import { AdminService } from "../admin.service";

@Controller("admin/accounts")
export class AdminAccountsController {
  constructor(private adminService: AdminService) {
  }

  @Get("list")
  @Sudo()
  async listAccounts(): Promise<any[]> {
    return this.adminService.getAllAdmins().then<any[]>((admin) => {
      return admin.map(({ password, ...result }) => result);
    });
  }
}
