import { Injectable } from "@nestjs/common";

@Injectable()
export class TelegramService {
  adminsTG = ["pysiek24", "zgrate", "assaltpl"];

  isAdmin(nickname: string) {
    return this.adminsTG.includes(nickname.toLowerCase());
  }
}
