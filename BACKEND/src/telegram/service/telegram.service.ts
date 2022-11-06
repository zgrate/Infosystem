import { Injectable } from "@nestjs/common";

@Injectable()
export class TelegramService {
  adminsTG = ["Pysiek24", "zgrate", "assaltpl"];

  isAdmin(nickname: string) {
    return this.adminsTG.includes(nickname.toLowerCase());
  }
}
