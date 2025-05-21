import downloadMp3ByUrl, { deleteFile } from "./services/file-downloader";
import Logger from "./services/logger";

async function main() {
  const logger = new Logger();

  try {
    const outputPath = await downloadMp3ByUrl(
      "https://www.youtube.com/watch?v=txLKZ2oLwa8",
      logger
    );

    logger.logFile(outputPath);
    
    await deleteFile(outputPath);
  } catch (error) {
    logger.logError(`❌ Error: ${error}`);
  }
}

main();
