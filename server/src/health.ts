import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'healthy', message: 'Database connected' };
    } catch (error: any) {
        return { status: 'unhealthy', message: error.message };
    }
}

function checkMemory() {
    const used = process.memoryUsage();
    return {
        rss: Math.round(used.rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(used.heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(used.heapTotal / 1024 / 1024) + ' MB'
    };
}

export const healthCheck = async (req: Request, res: Response) => {
    const dbHealth = await checkDatabase();
    const memory = checkMemory();

    const health = {
        status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()) + 's',
        database: dbHealth,
        memory: memory,
        environment: process.env.NODE_ENV || 'development'
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
};
