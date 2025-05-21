export default class Logger {
  // TODO: send to telegram
  logInfo(message: string) {
    console.log("ℹ️ ", message);
  }

  logError(message: string) {
    console.error("❌ ", message);
  }

  logSuccess(message: string) {
    console.log("✅ ", message);
  }

  logFile(outputPath: string) {
    console.log("✅ File downloaded to ", outputPath);
  }
}
