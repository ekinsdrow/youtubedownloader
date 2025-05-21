import { Input, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

export default class Bot {
  private bot: Telegraf;
  private userId: string;
  private downloadCallback: (url: string) => void;
  private previousProgressMessageId: number | undefined;

  constructor(token: string, userId: string, downloadCallback: (url: string) => void) {
    this.bot = new Telegraf(token);
    this.userId = userId;
    this.downloadCallback  = downloadCallback;

    this.bot.launch();
    this.listen();
  }

  async start() {
    await this.bot.launch();
  }

  async listen() {
    this.bot.on(message("text"), (ctx) => {
      if (ctx.message.from.id !== parseInt(this.userId)) {
        ctx.reply("You are not authorized to use this bot");
        return;
      }

      const message = ctx.message.text;

      const isYoutubeUrl =
        message.includes("youtube.com") && message.includes("watch?v=");

      if (!isYoutubeUrl) {
        ctx.reply("Please send a valid Youtube URL");
        return;
      } 

      this.downloadCallback(message);
    });
  }



  logInfo(message: string) {
    const msg = `ℹ️ ${message}`;
    console.log(msg);
    this.bot.telegram.sendMessage(this.userId, msg);
  }

  async logProgress(message: string) {
    const msg = `⏳ ${message}`;
    console.log(msg);

    if (this.previousProgressMessageId) {
      await this.bot.telegram.editMessageText(this.userId, this.previousProgressMessageId, undefined, msg);
    } else {
      const msgId = await this.bot.telegram.sendMessage(this.userId, msg);
      this.previousProgressMessageId = msgId.message_id;
    }
  }

  logError(message: string) {
    const msg = `❌ ${message}`;
    console.error(msg);
    this.bot.telegram.sendMessage(this.userId, msg);
  }

  logSuccess(message: string) {
    const msg = `✅ ${message}`;
    console.log(msg);
    this.bot.telegram.sendMessage(this.userId, msg);
  }

  async logFile(outputPath: string) {
    await this.bot.telegram.sendAudio(this.userId, Input.fromLocalFile(outputPath));
    this.previousProgressMessageId = undefined;
  }
}
