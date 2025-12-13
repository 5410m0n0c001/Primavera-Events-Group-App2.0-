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
    price: number;
    cost: number;
}

interface Menu {
    id: string;
    name: string;
    dishes: Dish[];
}

const CateringDashboard: React.FC = () => {
    const [view, setView] = useState<'ingredients' | 'dishes' | 'menus'>('ingredients');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newIngName, setNewIngName] = useState('');
    const [newIngUnit, setNewIngUnit] = useState('kg');
    const [newIngCost, setNewIngCost] = useState('');

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (view === 'ingredients') {
                const res = await fetch('http://localhost:3000/api/catering/ingredients');
                setIngredients(await res.json());
            } else if (view === 'dishes') {
                const res = await fetch('http://localhost:3000/api/catering/dishes');
                setDishes(await res.json());
            } else {
                const res = await fetch('http://localhost:3000/api/catering/menus');
                setMenus(await res.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const createIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('http://localhost:3000/api/catering/ingredients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newIngName, unit: newIngUnit, costPerUnit: newIngCost, stock: 0 })
        });
        setNewIngName(''); setNewIngCost(''); loadData();
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
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {ingredients.map(i => (
                                <tr key={i.id}>
                                    <td className="p-3 font-medium">{i.name}</td>
                                    <td className="p-3 text-gray-500">{i.unit}</td>
                                    <td className="p-3 text-green-600 font-bold">${i.costPerUnit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'dishes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Add Dish Button Placeholder */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center text-gray-400 font-bold cursor-pointer hover:border-primavera-gold hover:text-primavera-gold transition">
                        + Nuevo Platillo
                    </div>
                    {dishes.map(d => (
                        <div key={d.id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
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
            )}

            {view === 'menus' && (
                <div className="grid grid-cols-1 gap-4">
                    {menus.map(m => (
                        <div key={m.id} className="bg-white p-4 rounded shadow">
                            <h3 className="font-bold text-xl text-primavera-gold">{m.name}</h3>
                            <div className="mt-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase">Platillos Incluidos:</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {m.dishes && m.dishes.length > 0 ? m.dishes.map(d => (
                                        <span key={d.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">{d.name}</span>
                                    )) : <span className="text-gray-400 italic text-sm">Sin platillos</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CateringDashboard;
