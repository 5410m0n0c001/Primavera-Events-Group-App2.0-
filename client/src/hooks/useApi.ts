// @ts-nocheck
import { useState, useCallback } from 'react';
import { api } from '../config/api';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T>() {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const request = useCallback(async (method: 'get' | 'post' | 'put' | 'delete', url: string, payload?: any) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await api[method](url, payload);
            setState({ data: response.data, loading: false, error: null });
            return response.data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
            setState({ data: null, loading: false, error: errorMsg });
            throw err;
        }
    }, []);

    return { ...state, request };
}
