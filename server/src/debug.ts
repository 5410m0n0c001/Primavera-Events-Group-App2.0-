import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction, Express } from 'express';

// ============================================
// 1. PRISMA QUERY LOGGING (SIN IMPACTO)
// ============================================

const logsDir = path.join(process.cwd(), 'logs', 'debug'); // Adjusted for cross-platform compatibility
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const queryLogStream = fs.createWriteStream(
    path.join(logsDir, 'queries.log'),
    { flags: 'a' }
);

// Define extended PrismaClient for $on
// This works with recent Prisma versions when log emission is configured
export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
});

// Capturar queries lentas (>500ms)
// We need to cast or ignore TS error for $on if strict typing is an issue, 
// but usually this works if PrismaClient definition matches.
// Using 'any' for event to avoid complex type importation for now.
(prisma as any).$on('query', (e: any) => {
    const duration = e.duration;
    const timestamp = new Date().toISOString();

    // Log solo queries lentas
    if (duration > 500) {
        const logEntry = {
            timestamp,
            duration: `${duration}ms`,
            query: e.query.substring(0, 200), // Primeros 200 chars
            params: e.params,
        };
        queryLogStream.write(JSON.stringify(logEntry) + '\n');

        // También imprimir en console si es MUY lenta
        if (duration > 2000) {
            console.warn(`⚠️  SLOW QUERY (${duration}ms):`, e.query.substring(0, 100));
        }
    }
});

// ============================================
// 2. REQUEST TIMING MIDDLEWARE (SRE FIXED)
// ============================================

import { AsyncLocalStorage } from 'async_hooks';

interface RequestMetrics {
    method: string;
    url: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    statusCode?: number;
    dbQueryCount?: number;
    error?: string;
}

// Global metrics array (simplistic in-memory storage, enough for basic debugging)
const requestMetrics: RequestMetrics[] = [];

// SRE Fix: Using AsyncLocalStorage to isolate query counts per request thread
interface RequestContext {
    queryCount: number;
}
const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const timingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Initialize context for this specific request
    asyncLocalStorage.run({ queryCount: 0 }, () => {
        const startTime = Date.now();
        const metric: RequestMetrics = {
            method: req.method,
            url: req.path || req.url,
            startTime,
        };

        // Interceptar response
        const originalSend = res.send;
        res.send = function (data: any) {
            const endTime = Date.now();

            // Retrieve thread-local context
            const store = asyncLocalStorage.getStore();
            const queriesForThisRequest = store ? store.queryCount : 0;

            metric.endTime = endTime;
            metric.duration = endTime - startTime;
            metric.statusCode = res.statusCode;
            metric.dbQueryCount = queriesForThisRequest;

            // Guardar métrica
            requestMetrics.push(metric);

            // Mantener solo últimas 1000 requests
            if (requestMetrics.length > 1000) {
                requestMetrics.shift();
            }

            // Alert si request lento
            if (metric.duration && metric.duration > 5000) {
                console.warn(
                    `🐌 SLOW REQUEST: ${metric.method} ${metric.url} - ${metric.duration}ms (${metric.dbQueryCount} queries)`
                );
            }

            return originalSend.call(this, data);
        };

        next();
    });
};

// Actualizar contador de queries durante request aisladamente
(prisma as any).$on('query', (e: any) => {
    const store = asyncLocalStorage.getStore();
    if (store) {
        store.queryCount += 1;
    }
});

// ============================================
// 3. ENDPOINTS DE DIAGNÓSTICO
// ============================================

export const diagnosticEndpoints = (app: Express) => {
    /**
     * GET /api/debug/health
     * Status de la app y pool de conexiones
     */
    app.get('/api/debug/health', async (req: any, res: any) => {
        try {
            const dbHealth = await prisma.$queryRaw`SELECT 1 as alive`;

            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: {
                    heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                    heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
                },
                database: 'connected',
                activeRequests: requestMetrics.length, // crude proxy
            });
        } catch (error: any) {
            res.status(503).json({
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    });

    /**
     * GET /api/debug/metrics
     * Últimas requests y su duración (últimas 100)
     */
    app.get('/api/debug/metrics', (req: any, res: any) => {
        const recent = requestMetrics.slice(-100).map((m) => ({
            method: m.method,
            url: m.url,
            duration: m.duration,
            statusCode: m.statusCode,
            queries: m.dbQueryCount,
        }));

        const stats = {
            totalRequests: requestMetrics.length,
            slowRequests: requestMetrics.filter((m) => (m.duration || 0) > 1000).length,
            avgDuration:
                requestMetrics.length > 0
                    ? Math.round(
                        requestMetrics.reduce((acc, m) => acc + (m.duration || 0), 0) /
                        requestMetrics.length
                    )
                    : 0,
            maxDuration: Math.max(...requestMetrics.map((m) => m.duration || 0), 0),
            avgQueriesPerRequest:
                requestMetrics.length > 0
                    ? Math.round(
                        requestMetrics.reduce((acc, m) => acc + (m.dbQueryCount || 0), 0) /
                        requestMetrics.length
                    )
                    : 0,
            recent,
        };

        res.json(stats);
    });

    /**
     * GET /api/debug/slow-queries
     * Queries más lentas de los logs
     */
    app.get('/api/debug/slow-queries', (req: any, res: any) => {
        try {
            const logPath = path.join(logsDir, 'queries.log');
            if (!fs.existsSync(logPath)) {
                return res.json({ slowQueries: [], count: 0 });
            }

            const lines = fs.readFileSync(logPath, 'utf-8').split('\n');
            const queries = lines
                .filter((line) => line.trim())
                .map((line) => {
                    try {
                        return JSON.parse(line);
                    } catch (e) { return null; }
                })
                .filter(Boolean)
                .sort(
                    (a, b) =>
                        parseInt(b.duration) - parseInt(a.duration)
                )
                .slice(0, 20);

            res.json({
                slowQueries: queries,
                count: queries.length,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    /**
     * POST /api/debug/clear-logs
     * Limpiar logs de queries
     */
    app.post('/api/debug/clear-logs', (req: any, res: any) => {
        try {
            const logPath = path.join(logsDir, 'queries.log');
            if (fs.existsSync(logPath)) {
                fs.unlinkSync(logPath);
            }
            requestMetrics.length = 0;
            res.json({ message: 'Logs cleared' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });
};
