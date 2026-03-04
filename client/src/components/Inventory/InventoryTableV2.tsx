import React, { useState, useRef, useEffect } from 'react';
import type { InventoryItem } from '../../types/InventoryTypes';

interface InventoryTableV2Props {
    items: InventoryItem[];
    loading: boolean;
    viewMode: 'compact' | 'detailed';
    editingId: string | null;
    editForm: Partial<InventoryItem>;
    onEditStart: (item: InventoryItem) => void;
    onEditCancel: () => void;
    onEditChange: (field: keyof InventoryItem, value: any) => void;
    onOptionChange: (key: string, value: any) => void;
    onSave: (id: string) => void;
    onDelete: (id: string) => void;
}

const InventoryTableV2: React.FC<InventoryTableV2Props> = ({
    items,
    loading,
    viewMode,
    editingId,
    editForm,
    onEditStart,
    onEditCancel,
    onEditChange,
    onOptionChange,
    onSave,
    onDelete
}) => {
    const [layoutStyle, setLayoutStyle] = useState<'table' | 'card'>('table');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setOpenMenuId(prev => prev === id ? null : id);
    };

    const getStatusBadge = (available: number = 0) => {
        if (available <= 0) return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">AGOTADO</span>;
        if (available < 10) return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">BAJO STOCK</span>;
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm">DISPONIBLE</span>;
    };

    // Card View
    if (layoutStyle === 'card') {
        return (
            <div className="space-y-4">
                <div className="flex justify-end mb-4">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setLayoutStyle('table')} className="px-4 py-1.5 rounded-md text-sm font-bold text-gray-500 hover:text-gray-700">Tabla</button>
                        <button className="px-4 py-1.5 rounded-md text-sm font-bold bg-white shadow text-purple-600">Tarjetas</button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">Cargando inventario...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => {
                            const isEditing = editingId === item.id;
                            return (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 pr-8">
                                            {isEditing ? (
                                                <input type="text" className="border rounded px-2 py-1 w-full font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none" value={editForm.name} onChange={e => onEditChange('name', e.target.value)} />
                                            ) : (
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">{item.name}</h3>
                                            )}
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            {!isEditing && (
                                                <div className="relative" ref={openMenuId === item.id ? menuRef : null}>
                                                    <button onClick={(e) => toggleMenu(e, item.id)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                    {openMenuId === item.id && (
                                                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 origin-top-right animate-fade-in">
                                                            <button onClick={() => { onEditStart(item); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">✏️ Editar</button>
                                                            <button onClick={() => { onDelete(item.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">🗑️ Eliminar</button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Unidad</span>
                                            {isEditing ? (
                                                <input type="text" className="border rounded px-2 py-1 w-20 text-right" value={editForm.unit} onChange={e => onEditChange('unit', e.target.value)} />
                                            ) : <span className="font-medium">{item.unit}</span>}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Total Existente</span>
                                            {isEditing ? (
                                                <input type="number" className="border rounded px-2 py-1 w-20 text-right" value={editForm.stock} onChange={e => onEditChange('stock', e.target.value)} />
                                            ) : <span className="font-bold">{item.stock}</span>}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Mal Estado</span>
                                            {isEditing ? (
                                                <input type="number" className="border rounded px-2 py-1 w-20 text-right text-red-600" value={editForm.stockDamaged || 0} onChange={e => onEditChange('stockDamaged', e.target.value)} />
                                            ) : <span className="font-medium text-red-600">{item.stockDamaged || 0}</span>}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Reservado</span>
                                            <span className="font-medium text-orange-600">{item.reserved || 0}</span>
                                        </div>

                                        {viewMode === 'detailed' && (
                                            <>
                                                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                                                    <span className="text-gray-500">Precio</span>
                                                    {isEditing ? (
                                                        <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={editForm.price} onChange={e => onEditChange('price', e.target.value)} />
                                                    ) : <span className="font-medium text-blue-700">${Number(item.price).toFixed(2)}</span>}
                                                </div>
                                                <div className="flex flex-col gap-1 text-sm pt-2 border-t border-gray-50">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400 text-xs">Ubicación</span>
                                                        {isEditing ? (
                                                            <input type="text" placeholder="Bodega A" className="border rounded px-2 py-1 text-right text-xs" value={editForm.options?.location || ''} onChange={e => onOptionChange('location', e.target.value)} />
                                                        ) : <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.options?.location || '-'}</span>}
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400 text-xs">Capacidad</span>
                                                        {isEditing ? (
                                                            <input type="text" placeholder="10 pax" className="border rounded px-2 py-1 text-right text-xs" value={editForm.options?.capacity || ''} onChange={e => onOptionChange('capacity', e.target.value)} />
                                                        ) : <span className="text-gray-600 text-xs truncate max-w-[120px]">{item.options?.capacity || '-'}</span>}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Disponible</span>
                                            <span className={`font-black text-2xl ${item.available! <= 0 ? 'text-red-600' : 'text-green-600'}`}>{item.available}</span>
                                        </div>

                                        {isEditing ? (
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => onSave(item.id)} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-sm hover:bg-green-600">Guardar</button>
                                                <button onClick={onEditCancel} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded shadow-sm hover:bg-gray-300">Cancelar</button>
                                            </div>
                                        ) : (
                                            <div>{getStatusBadge(item.available)}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="mt-6 text-center text-gray-500 text-sm font-medium">
                    Mostrando {items.length} artículos en vista tarjetas.
                </div>
            </div>
        );
    }

    // Default Table View
    return (
        <div className="space-y-4">
            <div className="flex justify-end mb-4">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button className="px-4 py-1.5 rounded-md text-sm font-bold bg-white shadow text-purple-600">Tabla</button>
                    <button onClick={() => setLayoutStyle('card')} className="px-4 py-1.5 rounded-md text-sm font-bold text-gray-500 hover:text-gray-700">Tarjetas</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-gray-50/80 backdrop-blur-sm text-gray-500 font-bold uppercase text-[11px] tracking-wider border-b border-gray-200">
                            <tr>
                                {/* Sticky Title Column */}
                                <th className="p-4 sticky left-0 bg-gray-50/95 z-10 shadow-[1px_0_0_0_#e5e7eb]">Artículo</th>
                                <th className="p-4 text-center">Unidad</th>
                                <th className="p-4 text-center">Total Existente</th>
                                <th className="p-4 text-center text-red-500">Mal Estado</th>
                                <th className="p-4 text-center">Reservado</th>
                                <th className="p-4 text-center">Disponible</th>
                                {viewMode === 'detailed' && (
                                    <>
                                        <th className="p-4">Ubicación</th>
                                        <th className="p-4">Capacidad</th>
                                        <th className="p-4 text-right">Precio</th>
                                    </>
                                )}
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-center sticky right-0 bg-gray-50/95 z-10 shadow-[-1px_0_0_0_#e5e7eb] w-16">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={10} className="p-8 text-center text-gray-500">Cargando inventario...</td></tr>
                            ) : items.map((item) => {
                                const isEditing = editingId === item.id;
                                return (
                                    <tr key={item.id} className={`${isEditing ? 'bg-purple-50/50' : 'hover:bg-gray-50'} transition-colors group`}>
                                        {/* Name - Sticky */}
                                        <td className="p-4 font-bold text-gray-900 sticky left-0 z-10 shadow-[1px_0_0_0_#f3f4f6] group-hover:shadow-[1px_0_0_0_#f3f4f6]" style={{ backgroundColor: isEditing ? 'rgba(243,232,255,1)' : 'white' }}>
                                            <div className="absolute inset-0 group-hover:bg-gray-50 pointer-events-none -z-10" />
                                            {isEditing ? (
                                                <input type="text" className="border rounded px-2 py-1.5 w-full md:w-48 font-normal text-sm focus:ring-2 focus:ring-purple-500 outline-none" value={editForm.name} onChange={e => onEditChange('name', e.target.value)} />
                                            ) : (
                                                <div className="w-48 xl:w-64 truncate" title={item.name}>{item.name}</div>
                                            )}
                                        </td>

                                        {/* Unit */}
                                        <td className="p-4 text-center text-gray-500">
                                            {isEditing ? (
                                                <input type="text" className="border rounded px-2 py-1 w-16 text-center" value={editForm.unit} onChange={e => onEditChange('unit', e.target.value)} />
                                            ) : item.unit}
                                        </td>

                                        {/* Stock */}
                                        <td className="p-4 text-center font-bold text-gray-700">
                                            {isEditing ? (
                                                <input type="number" className="border rounded px-2 py-1 w-20 text-center" value={editForm.stock} onChange={e => onEditChange('stock', e.target.value)} />
                                            ) : item.stock}
                                        </td>

                                        {/* Mal Estado */}
                                        <td className="p-4 text-center text-red-500 font-medium bg-red-50/30">
                                            {isEditing ? (
                                                <input type="number" className="border rounded px-2 py-1 w-20 text-center text-red-600" value={editForm.stockDamaged || 0} onChange={e => onEditChange('stockDamaged', e.target.value)} />
                                            ) : (item.stockDamaged || 0)}
                                        </td>

                                        {/* Reserved */}
                                        <td className="p-4 text-center text-orange-500 font-medium">{item.reserved || 0}</td>

                                        {/* Available */}
                                        <td className={`p-4 text-center font-black text-lg ${item.available! <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {item.available}
                                        </td>

                                        {/* Detailed Fields */}
                                        {viewMode === 'detailed' && (
                                            <>
                                                <td className="p-4 text-gray-600">
                                                    {isEditing ? (
                                                        <input type="text" placeholder="Bodega A" className="border rounded px-2 py-1 w-28 text-sm" value={editForm.options?.location || ''} onChange={e => onOptionChange('location', e.target.value)} />
                                                    ) : <span className="truncate max-w-[120px] block" title={item.options?.location}>{item.options?.location || '-'}</span>}
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {isEditing ? (
                                                        <input type="text" placeholder="10 pax" className="border rounded px-2 py-1 w-24 text-sm" value={editForm.options?.capacity || ''} onChange={e => onOptionChange('capacity', e.target.value)} />
                                                    ) : <span className="truncate max-w-[120px] block" title={item.options?.capacity}>{item.options?.capacity || '-'}</span>}
                                                </td>
                                                <td className="p-4 text-right text-blue-700 font-medium">
                                                    {isEditing ? (
                                                        <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={editForm.price} onChange={e => onEditChange('price', e.target.value)} />
                                                    ) : `$${Number(item.price).toFixed(2)}`}
                                                </td>
                                            </>
                                        )}

                                        {/* Status Badge */}
                                        <td className="p-4 text-center">
                                            {getStatusBadge(item.available)}
                                        </td>

                                        {/* Actions - Sticky Right with Kebab Menu */}
                                        <td className="p-4 text-center sticky right-0 z-10 shadow-[-1px_0_0_0_#f3f4f6] group-hover:shadow-[-1px_0_0_0_#f3f4f6]" style={{ backgroundColor: isEditing ? 'rgba(243,232,255,1)' : 'white' }}>
                                            <div className="absolute inset-0 group-hover:bg-gray-50 pointer-events-none -z-10" />
                                            {isEditing ? (
                                                <div className="flex flex-col gap-1 items-center">
                                                    <button onClick={() => onSave(item.id)} className="text-green-600 hover:text-green-800 font-bold bg-green-50 px-2 py-1 rounded text-xs w-full">Guardar</button>
                                                    <button onClick={onEditCancel} className="text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs w-full">Cancelar</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center relative" ref={openMenuId === item.id ? menuRef : null}>
                                                    <button
                                                        onClick={(e) => toggleMenu(e, item.id)}
                                                        className={`p-1.5 rounded-md transition-colors ${openMenuId === item.id ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>

                                                    {openMenuId === item.id && (
                                                        <div className="absolute right-8 top-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] py-1 animate-fade-in text-left">
                                                            <button onClick={() => { onEditStart(item); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium">✏️ Editar</button>
                                                            <button onClick={() => { onDelete(item.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">🗑️ Eliminar</button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-gray-500 text-sm font-medium">
                Mostrando <span className="text-gray-900 font-bold">{items.length}</span> artículos en total.
            </div>
        </div>
    );
};

export default InventoryTableV2;
