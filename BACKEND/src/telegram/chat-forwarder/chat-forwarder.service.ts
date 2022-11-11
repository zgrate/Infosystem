import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { User } from "typegram/manage";
import { Message } from "telegraf/typings/core/types/typegram";
import { DbConfigService } from "../../db-config/db-config.service";
import { Cron } from "@nestjs/schedule";

export type ChatTarget = "org" | "security" | "photos_chat";

export interface ChatForwarder {
  lastMessage: number;
  tgId: number;
  target: ChatTarget;
}

@Injectable()
export class ChatForwarderService {
  chatForwarding: ChatForwarder[] = [];

  constructor(
    @InjectBot() private botService: Telegraf,
    private dbConfig: DbConfigService
  ) {
  }

  @Cron("*/10 * * * * *")
  async checkTimeout() {
    const msgTimeout = await this.dbConfig.config<number>(
      "chat-forward-timeout",
      60000
    );

    const items = this.chatForwarding.filter((it) => {
      // console.log(Date.now() - it.lastMessage)
      return (
        it.target !== "photos_chat" && Date.now() - it.lastMessage > msgTimeout
      );
    });

    this.chatForwarding = this.chatForwarding.filter(
      (it) => !items.includes(it)
    );
    for (const it of items) {
      await this.botService.telegram
        .sendMessage(
          it.tgId,
          "Twoje przekierowanie czatu zostało samoczynnie zakończone!"
        )
        .then(() => false);
    }
  }

  async enableChatForward(target: ChatTarget, from: User) {
    this.disableChatForward(from.id);
    this.chatForwarding.push({
      tgId: from.id,
      lastMessage: Date.now(),
      target: target
    });
    await this.botService.telegram.sendMessage(
      await this.dbConfig.config(
        target === "org"
          ? "org_chat"
          : target === "photos_chat"
            ? "photos_chat"
            : "security_chat"
      ),
      `Użytkownik ${from.first_name} ${from.last_name} ${
        !!from.username ? "@" + from.username : "(brak_nicku)"
      } otworzył czat!`
    );
  }

  disableChatForward(userId: number) {
    const index = this.chatForwarding.findIndex((it) => it.tgId == userId);
    if (index !== -1) {
      this.chatForwarding.splice(index, 1);
      return true;
    }
    return false;
  }

  async forwardChat(message: Message, from: User) {
    const chatForwarder = this.chatForwarding.find((it) => it.tgId == from.id);
    if (chatForwarder) {
      await this.botService.telegram.forwardMessage(
        await this.dbConfig.config(
          chatForwarder.target === "org"
            ? "org_chat"
            : chatForwarder.target === "photos_chat"
              ? "photos_chat"
              : "security_chat"
        ),
        message.chat.id,
        message.message_id
      );
      chatForwarder.lastMessage = Date.now();
    }
  }

  isForwardingChat(id: number) {
    return this.chatForwarding.findIndex((it) => it.tgId == id) !== -1;
  }
}
