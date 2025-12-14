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
        fetch('/api/catalog')
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
                        <div key={cat.id} className="border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1c1c1e] shadow-sm transition-all hover:shadow-md">
                            <button
                                className={`w-full text-left p-5 font-bold flex justify-between items-center transition-colors ${activeCategory === cat.id
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-[#1c1c1e] dark:text-white dark:hover:bg-[#2c2c2e]'
                                    }`}
                                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            >
                                <span className="text-lg tracking-tight">{cat.name}</span>
                                <span className="text-2xl font-light">{activeCategory === cat.id ? '−' : '+'}</span>
                            </button>

                            {activeCategory === cat.id && (
                                <div className="p-5 bg-gray-50 dark:bg-[#000000]/20 border-t border-gray-100 dark:border-white/5 space-y-8 animate-fade-in-up">
                                    {cat.subCategories.map(sub => (
                                        <div key={sub.id}>
                                            <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4 font-bold ml-1">{sub.name}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {sub.items.map(item => {
                                                    let options: any = {};
                                                    try {
                                                        options = item.options ? JSON.parse(item.options) : {};
                                                    } catch (e) { options = {}; }

                                                    return (
                                                        <div key={item.id}
                                                            className="bg-white dark:bg-[#2c2c2e] p-5 rounded-xl shadow-sm border border-black/5 dark:border-white/5 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden"
                                                            onClick={() => addItem(item)}
                                                        >
                                                            <div className="relative z-10">
                                                                <div className="font-bold text-gray-900 dark:text-white text-xl mb-2">{item.name}</div>

                                                                {/* Attribute Chips */}
                                                                <div className="mb-4 space-y-1">
                                                                    {Object.entries(options).map(([key, val]) => (
                                                                        <div key={key} className="text-xs text-gray-500 dark:text-gray-400">
                                                                            <span className="font-bold capitalize text-gray-700 dark:text-gray-300">{key}: </span>
                                                                            {Array.isArray(val) ? val.join(', ') : String(val)}
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="flex justify-between items-end mt-2">
                                                                    <div className="flex items-baseline gap-1">
                                                                        <span className="text-primavera-gold font-bold text-2xl">${item.price}</span>
                                                                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">/{item.unit}</span>
                                                                    </div>
                                                                    <button
                                                                        className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-xs font-bold hover:opacity-80 transition transform active:scale-95 shadow-lg"
                                                                        onClick={(e) => { e.stopPropagation(); addItem(item); }}
                                                                    >
                                                                        AGREGAR +
                                                                    </button>
                                                                </div>
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
