import React, { useEffect, useState } from 'react';
import type { InventoryItem } from '../../types/InventoryTypes';

const InventoryDashboard: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'LOW_STOCK' | 'UNAVAILABLE'>('ALL');

    // Inline Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/inventory/availability?date=${date}`);
            const data = await res.json();
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // --- Computed Data ---
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subCategoryId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' ||
            (filterStatus === 'AVAILABLE' && item.available! > 0) ||
            (filterStatus === 'UNAVAILABLE' && item.available! <= 0) ||
            (filterStatus === 'LOW_STOCK' && item.available! > 0 && item.available! < 10);
        return matchesSearch && matchesStatus;
    });

    // --- Actions ---
    const handleEditStart = (item: InventoryItem) => {
        setEditingId(item.id);
        setEditForm({ ...item, options: { ...item.options } });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleEditChange = (field: keyof InventoryItem, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (key: string, value: any) => {
        setEditForm(prev => ({
            ...prev,
            options: { ...prev.options, [key]: value }
        }));
    };

    const handleSave = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updatedItem = await res.json();
                setItems(prev => prev.map(i => i.id === id ? { ...updatedItem, available: updatedItem.stock - (i.reserved || 0), reserved: i.reserved } : i));
                setEditingId(null);
            } else {
                alert('Error al guardar cambios');
            }
        } catch (error) {
            console.error(error);
            alert('Error al guardar cambios');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este artículo?')) return;
        try {
            await fetch(`http://localhost:3000/api/inventory/${id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async () => {
        // Quick create placeholder for MVP
        const name = prompt("Nombre del nuevo artículo:");
        if (!name) return;

        try {
            const res = await fetch('http://localhost:3000/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    unit: 'pieza',
                    stock: 0,
                    price: 0,
                    subCategoryId: 'GENERIC' // Needs proper category handling in full app
                })
            });
            if (res.ok) {
                loadData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const exportCSV = () => {
        const headers = ["Nombre", "Stock", "Reservado", "Disponible", "Precio", "Ubicación"];
        const rows = filteredItems.map(i => [
            i.name,
            i.stock,
            i.reserved || 0,
            i.available || 0,
            i.price,
            i.options?.location || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "inventario.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Render Helpers ---
    const getStatusBadge = (available: number = 0) => {
        if (available <= 0) return <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700">AGOTADO</span>;
        if (available < 10) return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">BAJO STOCK</span>;
        return <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">DISPONIBLE</span>;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Inventario</h1>
                <div className="flex gap-2">
                    <button onClick={exportCSV} className="px-4 py-2 border bg-white rounded shadow-sm text-gray-600 hover:bg-gray-50">Exportar Excel</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">+ Nuevo Artículo</button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                    <input
                        type="text"
                        placeholder="Buscar artículo..."
                        className="border rounded px-3 py-2 w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={filterStatus}
                        onChange={(e: any) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Todos los estados</option>
                        <option value="AVAILABLE">Disponible</option>
                        <option value="LOW_STOCK">Bajo Stock</option>
                        <option value="UNAVAILABLE">Agotado</option>
                    </select>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Fecha:</span>
                        <input
                            type="date"
                            className="border rounded px-2 py-1"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>
                    <div className="flex border rounded overflow-hidden">
                        <button
                            className={`px-3 py-1 text-sm ${viewMode === 'compact' ? 'bg-purple-100 text-purple-700' : 'bg-white'}`}
                            onClick={() => setViewMode('compact')}
                        >
                            Compacto
                        </button>
                        <button
                            className={`px-3 py-1 text-sm ${viewMode === 'detailed' ? 'bg-purple-100 text-purple-700' : 'bg-white'}`}
                            onClick={() => setViewMode('detailed')}
                        >
                            Detallado
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Artículo</th>
                            <th className="p-4 text-center">Unidad</th>
                            <th className="p-4 text-center">Total</th>
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
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {loading ? (
                            <tr><td colSpan={10} className="p-8 text-center text-gray-500">Cargando inventario...</td></tr>
                        ) : filteredItems.map(item => {
                            const isEditing = editingId === item.id;
                            return (
                                <tr key={item.id} className={isEditing ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                                    {/* Name */}
                                    <td className="p-4 font-medium text-gray-900">
                                        {isEditing ? (
                                            <input type="text" className="border rounded px-2 py-1 w-full" value={editForm.name} onChange={e => handleEditChange('name', e.target.value)} />
                                        ) : item.name}
                                    </td>

                                    {/* Unit */}
                                    <td className="p-4 text-center text-gray-500">
                                        {isEditing ? (
                                            <input type="text" className="border rounded px-2 py-1 w-16 text-center" value={editForm.unit} onChange={e => handleEditChange('unit', e.target.value)} />
                                        ) : item.unit}
                                    </td>

                                    {/* Stock */}
                                    <td className="p-4 text-center font-bold">
                                        {isEditing ? (
                                            <input type="number" className="border rounded px-2 py-1 w-20 text-center" value={editForm.stock} onChange={e => handleEditChange('stock', e.target.value)} />
                                        ) : item.stock}
                                    </td>

                                    {/* Reserved */}
                                    <td className="p-4 text-center text-orange-600 font-medium">{item.reserved || 0}</td>

                                    {/* Available */}
                                    <td className={`p-4 text-center font-bold text-lg ${item.available! <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.available}
                                    </td>

                                    {/* Detailed Fields */}
                                    {viewMode === 'detailed' && (
                                        <>
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input type="text" placeholder="Bodega A" className="border rounded px-2 py-1 w-full" value={editForm.options?.location || ''} onChange={e => handleOptionChange('location', e.target.value)} />
                                                ) : <span className="text-gray-500">{item.options?.location || '-'}</span>}
                                            </td>
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input type="text" placeholder="10 pax" className="border rounded px-2 py-1 w-full" value={editForm.options?.capacity || ''} onChange={e => handleOptionChange('capacity', e.target.value)} />
                                                ) : <span className="text-gray-500">{item.options?.capacity || '-'}</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                {isEditing ? (
                                                    <input type="number" className="border rounded px-2 py-1 w-24 text-right" value={editForm.price} onChange={e => handleEditChange('price', e.target.value)} />
                                                ) : `$${Number(item.price).toFixed(2)}`}
                                            </td>
                                        </>
                                    )}

                                    {/* Status Badge */}
                                    <td className="p-4 text-center">
                                        {getStatusBadge(item.available)}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right space-x-2">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleSave(item.id)} className="text-green-600 hover:text-green-800 font-bold">Guardar</button>
                                                <button onClick={handleEditCancel} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditStart(item)} className="text-blue-600 hover:text-blue-800" title="Editar">✏️</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600" title="Eliminar">🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center text-gray-500 text-xs">
                Mostrando {filteredItems.length} artículos.
            </div>
        </div>
    );
};

export default InventoryDashboard;
