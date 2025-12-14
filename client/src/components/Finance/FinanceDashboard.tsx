import React, { useEffect, useState } from 'react';

interface FinanceStats {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    pendingIncome: number;
    pendingExpenses: number;
}

interface Transaction {
    id: string;
    amount: number;
    date: string;
    method?: string; // For payments
    category?: string; // For expenses
    description?: string; // For expenses
    reference?: string; // For payments
    status: string;
    type: 'INCOME' | 'EXPENSE';
}

const FinanceDashboard: React.FC = () => {
    const [projections, setProjections] = useState({ potential: 0, confirmed: 0, lost: 0 });
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

    // Form State
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: '',
        method: '',
        status: 'Pagado',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const statsRes = await fetch('/api/finance/stats');
            if (statsRes.ok) setStats(await statsRes.json());

            const projRes = await fetch('/api/finance/projections');
            if (projRes.ok) setProjections(await projRes.json());

            const paymentsRes = await fetch('/api/finance/payments');
            const payments = await paymentsRes.json();

            const expensesRes = await fetch('/api/finance/expenses');
            const expenses = await expensesRes.json();

            // Merge and sort
            const merged = [
                ...payments.map((p: any) => ({ ...p, type: 'INCOME', category: 'Ingreso' })),
                ...expenses.map((e: any) => ({ ...e, type: 'EXPENSE' }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setTransactions(merged);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm('¿Eliminar este registro?')) return;
        const endpoint = type === 'INCOME' ? '/api/finance/payments' : '/api/finance/expenses';
        await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
        loadData();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = formType === 'INCOME' ? '/api/finance/payments' : '/api/finance/expenses';
        const body = formType === 'INCOME'
            ? { amount: formData.amount, method: formData.method, status: formData.status, reference: formData.description, eventId: '' /* Manual income */ }
            : { amount: formData.amount, description: formData.description, category: formData.category, status: formData.status };

        await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        setShowModal(false);
        setFormData({ amount: '', description: '', category: '', method: '', status: 'Pagado', date: new Date().toISOString().split('T')[0] });
        loadData();
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando Finanzas...</div>;

    const maxVal = Math.max(stats?.totalIncome || 1, stats?.totalExpenses || 1);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Finanzas y Reportes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primavera-gold text-white px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition font-medium"
                >
                    + Nuevo Movimiento
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-green-500 text-6xl font-bold">$</div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ingresos Totales</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">${stats?.totalIncome.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1">Por cobrar: ${stats?.pendingIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-red-500 text-6xl font-bold">↓</div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Gastos Totales</div>
                    <div className="text-3xl font-bold text-red-600 mt-2">${stats?.totalExpenses.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1">Por pagar: ${stats?.pendingExpenses.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-blue-500 text-6xl font-bold">%</div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Utilidad Neta</div>
                    <div className={`text-3xl font-bold mt-2 ${stats?.netProfit! >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ${stats?.netProfit.toLocaleString()}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-md">
                    <div className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Proyección (Cotizaciones)</div>
                    <div className="text-3xl font-bold mt-2">${(projections.potential + projections.confirmed).toLocaleString()}</div>
                    <div className="text-xs text-indigo-200 mt-1">Potential: ${projections.potential.toLocaleString()}</div>
                </div>
            </div>

            {/* Analysis & Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart: Income vs Expense */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-6">Comparativa de Flujo</h3>
                    <div className="h-40 flex items-end justify-center gap-16 px-10">
                        <div className="w-24 bg-green-100 rounded-t-lg relative group transition-all hover:bg-green-200" style={{ height: `${(stats?.totalIncome || 0) / maxVal * 100}%` }}>
                            <div className="absolute -top-8 w-full text-center font-bold text-green-700">${stats?.totalIncome.toLocaleString()}</div>
                            <div className="absolute bottom-2 w-full text-center text-xs text-green-800 font-bold">INGRESOS</div>
                        </div>
                        <div className="w-24 bg-red-100 rounded-t-lg relative group transition-all hover:bg-red-200" style={{ height: `${(stats?.totalExpenses || 0) / maxVal * 100}%` }}>
                            <div className="absolute -top-8 w-full text-center font-bold text-red-700">${stats?.totalExpenses.toLocaleString()}</div>
                            <div className="absolute bottom-2 w-full text-center text-xs text-red-800 font-bold">GASTOS</div>
                        </div>
                    </div>
                </div>

                {/* Projections Detail */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Proyecciones de Venta</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Confirmado (Ganado)</span>
                                <span className="font-bold text-gray-800">${projections.confirmed.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">En Negociación (Pipeline)</span>
                                <span className="font-bold text-gray-800">${projections.potential.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Perdido</span>
                                <span className="font-bold text-gray-800">${projections.lost.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-red-300 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-700">Movimientos Recientes</h3>
                    <span className="text-xs text-gray-500">Mostrando últimos {transactions.length} registros</span>
                </div>
                <table className="w-full text-left">
                    <thead className="text-xs uppercase text-gray-500 border-b">
                        <tr>
                            <th className="p-4 font-medium">Fecha</th>
                            <th className="p-4 font-medium">Descripción</th>
                            <th className="p-4 font-medium">Categoría</th>
                            <th className="p-4 text-right font-medium">Monto</th>
                            <th className="p-4 text-center font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 text-sm text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-4 font-medium text-gray-800">
                                    {t.type === 'INCOME' ? `Ingreso: ${t.reference || 'General'}` : t.description}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {t.category || (t.type === 'INCOME' ? 'Venta' : 'Gasto')}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDelete(t.id, t.type)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="flex border-b">
                            <button
                                onClick={() => setFormType('EXPENSE')}
                                className={`flex-1 p-4 font-bold text-center transition ${formType === 'EXPENSE' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Registrar Gasto
                            </button>
                            <button
                                onClick={() => setFormType('INCOME')}
                                className={`flex-1 p-4 font-bold text-center transition ${formType === 'INCOME' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Registrar Ingreso
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        className="w-full pl-8 p-2 border rounded bg-gray-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-primavera-gold"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {formType === 'EXPENSE' ? (
                                <>
                                    <input
                                        className="w-full p-2 border rounded"
                                        placeholder="Descripción del Gasto"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Seleccionar Categoría...</option>
                                        <option value="Insumos">Insumos y Materiales</option>
                                        <option value="Servicios">Servicios (Luz, Agua, Internet)</option>
                                        <option value="Nomina">Nómina y Staff</option>
                                        <option value="Marketing">Marketing y Publicidad</option>
                                        <option value="Mantenimiento">Mantenimiento</option>
                                        <option value="Otros">Otros</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <input
                                        className="w-full p-2 border rounded"
                                        placeholder="Referencia / Cliente"
                                        value={formData.description} // Mapped to reference
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={formData.method}
                                        onChange={e => setFormData({ ...formData, method: e.target.value })}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                    </select>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 text-gray-500 hover:text-gray-800 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 py-2 rounded font-bold text-white shadow-lg transform active:scale-95 transition ${formType === 'EXPENSE' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceDashboard;
