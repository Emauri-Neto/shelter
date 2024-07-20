import { ErrorRequestHandler, Response } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http';
import { z } from 'zod';
import AppError from '../utils/AppError';
import { REFRESH_PATH, clearAuthCookies } from '../utils/cookies';

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message
    }));

    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors
    });
};

const handleAppError = (res: Response, error: AppError) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logging.error(`Failed - METHOD: [${req.method}] - PATH: ${req.path} => ERROR: [${err}]`);

    if (req.path === REFRESH_PATH) {
        clearAuthCookies(res);
    }

    if (err instanceof z.ZodError) {
        return handleZodError(res, err);
    }

    if (err instanceof AppError) {
        return handleAppError(res, err);
    }

    return res.status(INTERNAL_SERVER_ERROR).send('INTERNAL SERVER ERROR');
};

export default errorHandler;
