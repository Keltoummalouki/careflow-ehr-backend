import { createLogger, format, transports } from "winston";
const { combine , timestamp, printf, colorize } = format;

// message forme
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] : ${message}`;
});

// create logger
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        logFormat
    ),
    transports: [
        new transports.Console(), // display on terminal
        new transports.File({ filename: `logs/app.log`})
    ],
});

export default logger;