import React from 'react';
import type { QuoteDraft } from '../../types';

interface Props {
    draft: QuoteDraft;
    onBack: () => void;
    onGenerate: () => void;
}

const ReviewQuote: React.FC<Props> = ({ draft, onBack, onGenerate }) => {
    const subtotal = draft.selectedItems.reduce((acc, curr) => acc + (Number(curr.item?.price || 0) * curr.quantity), 0);
    const tax = subtotal * 0.16; // IVA 16%
    const total = subtotal + tax;

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-center mb-6 text-primavera-gold">Resumen de Cotización</h2>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                        <span className="font-bold block text-gray-500">Evento:</span>
                        {draft.eventName || 'Sin nombre'}
                    </div>
                    <div>
                        <span className="font-bold block text-gray-500">Invitados:</span>
                        {draft.guestCount} pax
                    </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="pb-2">Servicio</th>
                                <th className="pb-2 text-center">Cant.</th>
                                <th className="pb-2 text-right">Precio Unit.</th>
                                <th className="pb-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {draft.selectedItems.map((item, idx) => (
                                <tr key={idx} className="py-2">
                                    <td className="py-3 pr-2">
                                        <div className="font-bold">{item.item?.name}</div>
                                        <div className="text-xs text-gray-500">{item.item?.unit}</div>
                                    </td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">${item.item?.price?.toFixed(2)}</td>
                                    <td className="py-3 text-right font-medium">${(Number(item.item?.price || 0) * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <div className="w-1/2 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>IVA (16%):</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-primavera-black pt-2 border-t border-gray-300">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                    Volver a Editar
                </button>
                <button
                    onClick={onGenerate}
                    className="px-8 py-3 bg-primavera-green text-white font-bold rounded shadow-lg hover:brightness-110 flex items-center gap-2"
                >
                    <span>📄</span> Generar PDF Formal
                </button>
            </div>
        </div>
    );
};

export default ReviewQuote;
