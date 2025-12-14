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
    const [stats, setStats] = useState<FinanceStats>({
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        pendingIncome: 0,
        pendingExpenses: 0
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
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
            setLoading(true);
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
            ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Finanzas</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <span className="text-lg">+</span> Nuevo Movimiento
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="apple-card p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-green-500 text-8xl font-bold font-display">$</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Ingresos Totales</div>
                    <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">${stats?.totalIncome.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-2 font-medium">Por cobrar: <span className="text-gray-600 dark:text-gray-300">${stats?.pendingIncome.toLocaleString()}</span></div>
                </div>
                <div className="apple-card p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-red-500 text-8xl font-bold font-display">↓</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Gastos Totales</div>
                    <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">${stats?.totalExpenses.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-2 font-medium">Por pagar: <span className="text-gray-600 dark:text-gray-300">${stats?.pendingExpenses.toLocaleString()}</span></div>
                </div>
                <div className="apple-card p-6 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-blue-500 text-8xl font-bold font-display">%</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Utilidad Neta</div>
                    <div className={`text-3xl font-display font-bold ${stats?.netProfit! >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-red-500 dark:text-red-400'}`}>
                        ${stats?.netProfit.toLocaleString()}
                    </div>
                </div>
                <div className="bg-[#1D1D1F] dark:bg-black text-white p-6 rounded-2xl shadow-xl shadow-black/20 relative overflow-hidden border border-white/10">
                    <div className="relative z-10">
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Proyección (Pipeline)</div>
                        <div className="text-3xl font-display font-bold">${(projections.potential + projections.confirmed).toLocaleString()}</div>
                        <div className="text-xs text-gray-400 mt-2">Potential: ${projections.potential.toLocaleString()}</div>
                    </div>
                    {/* Decorative gradient blob */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
                </div>
            </div>

            {/* Analysis & Comparisons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart: Income vs Expense */}
                <div className="apple-card p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-8">Flujo de Efectivo</h3>
                    <div className="h-48 flex items-end justify-center gap-16 px-10 border-b border-gray-100 pb-4">
                        <div className="w-24 bg-green-500/10 rounded-t-2xl relative group transition-all duration-500 hover:bg-green-500/20" style={{ height: `${(stats?.totalIncome || 0) / maxVal * 100}%` }}>
                            <div className="absolute -top-8 w-full text-center font-bold text-green-600 text-sm">${stats?.totalIncome.toLocaleString()}</div>
                            <div className="absolute bottom-2 w-full text-center text-[10px] text-green-700 font-bold tracking-wider">INGRESOS</div>
                            {/* Inner bar */}
                            <div className="absolute bottom-0 w-full bg-green-500 h-1.5 rounded-b-none opacity-40"></div>
                        </div>
                        <div className="w-24 bg-red-500/10 rounded-t-2xl relative group transition-all duration-500 hover:bg-red-500/20" style={{ height: `${(stats?.totalExpenses || 0) / maxVal * 100}%` }}>
                            <div className="absolute -top-8 w-full text-center font-bold text-red-600 text-sm">${stats?.totalExpenses.toLocaleString()}</div>
                            <div className="absolute bottom-2 w-full text-center text-[10px] text-red-700 font-bold tracking-wider">GASTOS</div>
                            {/* Inner bar */}
                            <div className="absolute bottom-0 w-full bg-red-500 h-1.5 rounded-b-none opacity-40"></div>
                        </div>
                    </div>
                </div>

                {/* Projections Detail */}
                <div className="apple-card p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Proyecciones de Venta</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-gray-600">Ganado (Confirmado)</span>
                                <span className="text-gray-900">${projections.confirmed.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-[#34C759] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-gray-600">En Negociación</span>
                                <span className="text-gray-900">${projections.potential.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-[#007AFF] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-gray-600">Perdido</span>
                                <span className="text-gray-900">${projections.lost.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-[#FF3B30] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="apple-card overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Movimientos Recientes</h3>
                    <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">{transactions.length} registros</span>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-[11px] uppercase text-gray-400 font-bold tracking-wider">
                        <tr>
                            <th className="p-4 pl-8">Fecha</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4 text-right">Monto</th>
                            <th className="p-4 text-center pr-8">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="p-4 pl-8 text-sm text-gray-500 font-medium">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {t.type === 'INCOME' ? `Ingreso: ${t.reference || 'General'}` : t.description}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${t.type === 'INCOME'
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                        {t.category || (t.type === 'INCOME' ? 'Venta' : 'Gasto')}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold text-sm ${t.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-center pr-8">
                                    <button
                                        onClick={() => handleDelete(t.id, t.type)}
                                        className="text-gray-300 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                                        title="Eliminar registro"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Glassmorphism */}
            {showModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in-up">
                    <div className="apple-card w-full max-w-md overflow-hidden shadow-2xl scale-100 ring-1 ring-black/5">
                        <div className="flex bg-gray-50/80 backdrop-blur-md p-1">
                            <button
                                onClick={() => setFormType('EXPENSE')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all shadow-sm ${formType === 'EXPENSE' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Registrar Gasto
                            </button>
                            <button
                                onClick={() => setFormType('INCOME')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all shadow-sm ${formType === 'INCOME' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Registrar Ingreso
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="text-center">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Monto del Movimiento</label>
                                <div className="relative inline-block w-full">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 pl-4 text-gray-400 text-2xl">$</span>
                                    <input
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 text-3xl font-bold text-center border-b-2 border-gray-100 bg-transparent focus:border-black outline-none transition-colors placeholder-gray-200 text-gray-900"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {formType === 'EXPENSE' ? (
                                <div className="space-y-4">
                                    <input
                                        className="apple-input w-full"
                                        placeholder="Descripción"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="apple-input w-full appearance-none bg-no-repeat bg-right"
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
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <input
                                        className="apple-input w-full"
                                        placeholder="Referencia / Cliente"
                                        value={formData.description} // Mapped to reference
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                    <select
                                        className="apple-input w-full"
                                        value={formData.method}
                                        onChange={e => setFormData({ ...formData, method: e.target.value })}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Transferencia">Transferencia</option>
                                        <option value="Tarjeta">Tarjeta</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-[#1D1D1F] text-white rounded-xl font-bold shadow-lg shadow-black/20 hover:bg-black transition transform active:scale-95"
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
