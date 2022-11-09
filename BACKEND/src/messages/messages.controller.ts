import { Controller, Get } from "@nestjs/common";
import { RegisteredScreen } from "../screen-main/screen.decorators";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
  constructor(private messagesService: MessagesService) {
  }

  @Get("people")
  @RegisteredScreen()
  getActivePeopleMessages() {
    return this.messagesService.findActivePeopleMessages();
  }

  @Get("admin")
  @RegisteredScreen()
  getActiveAdminMessages() {
    return this.messagesService.findActiveAdminMessages();
  }

  @Get()
  @RegisteredScreen()
  async getAllMessages() {
    return {
      admin: await this.messagesService.findActiveAdminMessages(),
      people: await this.messagesService.findActivePeopleMessages()
    };
  }
}
