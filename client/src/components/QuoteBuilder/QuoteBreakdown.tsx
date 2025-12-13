import React, { useEffect, useState } from 'react';

interface QuoteBreakdownProps {
    items: { item: any, quantity: number, unitPrice?: number }[];
    onRemove: (itemId: string) => void;
    total: number;
    subtotal?: number;
    tax?: number;
    costPerPerson?: number; // Added requirement
}

const QuoteBreakdown: React.FC<QuoteBreakdownProps> = ({ items, onRemove, total, subtotal = 0, tax = 0, costPerPerson = 0 }) => {
    // Animation state for total
    const [displayTotal, setDisplayTotal] = useState(total);

    // Smooth counter animation effect
    useEffect(() => {
        const duration = 500; // ms
        const steps = 20;
        const stepTime = duration / steps;
        const start = displayTotal;
        const diff = total - start;

        if (diff === 0) return;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setDisplayTotal(start + (diff * ease));

            if (currentStep >= steps) {
                clearInterval(timer);
                setDisplayTotal(total);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [total]);

    // Group items by category
    const groupedItems: { [key: string]: any[] } = {};
    items.forEach(i => {
        const cat = i.item.category || (i.item.id.startsWith('manual') ? 'Manual/Extra' : 'General');
        if (!groupedItems[cat]) groupedItems[cat] = [];
        groupedItems[cat].push(i);
    });

    return (

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col sticky top-6 transition-all duration-300" style={{ maxHeight: 'calc(100vh - 40px)', height: 'fit-content' }}>
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold font-serif text-gray-800 flex items-center gap-2">
                    <span>📋</span> Resumen de Cotización
                </h2>
                <p className="text-xs text-gray-500 mt-1">Calculado en tiempo real</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50/30">
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <span className="text-4xl mb-2">🛒</span>
                        <p className="text-sm font-medium">Agrega servicios para comenzar</p>
                    </div>
                ) : (
                    Object.keys(groupedItems).map(category => (
                        <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{category}</h3>
                            <div className="space-y-3">
                                {groupedItems[category].map((entry, idx) => {
                                    const price = Number(entry.unitPrice) || Number(entry.item.price) || 0;
                                    const itemSubtotal = entry.quantity * price;
                                    return (
                                        <div key={idx} className="flex justify-between items-start group bg-white p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex-1 pr-2">
                                                <div className="text-sm font-semibold text-gray-800 leading-tight">{entry.item.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">{entry.quantity}</span> x ${price.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-700">${itemSubtotal.toLocaleString()}</div>
                                                <button
                                                    onClick={() => onRemove(entry.item.id)}
                                                    className="text-xs text-red-400 hover:text-red-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 w-full"
                                                >
                                                    Eliminar 🗑️
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary Footer */}
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-10">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-medium">${subtotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>IVA (16%)</span>
                        <span className="font-medium">${tax?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        <span>Costo por persona</span>
                        <span className="font-bold">${costPerPerson?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total</span>
                    <span className="text-3xl font-bold text-primavera-gold transition-all duration-300 transform">
                        ${displayTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuoteBreakdown;
