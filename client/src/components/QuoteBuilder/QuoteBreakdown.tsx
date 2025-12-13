import React from 'react';
import type { QuoteDraft } from '../../types';
import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

interface QuoteBreakdownProps {
    draft: QuoteDraft;
    onRemove: (itemId: string) => void;
}

const QuoteBreakdown: React.FC<QuoteBreakdownProps> = ({ draft, onRemove }) => {
    const { subtotal, iva, total, costPerPerson } = useQuoteCalculations(draft);

    // Formato de moneda mexicana
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    // Group items for display (Logic adapted from previous version for UI consistency)
    const groupedItems: { [key: string]: any[] } = {};
    draft.selectedItems.forEach(i => {
        const cat = i.item?.category || (i.id?.startsWith('manual') ? 'Manual/Extra' : 'General');
        if (!groupedItems[cat]) groupedItems[cat] = [];
        groupedItems[cat].push(i);
    });

    return (
        <div className="quote-breakdown sticky top-5 rounded-lg shadow-lg p-6 bg-white border border-gray-100 flex flex-col transition-all duration-300"
            style={{ height: 'fit-content', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>

            <h3 className="text-xl font-bold font-serif text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span> Resumen de Cotización
            </h3>

            {/* Empty State */}
            {draft.selectedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <span className="text-4xl mb-2">🛒</span>
                    <p className="text-sm font-medium">Agrega servicios para comenzar</p>
                </div>
            )}

            {/* List */}
            <div className="space-y-4 flex-1">
                {Object.keys(groupedItems).map(category => (
                    <div key={category} className="mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                        {groupedItems[category].map((entry, idx) => {
                            const price = Number(entry.unitPrice) || Number(entry.item?.price) || 0;
                            const itemTotal = price * entry.quantity;
                            return (
                                <div key={entry.id || idx} className="text-sm mb-2 pb-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 p-1 rounded transition-colors group relative">
                                    <div className="flex justify-between font-medium text-gray-700">
                                        <span>{entry.item?.name || 'Item'}</span>
                                        <span>{formatCurrency(itemTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-0.5">
                                        <span>{entry.quantity} x {formatCurrency(price)}</span>
                                        <button
                                            onClick={() => onRemove(entry.item?.id!)}
                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Footer Totals */}
            <div className="border-t pt-4 mt-4 space-y-2 bg-white">
                <div className="flex justify-between text-gray-600">
                    <span>Total parcial</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>IVA (16%)</span>
                    <span>{formatCurrency(iva)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primavera-gold mt-2 pt-2 border-t border-dashed">
                    <span>TOTAL</span>
                    <span>{formatCurrency(total)}</span>
                </div>
                {draft.guestCount > 0 && (
                    <div className="flex justify-between text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                        <span>Costo por persona ({draft.guestCount} pax)</span>
                        <span className="font-bold">{formatCurrency(costPerPerson)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteBreakdown;
