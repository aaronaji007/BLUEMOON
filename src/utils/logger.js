import { createLogger, format, transports } from "winston";
import path from "path";

const logger = createLogger({
  level: "info", // Default log level
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
    new transports.File({
      filename: path.join(process.cwd(), "logs", "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(process.cwd(), "logs", "combined.log"),
    }),
  ],
});

export default logger;
