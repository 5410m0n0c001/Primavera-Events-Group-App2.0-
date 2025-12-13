import { Request, Response, NextFunction } from 'express';

// Simple sanitization to remove common XSS vectors from body/query
const sanitizeValues = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
            // Remove <script> tags and html typical vectors
            obj[key] = obj[key]
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/on\w+="[^"]*"/g, "");
        } else if (typeof obj[key] === 'object') {
            sanitizeValues(obj[key]);
        }
    });
    return obj;
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.body = sanitizeValues(req.body);
    req.query = sanitizeValues(req.query);
    req.params = sanitizeValues(req.params);
    next();
};
