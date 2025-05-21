import fs from "fs";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "fluent-ffmpeg";
import Bot from "./bot";

export default async function downloadMp3ByUrl(
  url: string,
  bot: Bot
): Promise<string> {
  bot.logInfo("Start getting info");
  const info = await ytdl.getInfo(url);
  bot.logSuccess("Info got");

  const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
  const fileName = url.split("/").pop()?.replace(".", "_");
  const mp3Path = `tmp/${fileName}.mp3`;
  const stream = await ytdl(url, { format });

  bot.logSuccess("Downloading started");

  await new Promise<void>((resolve, reject) => {
    ffmpeg(stream)
      .audioBitrate(128)
      .format("mp3")
      .outputOptions(
        "-metadata",
        `title=${info.videoDetails.title}`,
        "-metadata",
        `artist=${info.videoDetails.author.name}`
      )
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .on("progress", (progress: any) => {
        bot.logProgress(`Downloading: ${progress.timemark}`);
      })
      .save(mp3Path);
  });
  return mp3Path;
}

export async function deleteFile(path: string) {
  fs.unlinkSync(path);
}
