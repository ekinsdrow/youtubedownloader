import downloadMp3ByUrl, { deleteFile } from "./services/file-downloader";
import Bot from "./services/bot";
import dotenv from "dotenv";

async function main() {
  dotenv.config();
  const token = process.env.TELEGRAM_BOT_TOKEN as string;
  const userId = process.env.TELEGRAM_USER_ID as string;

  if (!token || !userId) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_USER_ID are required");
  }

  const bot = new Bot(token, userId, (url) => download(url, bot));
}

async function download(url: string, bot: Bot) {
  try {
    const outputPath = await downloadMp3ByUrl(
      url,
      bot
    );
    await bot.logFile(outputPath);

    await deleteFile(outputPath);
  } catch (error) {
    bot.logError(`❌ Error: ${error}`);
  }
}

main();
