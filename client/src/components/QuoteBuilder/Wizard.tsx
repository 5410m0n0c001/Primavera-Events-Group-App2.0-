import React, { useState, useMemo } from 'react';
import type { QuoteDraft } from '../../types';

import SmartCategory from './SmartCategory';
import ManualItemForm from './ManualItemForm';
import QuoteBreakdown from './QuoteBreakdown';

// Mock Data for MVP - Replace with API calls
const DATA_CATEGORIES = [
    {
        id: 'cat_locations', title: 'Locaciones y Espacios', items: [
            { id: 'loc_1', name: 'Salón Principal', price: 15000, unit: 'renta', description: 'Capacidad 200 pax', category: 'Locaciones' },
            { id: 'loc_2', name: 'Jardín Exterior', price: 12000, unit: 'renta', description: 'Capacidad 300 pax', category: 'Locaciones' }
        ]
    },
    {
        id: 'cat_menu', title: 'Menú y Catering', items: [
            { id: 'menu_1', name: 'Menú 3 Tiempos', price: 450, unit: 'persona', description: 'Entrada, plato fuerte, postre', category: 'Catering' },
            { id: 'menu_2', name: 'Taquiza Premium', price: 280, unit: 'persona', description: '5 guisados a elegir', category: 'Catering' }
        ]
    },
    {
        id: 'cat_furniture', title: 'Mobiliario', items: [
            { id: 'fur_1', name: 'Mesa Redonda 10 pax', price: 350, unit: 'pza', description: 'Incluye mantel blanco', category: 'Mobiliario' },
            { id: 'fur_2', name: 'Silla Tiffany Dorada', price: 45, unit: 'pza', description: 'Con cojín', category: 'Mobiliario' },
            { id: 'fur_3', name: 'Sala Lounge', price: 1200, unit: 'set', description: 'Para 8 personas', category: 'Mobiliario' }
        ]
    },
    {
        id: 'cat_staff', title: 'Personal', items: [
            { id: 'stf_1', name: 'Mesero', price: 800, unit: 'turno', description: '1 por cada 15 invitados', category: 'Personal' },
            { id: 'stf_2', name: 'Bartender', price: 950, unit: 'turno', description: '1 por cada 50 invitados', category: 'Personal' },
            { id: 'stf_3', name: 'Coordinador de Evento', price: 3500, unit: 'evento', description: 'Gestión completa', category: 'Personal' }
        ]
    },
    {
        id: 'cat_drinks', title: 'Bebidas y Barras', items: [
            { id: 'drk_1', name: 'Barra Libre Nacional', price: 250, unit: 'persona', description: '4 horas', category: 'Bebidas' },
            { id: 'drk_2', name: 'Refrescos y Hielo', price: 45, unit: 'persona', description: 'Ilimitado', category: 'Bebidas' }
        ]
    },
    {
        id: 'cat_decor', title: 'Decoración', items: [
            { id: 'dec_1', name: 'Centro de Mesa Floral', price: 650, unit: 'pza', description: 'Flor de temporada', category: 'Decoración' },
            { id: 'dec_2', name: 'Iluminación Arquitectónica', price: 4500, unit: 'paquete', description: '10 luces LED', category: 'Decoración' }
        ]
    },
    {
        id: 'cat_music', title: 'Entretenimiento', items: [
            { id: 'mus_1', name: 'DJ Profesional', price: 8500, unit: 'evento', description: '5 horas + equipo', category: 'Entretenimiento' },
            { id: 'mus_2', name: 'Grupo Versátil', price: 18000, unit: 'evento', description: '3 sets de 45 min', category: 'Entretenimiento' }
        ]
    },
    {
        id: 'cat_photo', title: 'Fotografía y Video', items: [
            { id: 'pho_1', name: 'Paquete Foto Boda', price: 12000, unit: 'paquete', description: 'Cobertura 8 horas', category: 'Foto/Video' },
            { id: 'pho_2', name: 'Video Highlights', price: 8000, unit: 'paquete', description: 'Video 5 min', category: 'Foto/Video' }
        ]
    },
    {
        id: 'cat_extras', title: 'Extras y Servicios', items: [
            { id: 'ext_1', name: 'Pastel de Boda', price: 3500, unit: 'pieza', description: 'Para 100 personas', category: 'Extras' },
            { id: 'ext_2', name: 'Mesa de Dulces', price: 4500, unit: 'servicio', description: 'Variedad de enchilados y dulces', category: 'Extras' },
            { id: 'ext_3', name: 'Invitaciones Impresas', price: 45, unit: 'pza', description: 'Diseño personalizado', category: 'Extras' }
        ]
    }
];

import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

const QuoteWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<QuoteDraft>({
        eventName: '',
        guestCount: 100,
        date: '',
        selectedItems: [] // { item: any, quantity: number }
    });
    const [budget, setBudget] = useState(0);
    const [showManualForm, setShowManualForm] = useState(false);

    // Use the centralized calculation hook
    const totals = useQuoteCalculations(draft);

    // Capacity Validation
    const selectedLocation = draft.selectedItems.find(i => i.item?.category === 'Locaciones');
    const locationCapacity = selectedLocation ? (selectedLocation.item?.description?.match(/\d+/)?.[0] ? parseInt(selectedLocation.item.description.match(/\d+/)[0]) : 0) : 0;
    const isOverCapacity = locationCapacity > 0 && draft.guestCount > locationCapacity;

    const handleToggleItem = (item: any, quantity: number) => {
        setDraft(prev => {
            const existing = prev.selectedItems.find(i => i.item?.id === item.id);
            if (quantity <= 0) {
                return { ...prev, selectedItems: prev.selectedItems.filter(i => i.item?.id !== item.id) };
            }
            if (existing) {
                return { ...prev, selectedItems: prev.selectedItems.map(i => i.item?.id === item.id ? { ...i, quantity } : i) };
            }
            // Ensure strictly typed and structured QuoteItem
            const newItem = {
                item,
                quantity,
                id: `qi_${Date.now()}_${item.id}`,
                quoteId: 'temp',
                serviceItemId: item.id || 'manual',
                serviceItem: item,
                unitPrice: Number(item.price) || 0,
                cost: (Number(item.price) || 0) * quantity
            };
            return { ...prev, selectedItems: [...prev.selectedItems, newItem as any] };
        });
    };

    const handleAddManualItem = (newItem: any) => {
        handleToggleItem(newItem, 1);
    };

    const handleRemoveItem = (itemId: string) => {
        setDraft(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.filter(i => i.item?.id !== itemId)
        }));
    };

    const handleFinalize = async () => {
        try {
            // Hybrid Validation: Validate with backend before showing final summary
            const response = await fetch('/api/quotes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: draft.selectedItems,
                    guestCount: draft.guestCount
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid && data.items) {
                    // Update draft with validated items (source of truth)
                    // This updates unitPrices if backend applies rules/corrections
                    setDraft(prev => ({ ...prev, selectedItems: data.items }));
                }
            }
        } catch (e) {
            console.error("Validation warning:", e);
        }
        setStep(3);
    };

    const handleGeneratePDF = async () => {
        const payload = {
            eventName: draft.eventName,
            guestCount: draft.guestCount,
            date: draft.date,
            items: draft.selectedItems.map(i => ({
                name: i.item?.name || 'Item',
                quantity: i.quantity,
                price: Number(i.unitPrice || i.item?.price || 0),
                unit: i.item?.unit || 'pz'
            })),
            totals // Include calculated totals
        };
        try {
            const response = await fetch('/api/quotes/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion-${draft.eventName}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 relative">

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-primavera-gold font-bold mb-2 break-words">
                        Nueva Cotización Inteligente
                    </h1>
                    <p className="text-gray-500">Diseña el evento perfecto con cálculos automáticos.</p>
                </div>

                {/* Progress */}
                <div className="flex gap-4 mb-8 text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-4 overflow-x-auto">
                    <span className={step === 1 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>1. Evento</span>
                    <span className={step === 2 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>2. Servicios</span>
                    <span className={step === 3 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>3. Finalizar</span>
                </div>

                {step === 1 && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-primavera-gold focus:border-transparent outline-none transition"
                                    placeholder="e.j. Boda Juan y Maria"
                                    value={draft.eventName}
                                    onChange={e => setDraft({ ...draft, eventName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Tentativa</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    value={draft.date}
                                    onChange={e => setDraft({ ...draft, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Número de Invitados</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border font-bold text-lg"
                                    value={draft.guestCount}
                                    onChange={e => setDraft({ ...draft, guestCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Presupuesto Objetivo (Opcional)</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    placeholder="$0.00"
                                    value={budget}
                                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setStep(2)} className="w-full md:w-auto bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Siguiente: Seleccionar Servicios →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="w-full md:w-auto bg-white border border-primavera-gold text-primavera-gold px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 transition flex items-center justify-center gap-2"
                            >
                                + Agregar Elemento Manual
                            </button>
                        </div>

                        {DATA_CATEGORIES.map(cat => (
                            <SmartCategory
                                key={cat.id}
                                title={cat.title}
                                items={cat.items}
                                selectedItems={draft.selectedItems}
                                onToggleItem={handleToggleItem}
                                guestCount={draft.guestCount}
                            />
                        ))}
                        <div className="flex flex-col-reverse md:flex-row justify-between pt-6 gap-4">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium py-2">
                                ← Volver
                            </button>
                            <button onClick={handleFinalize} className="bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Ver Resumen Final →
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="mb-6">
                            <span className="text-6xl">🎉</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">¡Cotización Lista!</h2>
                        <p className="text-gray-600 mb-8">Has configurado un evento para {draft.guestCount} personas.</p>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button onClick={handleGeneratePDF} className="bg-primavera-gold text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition flex items-center justify-center gap-2">
                                <span>📄</span> Descargar PDF Profesional
                            </button>
                            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                                Guardar Borrador
                            </button>
                        </div>
                        <button onClick={() => setStep(2)} className="mt-6 text-gray-500 underline text-sm">
                            Volver a editar
                        </button>
                    </div>
                )}

            </div>

            {/* Sidebar Calculator - Replaced by Breakdown Panel */}
            <div className="w-full md:w-96 flex-shrink-0 relative order-first md:order-last">
                <div className="sticky top-6">
                    <QuoteBreakdown
                        draft={draft}
                        onRemove={handleRemoveItem}
                    />

                    {isOverCapacity && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <strong>Capacidad Excedida</strong>
                                <p>La locación seleccionada ({selectedLocation?.item?.name}) soporta {locationCapacity} pax, pero tienes {draft.guestCount} invitados.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showManualForm && (
                <ManualItemForm
                    onSave={handleAddManualItem}
                    onClose={() => setShowManualForm(false)}
                />
            )}



        </div>
    );
};

export default QuoteWizard;
