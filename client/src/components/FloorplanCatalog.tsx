import React, { useState } from 'react';
import { FLOORPLAN_CATEGORIES, FloorplanElement } from '../data/floorplanElements';

interface FloorplanCatalogProps {
    onAddElement: (element: FloorplanElement) => void;
    selectedElements: FloorplanElement[];
    onRemoveElement: (elementId: string) => void;
}

export const FloorplanCatalog: React.FC<FloorplanCatalogProps> = ({
    onAddElement,
    selectedElements,
    onRemoveElement
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
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Catálogo de Elementos</h2>

            <input
                type="text"
                placeholder="Buscar elemento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />

            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{category.emoji}</span>
                                <span className="font-semibold text-sm">{category.name}</span>
                            </div>
                            <span className="text-gray-400">
                                {expandedCategory === category.id ? '▼' : '▶'}
                            </span>
                        </button>

                        {expandedCategory === category.id && (
                            <div className="px-4 py-2 bg-gray-50 space-y-1">
                                {category.elements.map((element) => {
                                    const isSelected = selectedElements.some(el => el.id === element.id);

                                    return (
                                        <div
                                            key={element.id}
                                            className="flex items-center justify-between py-2 px-3 hover:bg-white rounded transition-colors"
                                        >
                                            <span className="text-sm">{element.name}</span>
                                            <button
                                                onClick={() => onAddElement(element)}
                                                disabled={isSelected}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${isSelected
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                            >
                                                {isSelected ? 'Agregado' : 'Agregar'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedElements.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2 text-sm">
                        Elementos Seleccionados ({selectedElements.length})
                    </h3>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                        {selectedElements.map((element) => (
                            <div
                                key={element.id}
                                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                            >
                                <span>{element.name}</span>
                                <button
                                    onClick={() => onRemoveElement(element.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
