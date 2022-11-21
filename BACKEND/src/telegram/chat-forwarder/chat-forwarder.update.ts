import { Command, Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { User } from "typegram/manage";
import { TGUser } from "../telegram.decorators";
import { ChatForwarderService } from "./chat-forwarder.service";
import { UseGuards } from "@nestjs/common";
import { BannedGuard } from "../banned.guard";

@Update()
@UseGuards(BannedGuard)
export class ChatForwarderUpdate {
  constructor(private chatForwarderService: ChatForwarderService) {
  }

  @Command("/org")
  async enableOrgChat(@Ctx() context: Context, @TGUser() user: User) {
    if (context.chat.type === "private") {
      await this.chatForwarderService
        .enableChatForward("org", user)
        .then(
          async (it) =>
            await context.reply(
              "Czat z organizacją nawiązany! Wszystko co napiszesz lub wyślesz zostanie wysłane do organizacji!  /disable żeby wyłączyć"
            )
        );
    }
  }

  @Command(["/sefurity", "/security"])
  async enableSecurityChat(@Ctx() context: Context, @TGUser() user: User) {
    if (context.chat.type === "private") {
      this.chatForwarderService
        .enableChatForward("security", user)
        .then(
          async (it) =>
            await context.reply(
              "Czat z sefurity nawiązany! Wszystko co napiszesz lub wyślesz zostanie wysłane do sefurity! /disable żeby wyłączyć"
            )
        );
    }
  }

  @Command(["/konwent_zdjecia"])
  async enablePhotosChat(@Ctx() context: Context, @TGUser() user: User) {
    if (context.chat.type === "private") {
      this.chatForwarderService
        .enableChatForward("photos_chat", user)
        .then(
          async () =>
            await context.reply(
              "Uplad zdjęć włączony. Wyślij wszystko co masz w plikach! /disable aby zakończyć!"
            )
        );
    }
  }

  @Command(["/disable"])
  async disable(@Ctx() context: Context, @TGUser() user: User) {
    if (context.chat.type === "private") {
      if (this.chatForwarderService.disableChatForward(user.id))
        await context.reply("Przekierowanie czatu wyłaczone!!");
      else await context.reply("Przekierowanie czatu nie było włączone!");
    }
  }

  @On("message")
  async onUpdate(@Ctx() context: Context, @TGUser() user: User) {
    if (
      context.chat.type == "private" &&
      this.chatForwarderService.isForwardingChat(user.id)
    ) {
      await this.chatForwarderService.forwardChat(context.message, user).then(async it => {
        if (it == "please_wait") {
          await context.reply("Nie tak szybko! Poczekaj 0.5 sekundy!");
        }
      });
    }
  }
}
