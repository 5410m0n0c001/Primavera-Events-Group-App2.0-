import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error('Unhandled Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (res.headersSent) {
        return next(err);
    }

    // Prisma Errors
    // Prisma Errors - SRE Sec Fix: Do not leak DB structure or error codes to client
    if (err.code && err.code.startsWith('P')) {
        return res.status(400).json({
            error: true,
            // Generic message to prevent information leakage
            message: 'Database operation failed or provided data was invalid.',
            // Only send code in development, hide in production
            ...(process.env.NODE_ENV === 'development' && { code: err.code })
        });
    }

    const statusCode = err.statusCode || 500;
    // Hide raw error message if it's a 500 to prevent leaking code details in production
    const message = (statusCode === 500 && process.env.NODE_ENV !== 'development')
        ? 'Internal Server Error'
        : (err.message || 'Internal Server Error');

    res.status(statusCode).json({
        error: true,
        message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
