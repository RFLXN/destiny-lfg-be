import { addColors, createLogger, format, transports } from "winston";

const { combine, errors, colorize, timestamp, printf } = format;

addColors({
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "grey",
    info: "green"
});

const logger = createLogger({
    level: "info",
    format: combine(
        errors({ stack: true }),
        colorize(),
        timestamp(),
        printf(({ timestamp, level, message, stack }) => `[${timestamp}] [${level}] ${message}${stack ? `\n${stack}` : ""}`)
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;
