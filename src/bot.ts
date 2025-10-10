import { Context, Telegraf,Markup } from 'telegraf';
import type { Update } from 'telegraf/types';
import dotenv from "dotenv"
import type { Video } from './types.js';
import {Api, TelegramClient} from "telegram"
import  input from "input";
import { StringSession } from 'telegram/sessions/StringSession.js';



dotenv.config()

export const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);
const token = process.env.BOT_TOKEN as string
const hash = process.env.api_hash as string
const apiId = process.env.api_id as string
const stringSession = new StringSession("");



 export  const client = new TelegramClient(stringSession, parseInt(apiId), hash, {
    connectionRetries: 5,
  });
  export const startClient = async()=>{
    console.log("Loading interactive examples")
    await client.start({
    phoneNumber: async () => await input.text("number ?"),
    password: async () => await input.text("password?"),
    phoneCode: async () => await input.text("Code ?"),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  await client.sendMessage("me", { message: "Hello!" });
}
export const videos : Video[]= []

bot.start((ctx) => {
  ctx.reply('Hello ' + ctx.from.first_name + '!');
  ctx.reply('Start Posting Your Videos Here',Markup.inlineKeyboard([
    Markup.button.callback('/leech','leech')
  ]))
});

bot.on("video",async (ctx)=>{
  try {
     const video = ctx.message.video;
    const file_id = ctx.message.video.file_id 
    const file_name = ctx.message.video.file_name as string
    const message_id = ctx.message.message_id
    const duration = video.duration;
    const file_size = video.file_size
    const mime_type = video.mime_type;
    const width = video.width;
    const chat_id = ctx.chat.id
    const height = video.height;

    let VidObj : Video ={
file_id,
file_name,
message_id,
chat_id,
duration,
file_size,
gramjs_url : `/download/${message_id}`,
height,
mime_type,
width
    }

  videos.push(VidObj);

    ctx.reply(`Video Saved: ${file_name}`);
  } catch (error) {
    console.log(error);
  }

})
bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  ctx.reply('Send /quit to stop the bot');
});
bot.command('quit', (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);
// Context shortcut
  ctx.leaveChat();
});
bot.command('keyboard', (ctx) => {
  ctx.reply(
    'Keyboard',
    Markup.inlineKeyboard([
      Markup.button.callback('First option', 'first'),
      Markup.button.callback('Second option', 'second'),
    ])
  );
});
bot.on('text', (ctx) => {
  ctx.reply(
    'You choose the ' +
      (ctx.message.text === 'first' ? 'First' : 'Second') +
      ' Option!'
  );
});


