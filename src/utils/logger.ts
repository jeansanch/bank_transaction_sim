import { createLogger, format, transports } from 'winston';
import path from 'path';

const logFilePath = path.join(__dirname, '../../logs/transactions.log');

const levels = {
    error: 0,
    info: 1,
    debug: 2
  };

const logger = createLogger({
    level: 'debug',
    levels: levels,
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: logFilePath })
    ]
});

export default logger;