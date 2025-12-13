import cors from 'cors';

const whitelist = (process.env.CORS_ORIGIN || '*').split(',');

export const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes('*') || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);
