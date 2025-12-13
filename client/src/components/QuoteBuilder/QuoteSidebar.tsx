import React from 'react';

interface QuoteSidebarProps {
    subtotal: number;
    tax: number;
    total: number;
    guestCount: number;
    budget: number;
    onShowBreakdown: () => void;
}

const QuoteSidebar: React.FC<QuoteSidebarProps> = ({ subtotal, tax, total, guestCount, budget, onShowBreakdown }) => {
    const pricePerPerson = guestCount > 0 ? total / guestCount : 0;
    const items = [
        { label: 'Total parcial', value: subtotal },
        { label: 'IVA (16%)', value: tax },
        { label: 'Total', value: total, bold: true, size: 'text-3xl' }
    ];

    const budgetPercent = budget > 0 ? (total / budget) * 100 : 0;
    const progressColor = budgetPercent > 100 ? 'bg-red-500' : 'bg-green-500';

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">Resumen Estimado</h3>

            <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                        <span className={`text-gray-600 ${item.bold ? 'font-bold text-lg' : 'text-sm'}`}>{item.label}</span>
                        <span className={`font-medium ${item.bold ? 'font-bold text-primavera-gold' : 'text-gray-800'} ${item.size || ''}`}>
                            ${item.value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-100 mb-6 bg-gray-50 -mx-6 px-6 py-4">
                <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-500 font-medium">Costo por persona</span>
                    <span className="font-bold text-gray-700 text-lg">${pricePerPerson.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            {budget > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Presupuesto: ${budget.toLocaleString()}</span>
                        <span>{Math.round(budgetPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full ${progressColor} transition-all duration-500`}
                            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                        ></div>
                    </div>
                    {budgetPercent > 100 && (
                        <p className="text-xs text-red-500 mt-1 font-bold">⚠️ Presupuesto excedido</p>
                    )}
                </div>
            )}

            <button
                onClick={onShowBreakdown}
                className="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition shadow-lg text-sm uppercase tracking-wide"
            >
                Ver Desglose Completo
            </button>
        </div>
    );
};

export default QuoteSidebar;
