import React from 'react';

interface SmartCategoryProps {
    title: string;
    items: any[];
    selectedItems: any[];
    onToggleItem: (item: any, quantity: number) => void;
    guestCount: number;
}

const SmartCategory: React.FC<SmartCategoryProps> = ({ title, items, selectedItems, onToggleItem, guestCount }) => {

    // Simulate smart rule application (frontend simplified logic)
    const getSuggestedQuantity = (item: any) => {
        // Example: Waiters (rule: 1 per 15 guests)
        if (item.name.toLowerCase().includes('mesero')) return Math.ceil(guestCount / 15);
        if (item.name.toLowerCase().includes('mesa')) return Math.ceil(guestCount / 10);
        return 1;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Opcionales</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => {
                    const isSelected = selectedItems.find(i => i.item.id === item.id);
                    return (
                        <div
                            key={item.id}
                            className={`border rounded-lg p-4 transition cursor-pointer hover:shadow-md ${isSelected ? 'border-primavera-gold bg-yellow-50' : 'border-gray-200'}`}
                            onClick={() => {
                                if (isSelected) {
                                    onToggleItem(item, 0); // Remove
                                } else {
                                    onToggleItem(item, getSuggestedQuantity(item)); // Add with Smart Quantity
                                }
                            }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-gray-800">{item.name}</div>
                                <div className="text-primavera-gold font-bold">${item.price}</div>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{item.description || 'Sin descripción'}</div>

                            {isSelected && (
                                <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                    <label className="text-xs font-bold text-gray-600">Cantidad:</label>
                                    <input
                                        type="number"
                                        className="w-20 border rounded px-2 py-1 text-sm text-center font-bold"
                                        value={isSelected.quantity}
                                        onChange={(e) => onToggleItem(item, parseInt(e.target.value) || 0)}
                                    />
                                    <span className="text-xs text-gray-400">({item.unit})</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SmartCategory;
