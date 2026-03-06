import React, { useState } from 'react';

interface Props {
    onLoginSuccess: (token: string) => void;
    onBack: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBack }: Props) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error('Contraseña incorrecta');
            }

            const data = await response.json();

            // We store it in memory via App.tsx but also drop a localStorage item 
            // just in case we need it across refreshes for the dashboard endpoints
            localStorage.setItem('adminToken', data.token);

            onLoginSuccess(data.token);

        } catch (err: any) {
            setError(err.message || 'Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex items-center justify-center p-4">
            <div className="absolute top-4 left-4">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors text-sm"
                >
                    ← Volver al Sistema
                </button>
            </div>

            <div className="max-w-md w-full bg-white dark:bg-[#1c1c1e] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primavera-gold/20 blur-3xl rounded-full pointer-events-none"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-black rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner border border-gray-200 dark:border-white/5">
                        🔒
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Área exclusiva para personal autorizado de Primavera Events Group.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña de Administrador</label>
                        <input
                            type="password"
                            className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primavera-gold transition-shadow"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-500/10 p-2 rounded-lg border border-red-100 dark:border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl px-4 py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Ingresar al Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
