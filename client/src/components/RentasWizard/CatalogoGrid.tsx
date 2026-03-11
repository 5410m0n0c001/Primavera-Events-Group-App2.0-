import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types/InventoryTypes';
import { useRentasWizard } from './RentasContext';

interface CatalogoProps {
    onSearch?: (term: string) => void;
    onFilter?: (category: string) => void;
}

const mockInventory: InventoryItem[] = [
    { id: '1', name: 'Silla Tiffany Blanca', unit: 'pza', stock: 150, available: 120, price: 25.0, status: 'AVAILABLE', subCategoryId: 'Sillas' },
    { id: '2', name: 'Mesa Imperial Mármol', unit: 'pza', stock: 20, available: 5, price: 450.0, status: 'AVAILABLE', subCategoryId: 'Mesas' },
    { id: '3', name: 'Plato Trinche Oro', unit: 'pza', stock: 300, available: 200, price: 15.0, status: 'AVAILABLE', subCategoryId: 'Loza' },
    { id: '4', name: 'Silla Crossback', unit: 'pza', stock: 100, available: 0, price: 45.0, status: 'UNAVAILABLE', subCategoryId: 'Sillas' },
    { id: '5', name: 'Carpas 10x10', unit: 'pza', stock: 5, available: 2, price: 2500.0, status: 'AVAILABLE', subCategoryId: 'Estructuras' },
    { id: '6', name: 'Copa Vintage Rosa', unit: 'pza', stock: 200, available: 180, price: 18.0, status: 'AVAILABLE', subCategoryId: 'Cristalería' },
];

const CatalogoGrid: React.FC<CatalogoProps> = () => {
    const { agregarAlCarrito, carrito, actualizarCantidad, removerDelCarrito } = useRentasWizard();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Obteniendo categorías únicas
    const categories = ['All', ...Array.from(new Set(mockInventory.map(item => item.subCategoryId || 'Otros')))];

    const filteredItems = mockInventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.subCategoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getQuantityInCart = (itemId: string) => {
        const found = carrito.find(c => c.item.id === itemId);
        return found ? found.cantidad : 0;
    };

    const handleAdd = (item: InventoryItem) => {
        const inCart = getQuantityInCart(item.id);
        const available = item.available || 0;

        if (inCart < available) {
            if (inCart === 0) {
                agregarAlCarrito(item, 1);
            } else {
                actualizarCantidad(item.id, inCart + 1);
            }
        } else {
            alert('No hay suficiente stock disponible de este artículo.');
        }
    };

    const handleRemove = (item: InventoryItem) => {
        const inCart = getQuantityInCart(item.id);
        if (inCart > 1) {
            actualizarCantidad(item.id, inCart - 1);
        } else if (inCart === 1) {
            removerDelCarrito(item.id);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Cabecera del Catálogo (Search y Filtros) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-[90px] z-10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar artículos por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    <div className="flex overflow-x-auto w-full md:w-1/2 space-x-2 pb-1 hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => {
                        const inCart = getQuantityInCart(item.id);
                        const isAvailable = (item.available || 0) > 0;
                        const defaultImage = "https://images.unsplash.com/photo-1549488497-25691361250f?auto=format&fit=crop&q=80&w=400&h=300"; // Placeholder image

                        return (
                            <div key={item.id} className={`group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col ${!isAvailable ? 'opacity-60' : ''}`}>
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img src={defaultImage} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                                    {!isAvailable && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded">Agotado</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-gray-900 font-semibold text-lg leading-tight line-clamp-2">{item.name}</h4>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3 flex items-center space-x-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.subCategoryId || 'Otros'}</span>
                                        <span>•</span>
                                        <span className={isAvailable ? 'text-green-600' : 'text-red-500'}>
                                            {item.available} / {item.stock} disp.
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>

                                        {/* Controles + / - */}
                                        <div className="flex items-center space-x-2">
                                            {inCart > 0 ? (
                                                <div className="flex items-center bg-indigo-50 rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(item)}
                                                        className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 rounded-l-lg transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-semibold text-indigo-900">{inCart}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAdd(item)}
                                                        disabled={inCart >= (item.available || 0)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-r-lg transition-colors
                                                            ${inCart >= (item.available || 0) ? 'text-gray-300 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAdd(item)}
                                                    disabled={!isAvailable}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                        ${isAvailable
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    Agregar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-lg">No se encontraron artículos con esos filtros de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogoGrid;
