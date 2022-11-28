import { Inject, Injectable } from '@nestjs/common';
import { TELEGRAM_MODULE_OPTIONS } from '../constants/telegram.constants';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
    bot: Telegraf;
    options: ITelegramOptions;

    constructor(
        @Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions
    ) {
        this.options = options;
        this.bot = new Telegraf(options.token);
    }

    async sendMessage(
        message: string,
        chatId: string = this.options.chatId
    ): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, message);
    }
}
