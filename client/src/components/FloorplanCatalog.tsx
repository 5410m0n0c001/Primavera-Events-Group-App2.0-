import React, { useState } from 'react';
import { FLOORPLAN_CATEGORIES, FloorplanElement } from '../data/floorplanElements';

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
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const filteredCategories = FLOORPLAN_CATEGORIES.map(category => ({
        ...category,
        elements: category.elements.filter(element =>
            element.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.elements.length > 0);

    return (
        <div
            className={`bg-white rounded-lg shadow-lg p-4 h-full flex flex-col transition-all duration-300 ${isExpanded ? 'w-full' : 'w-full' /* controlled by container width in parent */
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Catálogo</h2>
                <button
                    onClick={onToggleExpand}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    title={isExpanded ? "Minimizar" : "Expandir"}
                >
                    {isExpanded ? '⛔' : '➡️'}
                </button>
            </div>

            <input
                type="text"
                placeholder="🔍 Buscar elemento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredCategories.map((category) => (
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
                                    const isSelected = selectedElements.some(el => el.id === element.id);

                                    return (
                                        <div
                                            key={element.id}
                                            className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded transition-colors"
                                        >
                                            <span className="text-xs text-gray-700 font-medium">{element.name}</span>
                                            <button
                                                onClick={() => onAddElement(element)}
                                                // disabled={isSelected} // Allow adding multiple instances!
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
                ))}
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
