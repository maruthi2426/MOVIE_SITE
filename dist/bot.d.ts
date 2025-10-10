import { Context, Telegraf } from 'telegraf';
import type { Update } from 'telegraf/types';
import type { Video } from './types.js';
import { TelegramClient } from "telegram";
export declare const bot: Telegraf<Context<Update>>;
export declare const client: TelegramClient;
export declare const startClient: () => Promise<void>;
export declare const videos: Video[];
//# sourceMappingURL=bot.d.ts.map