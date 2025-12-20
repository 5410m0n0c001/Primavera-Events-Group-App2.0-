import React, { useEffect, useState } from 'react';

// Types
interface Ingredient {
    id: string;
    name: string;
    unit: string;
    costPerUnit: number;
    stock: number;
}

interface Dish {
    id: string;
    name: string;
    description?: string;
    price: number;
    cost: number;
}

interface Menu {
    id: string;
    name: string;
    description?: string;
    dishes: Dish[];
}

const CateringDashboard: React.FC = () => {
    const [view, setView] = useState<'ingredients' | 'dishes' | 'menus'>('ingredients');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [_loading, setLoading] = useState(true);

    // Form States
    const [newIngName, setNewIngName] = useState('');
    const [newIngUnit, setNewIngUnit] = useState('kg');
    const [newIngCost, setNewIngCost] = useState('');

    // Dish Form State
    const [showDishForm, setShowDishForm] = useState(false);
    const [editingDishId, setEditingDishId] = useState<string | null>(null);
    const [dishName, setDishName] = useState('');
    const [dishPrice, setDishPrice] = useState('');
    const [dishDescription, setDishDescription] = useState('');

    // Menu Form State
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
    const [menuName, setMenuName] = useState('');
    const [menuDescription, setMenuDescription] = useState('');

    // Ingredient Edit State
    const [editingIngId, setEditingIngId] = useState<string | null>(null);
    const [editIngName, setEditIngName] = useState('');
    const [editIngUnit, setEditIngUnit] = useState('kg');
    const [editIngCost, setEditIngCost] = useState('');


    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/catering/ingredients');
            if (res.ok) setIngredients(await res.json());

            const res2 = await fetch('/api/catering/dishes');
            if (res2.ok) setDishes(await res2.json());

            const res3 = await fetch('/api/catering/menus');
            if (res3.ok) setMenus(await res3.json());
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    // --- INGREDIENTS CRUD ---

    const createIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/catering/ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newIngName, unit: newIngUnit, costPerUnit: newIngCost, stock: 0 })
            });
            setNewIngName(''); setNewIngCost(''); loadData();
        } catch (error) { console.error(error); }
    };

    const startEditIngredient = (ing: Ingredient) => {
        setEditingIngId(ing.id);
        setEditIngName(ing.name);
        setEditIngUnit(ing.unit);
        setEditIngCost(ing.costPerUnit.toString());
    };

    const updateIngredient = async () => {
        if (!editingIngId) return;
        try {
            await fetch(`/api/catering/ingredients/${editingIngId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editIngName,
                    unit: editIngUnit,
                    costPerUnit: editIngCost,
                    stock: 0 // keeping stock 0 for now as per simple req
                })
            });
            setEditingIngId(null);
            loadData();
        } catch (error) { console.error(error); }
    };

    const deleteIngredient = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar este ingrediente?')) return;
        try {
            await fetch(`/api/catering/ingredients/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) { console.error(error); }
    };

    // --- DISHES CRUD ---

    const openDishForm = (dish?: Dish) => {
        if (dish) {
            setEditingDishId(dish.id);
            setDishName(dish.name);
            setDishPrice(dish.price.toString());
            setDishDescription(dish.description || '');
        } else {
            setEditingDishId(null);
            setDishName('');
            setDishPrice('');
            setDishDescription('');
        }
        setShowDishForm(true);
    };

    const saveDish = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: dishName,
            description: dishDescription,
            price: dishPrice,
            recipeItems: [] // Future: Add recipe builder
        };

        try {
            if (editingDishId) {
                await fetch(`/api/catering/dishes/${editingDishId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/catering/dishes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            setShowDishForm(false);
            loadData();
        } catch (error) { console.error(error); }
    };

    const deleteDish = async (id: string) => {
        if (!confirm('¿Eliminar platillo?')) return;
        try {
            await fetch(`/api/catering/dishes/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) { console.error(error); }
    };

    // --- MENUS CRUD ---

    const openMenuForm = (menu?: Menu) => {
        if (menu) {
            setEditingMenuId(menu.id);
            setMenuName(menu.name);
            setMenuDescription(menu.description || '');
        } else {
            setEditingMenuId(null);
            setMenuName('');
            setMenuDescription('');
        }
        setShowMenuForm(true);
    };

    const saveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: menuName,
            description: menuDescription,
            dishIds: [] // Future: Add dish selector
        };

        try {
            if (editingMenuId) {
                await fetch(`/api/catering/menus/${editingMenuId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/catering/menus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            setShowMenuForm(false);
            loadData();
        } catch (error) { console.error(error); }
    };

    const deleteMenu = async (id: string) => {
        if (!confirm('¿Eliminar menú?')) return;
        try {
            await fetch(`/api/catering/menus/${id}`, { method: 'DELETE' });
            loadData();
        } catch (error) { console.error(error); }
    };


    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Catering y Menús</h1>

            {/* Sub-Navigation */}
            <div className="flex gap-4 mb-8 border-b pb-2">
                <button onClick={() => setView('ingredients')} className={`font-bold pb-2 ${view === 'ingredients' ? 'text-primavera-gold border-b-2 border-primavera-gold' : 'text-gray-500'}`}>Ingredientes</button>
                <button onClick={() => setView('dishes')} className={`font-bold pb-2 ${view === 'dishes' ? 'text-primavera-gold border-b-2 border-primavera-gold' : 'text-gray-500'}`}>Platillos (Recetas)</button>
                <button onClick={() => setView('menus')} className={`font-bold pb-2 ${view === 'menus' ? 'text-primavera-gold border-b-2 border-primavera-gold' : 'text-gray-500'}`}>Menús</button>
            </div>

            {/* Content */}
            {view === 'ingredients' && (
                <div>
                    <form onSubmit={createIngredient} className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500">Nombre</label>
                            <input className="border p-2 rounded" value={newIngName} onChange={e => setNewIngName(e.target.value)} placeholder="Ej. Carne de Res" required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500">Unidad</label>
                            <select className="border p-2 rounded w-24" value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)}>
                                <option value="kg">kg</option>
                                <option value="lt">lt</option>
                                <option value="pz">pz</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500">Costo Unitario</label>
                            <input className="border p-2 rounded w-24" type="number" value={newIngCost} onChange={e => setNewIngCost(e.target.value)} placeholder="$0.00" required />
                        </div>
                        <button className="bg-primavera-gold text-white px-4 py-2 rounded font-bold hover:brightness-110">Agregar</button>
                    </form>

                    <table className="w-full bg-white rounded shadow text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                            <tr>
                                <th className="p-3">Ingrediente</th>
                                <th className="p-3">Unidad</th>
                                <th className="p-3">Costo Unitario</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {ingredients.map(i => (
                                <tr key={i.id} className="hover:bg-gray-50">
                                    {editingIngId === i.id ? (
                                        <>
                                            <td className="p-3"><input className="border rounded px-1 w-full" value={editIngName} onChange={e => setEditIngName(e.target.value)} /></td>
                                            <td className="p-3">
                                                <select className="border rounded px-1" value={editIngUnit} onChange={e => setEditIngUnit(e.target.value)}>
                                                    <option value="kg">kg</option>
                                                    <option value="lt">lt</option>
                                                    <option value="pz">pz</option>
                                                </select>
                                            </td>
                                            <td className="p-3"><input className="border rounded px-1 w-24" type="number" value={editIngCost} onChange={e => setEditIngCost(e.target.value)} /></td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={updateIngredient} className="text-green-600 font-bold text-sm">Guardar</button>
                                                <button onClick={() => setEditingIngId(null)} className="text-gray-500 text-sm">Cancelar</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3 font-medium">{i.name}</td>
                                            <td className="p-3 text-gray-500">{i.unit}</td>
                                            <td className="p-3 text-green-600 font-bold">${i.costPerUnit}</td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => startEditIngredient(i)} className="text-blue-500 hover:text-blue-700">✏️</button>
                                                <button onClick={() => deleteIngredient(i.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'dishes' && (
                <div>
                    {!showDishForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                                onClick={() => openDishForm()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 font-bold cursor-pointer hover:border-primavera-gold hover:text-primavera-gold transition min-h-[150px]"
                            >
                                <span className="text-3xl mb-2">+</span>
                                <span>Nuevo Platillo</span>
                            </button>
                            {dishes.map(d => (
                                <div key={d.id} className="bg-white p-4 rounded shadow hover:shadow-md transition relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => openDishForm(d)} className="bg-blue-100 p-1 rounded text-blue-600 hover:bg-blue-200">✎</button>
                                        <button onClick={() => deleteDish(d.id)} className="bg-red-100 p-1 rounded text-red-600 hover:bg-red-200">✕</button>
                                    </div>
                                    <h3 className="font-bold text-lg">{d.name}</h3>
                                    <div className="mt-2 text-sm space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Precio Venta:</span>
                                            <span className="font-bold text-gray-800">${d.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Costo (Insumos):</span>
                                            <span className="font-bold text-red-500">${d.cost || 0}</span>
                                        </div>
                                        <div className="border-t pt-1 mt-1 flex justify-between bg-gray-50 p-1 rounded">
                                            <span className="text-gray-600 text-xs uppercase font-bold">Ganancia:</span>
                                            <span className="font-bold text-green-600">${d.price - (d.cost || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                            <h3 className="font-bold text-xl mb-4">{editingDishId ? 'Editar Platillo' : 'Crear Nuevo Platillo'}</h3>
                            <form onSubmit={saveDish} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Nombre del Platillo</label>
                                    <input className="w-full border p-2 rounded" value={dishName} onChange={e => setDishName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Descripción</label>
                                    <textarea className="w-full border p-2 rounded" value={dishDescription} onChange={e => setDishDescription(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Precio de Venta</label>
                                    <input className="w-full border p-2 rounded" type="number" value={dishPrice} onChange={e => setDishPrice(e.target.value)} required />
                                </div>
                                {/* Future: Ingredient Selector */}
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowDishForm(false)} className="text-gray-500 px-4 py-2">Cancelar</button>
                                    <button type="submit" className="bg-primavera-gold text-white px-6 py-2 rounded font-bold">Guardar Platillo</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {view === 'menus' && (
                <div>
                    {!showMenuForm ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => openMenuForm()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 font-bold cursor-pointer hover:border-primavera-gold hover:text-primavera-gold transition min-h-[150px]"
                            >
                                <span className="text-3xl mb-2">+</span>
                                <span>Nuevo Menú</span>
                            </button>
                            {menus.map(m => (
                                <div key={m.id} className="bg-white p-4 rounded shadow flex flex-col justify-between relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => openMenuForm(m)} className="bg-blue-100 p-1 rounded text-blue-600 hover:bg-blue-200">✎</button>
                                        <button onClick={() => deleteMenu(m.id)} className="bg-red-100 p-1 rounded text-red-600 hover:bg-red-200">✕</button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-primavera-gold">{m.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{m.description}</p>
                                        <div className="mt-2 text-gray-600 text-sm">
                                            {m.dishes?.length || 0} platillos incluidos
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <button className="text-sm text-blue-600 font-bold hover:underline">Editar Contenido</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
                            <h3 className="font-bold text-xl mb-4">{editingMenuId ? 'Editar Menú' : 'Configurar Nuevo Menú'}</h3>
                            <form onSubmit={saveMenu} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Nombre del Menú</label>
                                    <input className="w-full border p-2 rounded" value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="Ej. Menú Ejecutivo 2025" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Descripción</label>
                                    <textarea className="w-full border p-2 rounded" value={menuDescription} onChange={e => setMenuDescription(e.target.value)} />
                                </div>
                                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                                    💡 Podrás agregar platillos después de crear el menú.
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button type="button" onClick={() => setShowMenuForm(false)} className="text-gray-500 px-4 py-2">Cancelar</button>
                                    <button type="submit" className="bg-primavera-gold text-white px-6 py-2 rounded font-bold">{editingMenuId ? 'Actualizar' : 'Crear Menú'}</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CateringDashboard;
