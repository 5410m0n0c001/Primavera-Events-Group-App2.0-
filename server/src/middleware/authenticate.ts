import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extender la interfaz Request para incluir el usuario decodificado
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Si la ruta es el healthcheck, permitir paso (opcional: ya lo manejamos antes, pero por si acaso)
    if (req.path === '/api/debug/health' || req.path === '/health') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn(`⚠️ [AUTH] Intento de acceso sin token a: ${req.method} ${req.originalUrl}`);
        logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
        // TODO: Para no romper el frontend que estaba sin auth en desarrollo,
        // por ahora solo loggeamos la advertencia, PERO en estricto SRE esto debería
        // retornar 401 inmediatamente. Modifica esta línea para retornar el error
        // una vez que el frontend esté configurado para enviar JWTs.
        // return res.status(401).json({ error: 'No autorizado. Token faltante.' });
        
        // TEMPORAL: Mocking admin access during migration. Remove this once frontend sends token.
        req.user = { role: 'ADMIN', id: 'migration-default' };
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-in-production');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ [AUTH] Token inválido:', error);
        logger.error(`Invalid token for request ${req.originalUrl}`);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
