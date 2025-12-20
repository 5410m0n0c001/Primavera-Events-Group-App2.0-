import React, { useEffect, useState, useRef } from 'react';
import type { InventoryItem } from '../../types/InventoryTypes';
import * as XLSX from 'xlsx';

interface Category {
    id: string;
    name: string;
    subCategories: { id: string; name: string }[];
}

const InventoryDashboard: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'LOW_STOCK' | 'UNAVAILABLE' | 'DAMAGED'>('ALL');


    // Categories
    const [categories, setCategories] = useState<Category[]>([]);

    // Item Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', unit: 'pieza', stock: 0, price: 0, subCategoryId: '' });

    // Category Management Modal State
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [catTab, setCatTab] = useState<'category' | 'subcategory'>('category');
    const [newCatName, setNewCatName] = useState('');
    const [newSubCatName, setNewSubCatName] = useState('');
    const [scParentId, setScParentId] = useState('');

    // File Upload
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Inline Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

    useEffect(() => {
        loadData();
        loadCategories();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/inventory/availability?date=${date}`);
            const data = await res.json();
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/catalog');
            const data = await res.json();
            setCategories(data);
            // Set default subcategory if available
            if (data.length > 0 && data[0].subCategories.length > 0) {
                setNewItem(prev => ({ ...prev, subCategoryId: data[0].subCategories[0].id }));
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- Computed Data ---
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subCategoryId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' ||
            (filterStatus === 'AVAILABLE' && item.available! > 0) ||
            (filterStatus === 'UNAVAILABLE' && item.available! <= 0) ||
            (filterStatus === 'LOW_STOCK' && item.available! > 0 && item.available! < 10) ||
            (filterStatus === 'DAMAGED' && (item.stockDamaged || 0) > 0);

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
            const res = await fetch(`/api/inventory/${id}`, {
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
            await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    // --- Category Management ---
    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/catalog/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName })
            });
            if (res.ok) {
                setNewCatName('');
                loadCategories();
                alert('Categoría creada');
            }
        } catch (error) { console.error(error); }
    };

    const handleCreateSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scParentId) return alert('Selecciona una categoría padre');
        try {
            const res = await fetch('/api/catalog/subcategories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubCatName, categoryId: scParentId })
            });
            if (res.ok) {
                setNewSubCatName('');
                loadCategories();
                alert('Subcategoría creada');
            }
        } catch (error) { console.error(error); }
    };

    // --- Item Creation ---
    const handleCreateWrapper = () => {
        setIsModalOpen(true);
    };

    const submitCreate = async () => {
        if (!newItem.name || !newItem.subCategoryId) {
            alert("Nombre y Categoría son obligatorios");
            return;
        }

        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                loadData();
                setIsModalOpen(false);
                setNewItem({ name: '', unit: 'pieza', stock: 0, price: 0, subCategoryId: categories[0]?.subCategories[0]?.id || '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- Excel Import ---
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: any[] = XLSX.utils.sheet_to_json(ws);

            // Map data to expected format
            // Expected Excel columns: Name, Stock, Price, Unit, Location
            const mappedItems = data.map(row => ({
                name: row['Name'] || row['Nombre'],
                stock: row['Stock'] || 0,
                price: row['Price'] || row['Precio'] || 0,
                unit: row['Unit'] || row['Unidad'] || 'pieza',
                location: row['Location'] || row['Ubicacion']
            }));

            if (mappedItems.length > 0) {
                uploadBulkItems(mappedItems);
            }
        };
        reader.readAsBinaryString(file);
        // Reset input
        e.target.value = '';
    };

    const uploadBulkItems = async (items: any[]) => {
        try {
            const res = await fetch('/api/inventory/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(items)
            });
            if (res.ok) {
                const result = await res.json();
                alert(`Se importaron ${result.count} artículos exitosamente.`);
                loadData();
            } else {
                alert('Error al importar');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con servidor');
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
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Inventario</h1>
                <div className="flex gap-2">
                    <button onClick={handleImportClick} className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
                        📥 Importar Excel
                    </button>
                    <button onClick={() => setIsCatModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                        🏷️ Gestionar Categorías
                    </button>
                    <button onClick={exportCSV} className="px-4 py-2 border bg-white rounded shadow-sm text-gray-600 hover:bg-gray-50">Exportar CSV</button>
                    <button onClick={handleCreateWrapper} className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">+ Nuevo Artículo</button>
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
                        <option value="DAMAGED">Con Daños</option>
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
                            <th className="p-4 text-center">Total Existente</th>
                            <th className="p-4 text-center text-red-600">Mal Estado</th>
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

                                    {/* Mal Estado */}
                                    <td className="p-4 text-center text-red-600 font-medium">
                                        {isEditing ? (
                                            <input type="number" className="border rounded px-2 py-1 w-20 text-center text-red-600" value={editForm.stockDamaged || 0} onChange={e => handleEditChange('stockDamaged', e.target.value)} />
                                        ) : (item.stockDamaged || 0)}
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

            {/* Create Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Nuevo Artículo</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newItem.stock}
                                        onChange={e => setNewItem({ ...newItem, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2 mt-1"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select
                                    className="w-full border rounded px-3 py-2 mt-1"
                                    value={newItem.subCategoryId}
                                    onChange={e => setNewItem({ ...newItem, subCategoryId: e.target.value })}
                                >
                                    <option value="">Selecciona una categoría...</option>
                                    {categories.map(cat => (
                                        <optgroup key={cat.id} label={cat.name}>
                                            {cat.subCategories.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitCreate}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-bold"
                            >
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Categories Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Gestionar Categorías</h2>

                        <div className="flex gap-4 mb-4 border-b">
                            <button
                                className={`pb-2 px-1 ${catTab === 'category' ? 'border-b-2 border-purple-600 font-bold text-purple-600' : 'text-gray-500'}`}
                                onClick={() => setCatTab('category')}
                            >
                                Categorías
                            </button>
                            <button
                                className={`pb-2 px-1 ${catTab === 'subcategory' ? 'border-b-2 border-purple-600 font-bold text-purple-600' : 'text-gray-500'}`}
                                onClick={() => setCatTab('subcategory')}
                            >
                                Subcategorías
                            </button>
                        </div>

                        <div className="space-y-4">
                            {catTab === 'category' ? (
                                <form onSubmit={handleCreateCategory}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 mt-1"
                                            value={newCatName}
                                            onChange={e => setNewCatName(e.target.value)}
                                            placeholder="Ej. Mobiliario"
                                            required
                                        />
                                    </div>
                                    <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Crear Categoría</button>
                                </form>
                            ) : (
                                <form onSubmit={handleCreateSubCategory}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Categoría Padre</label>
                                        <select
                                            className="w-full border rounded px-3 py-2 mt-1"
                                            value={scParentId}
                                            onChange={e => setScParentId(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona una categoría...</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Nombre de Subcategoría</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded px-3 py-2 mt-1"
                                            value={newSubCatName}
                                            onChange={e => setNewSubCatName(e.target.value)}
                                            placeholder="Ej. Sillas Tiffany"
                                            required
                                        />
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Crear Subcategoría</button>
                                </form>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsCatModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
