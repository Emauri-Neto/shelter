import { Request, Response, NextFunction } from 'express';

export function loggingHandler(req: Request, res: Response, next: NextFunction) {
    logging.log(`Incomming - METHOD: [${req.method}] - URL: [${req.url}]`);

    res.on('finish', () => {
        logging.log(`Result - METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`);
    });

    next();
}