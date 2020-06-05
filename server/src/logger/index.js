import winston from 'winston'

// The Logger Category (functional area)
const CATEGORY = 'app-server';


// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'warn',
            filename: './logs/log.log'
        })
    ],
    format: winston.format.combine(
        winston.format.label({ 
            label: CATEGORY
        }),
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
            if (info.stack) {
                // print log trace 
                return `${info.timestamp} [${info.label}] ${info.level}: ${info.stack}`;
            }
            return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        }),
    )
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

export default logger