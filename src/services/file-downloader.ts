import fs from "fs";
import ytdl from "@distube/ytdl-core";
import Logger from "./logger";
import ffmpeg from "fluent-ffmpeg";

export default async function downloadMp3ByUrl(
  url: string,
  logger: Logger
): Promise<string> {
  logger.logInfo("Start getting info");
  const info = await ytdl.getInfo(url);
  logger.logSuccess("Info got");

  const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
  const fileName = url.split("/").pop()?.split("=").pop();
  const mp3Path = `tmp/${fileName}.mp3`;
  const stream = await ytdl(url, { format });

  logger.logSuccess("Downloading started");

  await new Promise<void>((resolve, reject) => {
    ffmpeg(stream)
      .audioBitrate(128)
      .format("mp3")
      .on("end", () => resolve())
      .on("error", () => reject())
      .on("progress", (progress: any) => {
        logger.logInfo(`Downloading: ${progress.timemark}`);
      })
      .save(mp3Path);
  });

  return mp3Path;
}

export async function deleteFile(path: string) {
  fs.unlinkSync(path);
}
