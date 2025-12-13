import React, { useEffect, useState } from 'react';
import type { CatalogCategory, QuoteDraft, CatalogItem } from '../../types';

interface Props {
    draft: QuoteDraft;
    setDraft: (d: QuoteDraft) => void;
    onBack: () => void;
    onNext: () => void;
}

const ServiceSelector: React.FC<Props> = ({ draft, setDraft, onBack, onNext }) => {
    const [categories, setCategories] = useState<CatalogCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        // Fetch generic catalog
        fetch('http://localhost:3000/api/catalog')
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load catalog", err);
                setLoading(false);
            });
    }, []);

    const addItem = (item: CatalogItem) => {
        const existingIndex = draft.selectedItems.findIndex(i => i.serviceItemId === item.id);
        let newItems = [...draft.selectedItems];

        if (existingIndex >= 0) {
            newItems[existingIndex].quantity += 1;
        } else {
            newItems.push({
                serviceItemId: item.id,
                quantity: 1,
                item: item // Store reference for UI display
            });
        }
        setDraft({ ...draft, selectedItems: newItems });
    };

    const removeItem = (itemId: string) => {
        const newItems = draft.selectedItems.filter(i => i.serviceItemId !== itemId);
        setDraft({ ...draft, selectedItems: newItems });
    };

    if (loading) return <div className="p-10 text-center">Cargando catálogo de servicios...</div>;

    return (
        <div className="flex gap-6 h-[600px]">
            {/* Left: Catalog Browser */}
            <div className="w-2/3 overflow-y-auto pr-2">
                <h2 className="text-xl font-bold mb-4">Catálogo de Servicios</h2>
                <div className="space-y-4">
                    {categories.map(cat => (
                        <div key={cat.id} className="border rounded-lg overflow-hidden">
                            <button
                                className={`w-full text-left p-4 font-bold flex justify-between ${activeCategory === cat.id ? 'bg-primavera-gold text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
                                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            >
                                <span>{cat.name}</span>
                                <span>{activeCategory === cat.id ? '−' : '+'}</span>
                            </button>

                            {activeCategory === cat.id && (
                                <div className="p-4 bg-white border-t space-y-6">
                                    {cat.subCategories.map(sub => (
                                        <div key={sub.id}>
                                            <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-3 font-semibold">{sub.name}</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {sub.items.map(item => {
                                                    let options: any = {};
                                                    try {
                                                        options = item.options ? JSON.parse(item.options) : {};
                                                    } catch (e) { options = {}; }

                                                    return (
                                                        <div key={item.id} className="border p-3 rounded hover:shadow-md transition flex flex-col justify-between group cursor-pointer bg-white" onClick={() => addItem(item)}>
                                                            <div>
                                                                <div className="font-bold text-gray-800 text-lg">{item.name}</div>

                                                                {/* Attribute Chips */}
                                                                <div className="mt-2 space-y-1">
                                                                    {Object.entries(options).map(([key, val]) => (
                                                                        <div key={key} className="text-xs text-gray-600">
                                                                            <span className="font-semibold capitalize">{key}: </span>
                                                                            {Array.isArray(val) ? val.join(', ') : String(val)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 flex justify-between items-center border-t pt-2">
                                                                <span className="text-primavera-gold font-bold text-lg">${item.price} <span className="text-xs text-gray-400 font-normal">/{item.unit}</span></span>
                                                                <button
                                                                    className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold hover:bg-primavera-gold hover:text-white transition uppercase tracking-wider"
                                                                    onClick={(e) => { e.stopPropagation(); addItem(item); }}
                                                                >
                                                                    Agregar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Cart/Draft */}
            <div className="w-1/3 bg-gray-50 p-4 rounded-lg flex flex-col">
                <h2 className="text-lg font-bold mb-4">Tu Selección ({draft.selectedItems.length})</h2>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {draft.selectedItems.map((quoteItem, idx) => (
                        <div key={idx} className="bg-white p-3 rounded shadow-sm border flex justify-between items-center animate-fadeIn">
                            <div>
                                <div className="font-bold text-sm">{quoteItem.item?.name || 'Item'}</div>
                                <div className="text-xs text-gray-500">x{quoteItem.quantity}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">${(Number(quoteItem.item?.price || 0) * quoteItem.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(quoteItem.serviceItemId)} className="text-red-400 hover:text-red-600">×</button>
                            </div>
                        </div>
                    ))}
                    {draft.selectedItems.length === 0 && (
                        <div className="text-center text-gray-400 py-10 italic">
                            Selecciona servicios del catálogo para armar tu cotización.
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    {/* Simple Total Est. */}
                    <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Total Est.</span>
                        <span>
                            ${draft.selectedItems.reduce((acc, curr) => acc + (Number(curr.item?.price || 0) * curr.quantity), 0).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onBack} className="w-1/3 border border-gray-300 rounded py-2 hover:bg-gray-100">Atrás</button>
                        <button onClick={onNext} className="w-2/3 bg-primavera-gold text-white rounded py-2 hover:brightness-110 font-bold">Revisar Cotización</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceSelector;
