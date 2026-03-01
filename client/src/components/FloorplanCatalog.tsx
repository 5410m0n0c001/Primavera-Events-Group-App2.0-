import React, { useState, useEffect } from 'react';
import type { FloorplanElement, ElementCategory } from '../data/floorplanElements';

interface FloorplanCatalogProps {
    onAddElement: (element: FloorplanElement) => void;
    selectedElements: FloorplanElement[];
    onRemoveElement: (elementId: string) => void;
    onClearAll: () => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export const FloorplanCatalog: React.FC<FloorplanCatalogProps> = ({
    onAddElement,
    selectedElements,
    onRemoveElement,
    onClearAll,
    isExpanded,
    onToggleExpand
}) => {
    const [categories, setCategories] = useState<ElementCategory[]>([]);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Management State
    const [showManage, setShowManage] = useState(false);
    const [manageTab, setManageTab] = useState<'category' | 'element'>('element');

    // New Category Form
    const [newCatName, setNewCatName] = useState('');
    const [newCatEmoji, setNewCatEmoji] = useState('📦');

    // New Element Form
    const [newElName, setNewElName] = useState('');
    const [newElCatId, setNewElCatId] = useState('');
    const [newElWidth, setNewElWidth] = useState(100);
    const [newElHeight, setNewElHeight] = useState(100);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/production/categories');
            if (res.ok) {
                const data = await res.json();
                // Map API response to match interface (categoryId -> category)
                const mappedData = data.map((cat: any) => ({
                    ...cat,
                    elements: cat.elements.map((el: any) => ({
                        ...el,
                        category: el.categoryId,
                        width: el.width || 100,
                        height: el.height || 100
                    }))
                }));
                setCategories(mappedData);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error loading floorplan categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/production/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName, emoji: newCatEmoji })
            });
            if (res.ok) {
                setNewCatName('');
                setNewCatEmoji('📦');
                setShowManage(false);
                fetchCategories();
            }
        } catch (error) { console.error(error); }
    };

    const handleCreateElement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/production/elements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newElName,
                    categoryId: newElCatId,
                    width: Number(newElWidth),
                    height: Number(newElHeight)
                })
            });
            if (res.ok) {
                setNewElName('');
                setNewElWidth(100);
                setShowManage(false);
                fetchCategories();
            }
        } catch (error) { console.error(error); }
    };

    const filteredCategories = categories.map(category => ({
        ...category,
        elements: category.elements.filter(element =>
            element.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.elements.length > 0);

    return (
        <div
            className={`bg-white rounded-lg shadow-lg p-4 h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-full' : 'w-full'}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Catálogo</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowManage(!showManage)}
                        className={`p-2 rounded-lg transition-colors ${showManage ? 'bg-primavera-gold text-white' : 'hover:bg-gray-100 text-gray-500'}`}
                        title="Gestionar Catálogo"
                    >
                        ⚙️
                    </button>
                    <button
                        onClick={onToggleExpand}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                        title={isExpanded ? "Minimizar" : "Expandir"}
                    >
                        {isExpanded ? '⛔' : '➡️'}
                    </button>
                </div>
            </div>

            {/* Management Form Area */}
            {showManage && (
                <div className="mb-4 bg-gray-50 p-3 rounded border border-primavera-gold/30">
                    <div className="flex gap-2 mb-3 border-b border-gray-200 pb-2">
                        <button
                            onClick={() => setManageTab('element')}
                            className={`text-xs font-bold px-3 py-1 rounded ${manageTab === 'element' ? 'bg-white shadow text-primavera-gold' : 'text-gray-500'}`}
                        >
                            Nuevo Elemento
                        </button>
                        <button
                            onClick={() => setManageTab('category')}
                            className={`text-xs font-bold px-3 py-1 rounded ${manageTab === 'category' ? 'bg-white shadow text-primavera-gold' : 'text-gray-500'}`}
                        >
                            Nueva Categoría
                        </button>
                    </div>

                    {manageTab === 'element' ? (
                        <form onSubmit={handleCreateElement} className="space-y-2">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Categoría</label>
                                <select
                                    className="w-full text-sm border p-1 rounded"
                                    value={newElCatId}
                                    onChange={e => setNewElCatId(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Nombre</label>
                                <input className="w-full text-sm border p-1 rounded" value={newElName} onChange={e => setNewElName(e.target.value)} placeholder="Ej. Mesa Hexagonal" required />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1/2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-400">Ancho (px)</label>
                                    <input type="number" className="w-full text-sm border p-1 rounded" value={newElWidth} onChange={e => setNewElWidth(Number(e.target.value))} required />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-[10px] uppercase font-bold text-gray-400">Alto (px)</label>
                                    <input type="number" className="w-full text-sm border p-1 rounded" value={newElHeight} onChange={e => setNewElHeight(Number(e.target.value))} required />
                                </div>
                            </div>
                            <button className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700">Crear Elemento</button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateCategory} className="space-y-2">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Nombre Categoría</label>
                                <input className="w-full text-sm border p-1 rounded" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Ej. ZONA GAMER" required />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400">Emoji / Icono</label>
                                <input className="w-full text-sm border p-1 rounded" value={newCatEmoji} onChange={e => setNewCatEmoji(e.target.value)} placeholder="🎮" />
                            </div>
                            <button className="w-full bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700">Crear Categoría</button>
                        </form>
                    )}
                </div>
            )}

            <input
                type="text"
                placeholder="🔍 Buscar elemento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-center py-4 text-gray-500">Cargando catálogo...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No se encontraron elementos</div>
                ) : (
                    filteredCategories.map((category) => (
                        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{category.emoji}</span>
                                    <span className="font-semibold text-xs text-gray-700 uppercase tracking-wide text-left">{category.name}</span>
                                </div>
                                <span className="text-gray-400 text-xs">
                                    {expandedCategory === category.id ? '▼' : '▶'}
                                </span>
                            </button>

                            {expandedCategory === category.id && (
                                <div className="px-3 py-2 bg-white space-y-1">
                                    {category.elements.map((element) => {
                                        return (
                                            <div
                                                key={element.id}
                                                className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded transition-colors"
                                            >
                                                <span className="text-xs text-gray-700 font-medium">{element.name}</span>
                                                <button
                                                    onClick={() => onAddElement(element)}
                                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md active:scale-95'
                                                        }`}
                                                >
                                                    + AGREGAR
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest">
                        Seleccionados
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {selectedElements.length}
                        </span>
                        <button
                            onClick={onClearAll}
                            disabled={selectedElements.length === 0}
                            className="text-red-500 hover:text-red-600 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar todos los elementos"
                        >
                            LIMPIAR TODO
                        </button>
                    </div>
                </div>
                {selectedElements.length > 0 && (
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                        {selectedElements.slice().reverse().map((element, idx) => ( // Show newest first
                            <div
                                key={`${element.id}-${idx}`}
                                className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded border border-gray-100 group"
                            >
                                <span className="text-gray-600 text-xs truncate flex-1 mr-2">{element.name}</span>
                                <button
                                    onClick={() => onRemoveElement(element.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Eliminar elemento"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
