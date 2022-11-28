import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { User } from "typegram/manage";
import { Message } from "telegraf/typings/core/types/typegram";
import { DbConfigService } from "../../db-config/db-config.service";
import { Cron } from "@nestjs/schedule";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { handleException } from "../../exception.filter";

export type ChatTarget = 'org' | 'security' | 'photos_chat' | 'main_chat';

export interface ChatForwarder {
  lastMessage: number;
  tgId: number;
  target: ChatTarget;
}

@Injectable()
export class ChatForwarderService {
  chatForwarding: ChatForwarder[] = [];

  channelMapping: {};

  constructor(
    @InjectBot() private botService: Telegraf,
    private dbConfig: DbConfigService,
    private event: EventEmitter2,
  ) {
    this.channelMapping = {
      org: () => this.dbConfig.config('org_chat'),
      security: () => this.dbConfig.config('security_chat'),
      photos_chat: () => this.dbConfig.config('photos_chat'),
      main_chat: () => this.dbConfig.config('main_group'),
    };
  }

  @Cron('*/10 * * * * *')
  async checkTimeout() {
    const msgTimeout = await this.dbConfig.config<number>(
      'chat-forward-timeout',
      60000,
    );

    const items = this.chatForwarding.filter((it) => {
      // console.log(Date.now() - it.lastMessage)
      return (
        it.target !== 'photos_chat' && Date.now() - it.lastMessage > msgTimeout
      );
    });

    this.chatForwarding = this.chatForwarding.filter(
      (it) => !items.includes(it),
    );
    for (const it of items) {
      await this.botService.telegram
        .sendMessage(
          it.tgId,
          'Twoje przekierowanie czatu zostało samoczynnie zakończone!',
        )
        .then(() => false);
    }
  }

  @OnEvent('catch.enable')
  onPhotosUpload(tgId: number) {
    if (this.isForwardingChat(tgId)) {
      this.disableChatForward(tgId);
    }
  }

  async enableChatForward(target: ChatTarget, from: User) {
    this.disableChatForward(from.id);
    this.chatForwarding.push({
      tgId: from.id,
      lastMessage: Date.now(),
      target: target,
    });
    this.event.emit('forwarder.enabled', from.id);
    if (target !== 'main_chat') {
      await this.botService.telegram.sendMessage(
        await this.channelMapping[target](),
        `Użytkownik ${from.first_name} ${
          !!from.last_name ? from.last_name : ''
        } <a href="tg://user?id=${from.id}">oznaczenie</a> otworzył czat!`,
        { parse_mode: 'HTML' },
      );
    }
  }

  disableChatForward(userId: number) {
    const index = this.chatForwarding.findIndex((it) => it.tgId == userId);
    if (index !== -1) {
      this.chatForwarding.splice(index, 1);
      return true;
    }
    return false;
  }

  async forwardChat(
    message: Message,
    from: User,
  ): Promise<'please_wait' | 'ok' | 'no_forward'> {
    const chatForwarder = this.chatForwarding.find((it) => it.tgId == from.id);
    if (chatForwarder) {
      if (
        ['photos_chat', 'main_chat'].includes(chatForwarder.target) &&
        Date.now() - chatForwarder.lastMessage < 500
      ) {
        return 'please_wait';
      } else {
        if (chatForwarder.target !== 'main_chat') {
          await this.botService.telegram
            .forwardMessage(
              await this.channelMapping[chatForwarder.target](),
              message.chat.id,
              message.message_id,
            )
            .catch((it) => handleException(it));
        } else {
          await this.botService.telegram
            .copyMessage(
              await this.channelMapping[chatForwarder.target](),
              message.chat.id,
              message.message_id,
            )
            .catch((it) => handleException(it));

          chatForwarder.lastMessage = Date.now();
        }
        return 'ok';
      }
    }
    return 'no_forward';
  }

  isForwardingChat(id: number) {
    return this.chatForwarding.findIndex((it) => it.tgId == id) !== -1;
  }
}
