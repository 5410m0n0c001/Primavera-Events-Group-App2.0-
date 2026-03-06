import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

interface Props {
    onLoginClick: () => void;
    adminToken: string | null;
    onLogout: () => void;
}

export default function AIChatInterface({ onLoginClick, adminToken, onLogout }: Props) {
    const [showChat, setShowChat] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const timeoutRef = React.useRef<any>(null);

    const handleSecretClick = () => {
        setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                onLoginClick();
                return 0;
            }

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setClickCount(0);
            }, 2000);

            return newCount;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] to-[#E5E5EA] dark:from-black dark:to-[#1c1c1e] text-[#1D1D1F] dark:text-white flex flex-col relative overflow-hidden transition-colors duration-500">

            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-primavera-gold/20 to-transparent blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-theme-green/10 to-transparent blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 w-full max-w-5xl mx-auto relative">

                {/* Header / Brand */}
                <div className={`transition-all duration-700 w-full flex flex-col items-center ${showChat ? 'opacity-0 h-0 overflow-hidden scale-95' : 'opacity-100 mb-12 scale-100'}`}>
                    <div
                        onClick={handleSecretClick}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-6 bg-gradient-to-tr from-primavera-gold to-yellow-200 shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500"></div>
                        <span className="text-4xl sm:text-5xl relative z-10 select-none">✨</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Primavera Events
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 text-center max-w-2xl font-light">
                        Tu asistente personal impulsado por IA para crear el evento de tus sueños.
                    </p>
                </div>

                {/* Entry Actions */}
                {!showChat && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mb-8 animate-fade-in-up delay-300">
                        <button
                            onClick={() => setShowChat(true)}
                            className="group relative w-full flex justify-center py-4 px-8 border border-transparent text-lg font-medium rounded-2xl text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            <span className="flex items-center gap-2">
                                Hablar con Sofía <span className="text-xl">👋</span>
                            </span>
                        </button>
                    </div>
                )}

                {/* Admin Quick Insight Panel (if logged in, visible before chat) */}
                {!showChat && adminToken && (
                    <div className="mt-8 p-6 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10 w-full max-w-2xl shadow-lg border-l-4 border-l-primavera-gold animate-fade-in-up delay-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <span className="text-primavera-gold">👑</span> Modo Administrador Activo
                            </h3>
                            <button onClick={onLogout} className="text-sm text-red-500 hover:underline">Cerrar Sesión Admin</button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Sofía tiene acceso a contexto interno. Al abrir el chat, operará bajo directivas ejecutivas. Para salir del modo admin, presiona el candado inferior o cierra sesión.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => onLoginClick()} className="bg-white dark:bg-[#2c2c2e] px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                                Ir al Dashboard Principal
                            </button>
                        </div>
                    </div>
                )}

                {/* Active Chat Window Container */}
                <div className={`transition-all duration-700 origin-bottom w-full max-w-3xl flex-1 flex flex-col ${showChat ? 'opacity-100 scale-100 h-full' : 'opacity-0 scale-95 h-0 overflow-hidden absolute pointer-events-none'}`}>
                    <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-[#1c1c1e]/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primavera-gold to-yellow-200 shadow-inner flex items-center justify-center text-sm">✨</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">Sofía</h3>
                                    <p className="text-xs text-green-500 font-medium">En línea {adminToken && <span className="text-primavera-gold ml-1">(Modo Admin)</span>}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChat(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Embedded Chat System */}
                        <div className="flex-1 overflow-hidden relative">
                            <ChatWindow isAdmin={!!adminToken} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
