import React, { useState, useEffect, useRef } from 'react';

// Declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Interfaces for our custom Chat schema mapping closely to Gemini's expected JSON array.
type Role = 'user' | 'sofia';

interface ChatMessage {
    id: string;
    role: Role;
    content: string;
    timestamp: Date;
}

interface Props {
    isAdmin: boolean;
}

export default function ChatWindow({ isAdmin }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'es-MX';

            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setInput(transcript);
            };
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInput('');
            recognitionRef.current?.start();
        }
    };

    const speakMessage = (text: string) => {
        if (isMuted || !window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Stop talking first
        const utterance = new SpeechSynthesisUtterance(text);

        // Explicitly try to find a female Spanish voice (Sabina, Paulina, Helena, Laura, etc.)
        const voices = window.speechSynthesis.getVoices();
        const spanishVoices = voices.filter(v => v.lang.startsWith('es'));

        if (spanishVoices.length > 0) {
            const preferredNames = ['sabina', 'paulina', 'helena', 'laura', 'monica', 'google español', 'female', 'mujer'];
            let selectedVoice = null;

            for (const name of preferredNames) {
                selectedVoice = spanishVoices.find(v => v.name.toLowerCase().includes(name) || v.voiceURI.toLowerCase().includes(name));
                if (selectedVoice) break;
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                utterance.voice = spanishVoices[0]; // Fallback to first Spanish voice
            }
        }

        utterance.lang = 'es-MX';
        utterance.rate = 1.0;
        utterance.pitch = 1.2; // Slightly higher pitch for a more feminine tone as fallback
        window.speechSynthesis.speak(utterance);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        // Initial Greeting
        const greeting = isAdmin
            ? "Hola. Soy Sofía en modo Administrador. ¿Qué métricas, reportes de CRM o citas de hoy necesitas investigar?"
            : "¡Hola! Soy Sofía ✨. Me emociona ayudarte a planear el evento perfecto en Primavera. ¿Con quién tengo el placer de hablar?";

        setMessages([{
            id: Date.now().toString(),
            role: 'sofia',
            content: greeting,
            timestamp: new Date()
        }]);
        speakMessage(greeting);
    }, [isAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        if (isListening) {
            recognitionRef.current?.stop();
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Map existing messages to history payload
            const historyPayload = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const endpoint = isAdmin ? '/api/ai-chat/admin' : '/api/ai-chat';
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };

            // Since we kept logic simple, if isAdmin is true, index.ts expects the JWT token in headers or it fails
            // Assuming App.tsx maintains a global state... unfortunately we didn't pass it deep down.
            // Easiest fix: read from localStorage if you save it there, OR passed as a prop.
            // For immediate simplicity, let's just make the request using any known browser creds or fail gracefully.
            // Wait: Admin mode in backend is protected by authenticate middleware which expects Bearer token.
            // *Correction*: We will just use the localStorage token (which AdminLogin will emit).
            const token = localStorage.getItem('adminToken');
            if (isAdmin && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: userMessage.content,
                    history: historyPayload
                }),
            });

            if (!response.ok) {
                let errText = 'Error de conexión con Sofía.';
                try {
                    const errorObj = await response.json();
                    if (errorObj.error) errText = errorObj.error;
                } catch (e) { }

                if (response.status === 429) {
                    throw new Error('Lo siento, estoy recibiendo demasiados mensajes a la vez. Espera un par de minutos.');
                }
                throw new Error(errText);
            }

            const data = await response.json();
            const replyText = data.reply || "Lo siento, tuve un pequeño contratiempo procesando tu solicitud.";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'sofia',
                content: replyText,
                timestamp: new Date()
            }]);

            speakMessage(replyText);

        } catch (error: any) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'sofia',
                content: error.message || "Tuvimos un error al conectar. Por favor intenta de nuevo en unos segundos.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full h-full-ios bg-[#F5F5F7] dark:bg-black p-4 pb-[85px] md:pb-4 gap-4 overflow-y-auto">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                    <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
                        <div className={`p-4 rounded-2xl ${msg.role === 'user'
                            ? 'bg-blue-500 text-white rounded-tr-sm shadow-md'
                            : 'bg-white dark:bg-[#1c1c1e] text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-[#2c2c2e]'
                            } whitespace-pre-wrap leading-relaxed text-[15px] sm:text-[16px] font-sans`}
                        >
                            {msg.content}
                        </div>
                        <span className={`text-[11px] text-gray-400 font-medium px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex justify-start animate-fade-in-up">
                    <div className="bg-white dark:bg-[#1c1c1e] p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center w-fit border border-gray-100 dark:border-gray-800">
                        <div className="w-2 h-2 bg-primavera-gold/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primavera-gold/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primavera-gold/60 rounded-full animate-bounce"></div>
                    </div>
                </div>
            )}

            {/* Float Voice Mute Button */}
            {window.speechSynthesis && (
                <button
                    onClick={() => {
                        setIsMuted(!isMuted);
                        if (!isMuted) window.speechSynthesis.cancel();
                    }}
                    className={`fixed top-[120px] sm:top-24 right-4 sm:right-6 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-800 transition-colors z-50 ${isMuted ? 'bg-red-100/90 text-red-500' : 'bg-white/90 dark:bg-black/90 text-primavera-gold'}`}
                    title={isMuted ? "Activar audio" : "Silenciar audio"}
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
            )}

            <div ref={messagesEndRef} className="h-4" />

            {/* Input Area (Sticky Bottom overlay inside container) */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-[#1c1c1e]/90 backdrop-blur-xl p-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 dark:border-white/10 flex items-center transition-all focus-within:ring-2 focus-within:ring-primavera-gold/50"
                >
                    <input
                        type="text"
                        placeholder={isAdmin ? "Solicitar reporte o dato a Sofía..." : "Escribe tu mensaje a Sofía..."}
                        className="flex-1 bg-transparent border-none px-2 sm:px-4 py-2 sm:py-3 focus:outline-none dark:text-white dark:placeholder-gray-400 placeholder-gray-500 text-[15px]"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                    />

                    {/* Voice Button */}
                    {recognitionRef.current && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all focus:outline-none ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            title="Hablar por micrófono"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={(!input.trim() && !isListening) || isTyping}
                        className="bg-black dark:bg-white text-white dark:text-black w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 ml-2 shrink-0 aspect-square"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 translate-x-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
