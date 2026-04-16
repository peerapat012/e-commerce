import {Request, Response, NextFunction} from 'express'

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const timeStamp = new Date().toISOString();
        const status = res.statusCode;

        const color = {
            reset: '\x1b[0m',
            dim: '\x1b[2m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            red: '\x1b[31m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
        };

        const methodColor = {
            GET: '\x1b[32m',
            POST: '\x1b[34m',
            PUT: '\x1b[33m',
            PATCH: '\x1b[35m',
            DELETE: '\x1b[31m',
        };

        const statusColor =
            status >= 500 ? color.red :
            status >= 400 ? color.yellow :
            color.green;

        const method = `${methodColor[req.method as keyof typeof methodColor] ?? color.white}${req.method}${color.reset}`;
        const statusStr = `${statusColor}${status}${color.reset}`;
        const durationStr = `${color.dim}${duration}ms${color.reset}`;
        const timeStr = `${color.dim}${timeStamp}${color.reset}`;
        const url = `${color.cyan}${req.originalUrl}${color.reset}`;

        console.log(`[${timeStr}] ${method} ${url} ${statusStr} ${durationStr}`);
    });

    next();
};