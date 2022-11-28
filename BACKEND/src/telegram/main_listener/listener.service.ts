import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Ctx, InjectBot } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { CatchThemAllService } from "../../catch-them-all/base/catch-them-all.service";
import { ChatForwarderService } from "../chat-forwarder/chat-forwarder.service";
import { handleException } from "../../exception.filter";
import { PhotoUploadService } from "../photo-uploader/photo-upload.service";
import { DbConfigService } from "../../db-config/db-config.service";

@Injectable()
export class ListenerService implements OnApplicationBootstrap {
  private logger = new Logger(ListenerService.name);

  constructor(
    @InjectBot() private bot: Telegraf,
    private catchThemAllService: CatchThemAllService,
    private chatForwarderService: ChatForwarderService,
    private photoUploadService: PhotoUploadService,
    private dbConfig: DbConfigService,
  ) {}

  async onUpdate(@Ctx() ctx: Context) {
    try {
      const tgUser = ctx.from;
      // console.log(ctx.chat);
      if (ctx.chat.id == this.dbConfig.configSync('photo-forward-group')) {
        this.logger.debug('Trying upload photo...');
        this.photoUploadService
          .uploadPhoto(ctx.message['document']['file_id'])
          .then(async (it) => {
            this.logger.log('Upload status: ' + it);
            await ctx.reply(it, {
              reply_to_message_id: ctx.message.message_id,
            });
          });
      } else if (ctx.chat.type == 'private') {
        if (this.chatForwarderService.isForwardingChat(ctx.from.id)) {
          return this.chatForwarderService
            .forwardChat(ctx.message, ctx.from)
            .then(async (it) => {
              if (it == 'please_wait') {
                await ctx.reply('Nie tak szybko! Poczekaj 0.5 sekundy!');
              }
            });
        } else if (this.catchThemAllService.isCatching(tgUser.id)) {
          let id = ctx.message['document'];
          if (!id && ctx.message['video']) {
            id = ctx.message['video'];
          }
          if (!id && ctx.message['photo']) {
            return ctx.reply('Wyślij w pliku, nie jako zdjęcia!');
          }
          if (!id) {
            return;
          }
          id = id['file_id'];
          // else if(!id && ctx.message?.photo){
          //   id = ctx.message?.photo.file_id
          // }
          return this.catchThemAllService
            .uploadPhotoRecentlyCatched(tgUser.id, id)
            .then((it) => {
              if (it == 'ok') {
                return ctx.reply('Dodano zdjęcie!', {
                  reply_to_message_id: ctx.message['id'],
                });
              } else if (it == 'not_catch') {
                return ctx.reply('Nie złapałeś jescze tego fursuita!', {
                  reply_to_message_id: ctx.message['id'],
                });
              } else if (it === 'error') {
                return ctx.reply('Wystąpił błąd. Spróbuj ponownie później!', {
                  reply_to_message_id: ctx.message['id'],
                });
              }
            });
        }
      }
    } catch (error) {
      handleException(error);
    }
  }

  onApplicationBootstrap(): any {
    this.logger.debug('Registering output on everything...');
    this.bot.on(
      [
        'message',
        'document',
        'video',
        'photo',
        'sticker',
        'voice',
        'animation',
        'audio',
      ],
      (ctx) => this.onUpdate(ctx),
    );
  }
}
