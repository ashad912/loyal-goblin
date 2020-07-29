import winston from 'winston'

import keys from '@config/keys'

// The Logger Category (functional area)
const CATEGORY = 'server';

// Paths to logs
const file = './logs/server.log'
const test = './logs/test.log'

const path = keys.nodeEnv === "test" ? test : file

// Logger configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            level: 'warn',
            filename: path
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