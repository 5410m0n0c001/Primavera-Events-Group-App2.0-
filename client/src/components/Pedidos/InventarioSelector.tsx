import React, { useState, useEffect } from 'react';

interface InventarioItem {
    id: string;
    nombre: string;
    categoria: string;
    precioRenta: number;
    stockDisponible: number;
}

interface ItemSelectorProps {
    onSelect: (item: InventarioItem) => void;
    fechaEntrega: string; // YYYY-MM-DD
}

export default function InventarioSelector({ onSelect, fechaEntrega }: ItemSelectorProps) {
    const [items, setItems] = useState<InventarioItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [categoriaFIltro, setCategoriaFIltro] = useState('');

    useEffect(() => {
        // En una app real, si dependemos de la fecha, haríamos la llamada con `?date=${fechaEntrega}`
        // a `/api/inventario`. Por ahora, traeremos el catálogo completo y manejaremos disponibilidad simple
        // para efectos del UI, asumiendo lo que exponga el endpoint base.
        const fetchCatalogo = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/inventario');
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (err) {
                console.error("Error fetching inventario", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalogo();
    }, []);

    const filteredItems = items.filter(item => {
        const matchSearch = item.nombre.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoriaFIltro ? item.categoria === categoriaFIltro : true;
        return matchSearch && matchCat;
    });

    // Agrupar por categoría
    const grouped = filteredItems.reduce((acc, item) => {
        if (!acc[item.categoria]) acc[item.categoria] = [];
        acc[item.categoria].push(item);
        return acc;
    }, {} as Record<string, InventarioItem[]>);

    const categoriasUnicas = Array.from(new Set(items.map(i => i.categoria)));

    return (
        <div className="bg-gray-50 dark:bg-[#2c2c2e] p-4 rounded-xl border border-gray-200 dark:border-white/10 h-full flex flex-col overflow-hidden relative">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Catálogo de Inventario</h3>

            <input
                type="text"
                placeholder="🔍 Buscar artículo..."
                className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1c1c1e] text-black dark:text-white text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <select
                className="w-full p-2 mb-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1c1c1e] text-black dark:text-white text-sm"
                value={categoriaFIltro}
                onChange={e => setCategoriaFIltro(e.target.value)}
            >
                <option value="">Todas las categorías</option>
                {categoriasUnicas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-800">
                {loading ? (
                    <p className="text-center text-gray-500 py-4 text-sm">Cargando...</p>
                ) : Object.keys(grouped).length === 0 ? (
                    <p className="text-center text-gray-500 py-4 text-sm">No hay coincidencias</p>
                ) : (
                    Object.keys(grouped).sort().map(cat => (
                        <div key={cat} className="mb-4">
                            <h4 className="font-semibold text-primavera-gold text-xs uppercase tracking-wider mb-2 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur py-1">📂 {cat} ({grouped[cat].length})</h4>
                            <ul>
                                {grouped[cat].map(item => (
                                    <li
                                        key={item.id}
                                        onClick={() => onSelect(item)}
                                        className="flex justify-between items-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer rounded transition group"
                                    >
                                        <div className="truncate pr-2">
                                            <span className="text-gray-400 opacity-50 mr-2 group-hover:text-primavera-gold transition-colors">○</span>
                                            <span className="dark:text-gray-300">{item.nombre}</span>
                                        </div>
                                        <span className="font-medium text-green-600 dark:text-green-400 shrink-0">${item.precioRenta}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Haz clic en un artículo para agregarlo al pedido.</p>
        </div>
    );
}
