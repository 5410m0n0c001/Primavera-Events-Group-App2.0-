// @ts-nocheck
import axios, { AxiosResponse } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        // Global error handling logic here
        if (error.response?.status === 401) {
            // Handle unauthorized (redirect to login)
            console.warn('Unauthorized access');
        }
        return Promise.reject(error);
    }
);
