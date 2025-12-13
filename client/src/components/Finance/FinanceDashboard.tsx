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
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const statsRes = await fetch('http://localhost:3000/api/finance/stats');
            const statsData = await statsRes.json();
            setStats(statsData);

            const paymentsRes = await fetch('http://localhost:3000/api/finance/payments');
            const payments = await paymentsRes.json();

            const expensesRes = await fetch('http://localhost:3000/api/finance/expenses');
            const expenses = await expensesRes.json();

            // Merge and sort
            const merged = [
                ...payments.map((p: any) => ({ ...p, type: 'INCOME' })),
                ...expenses.map((e: any) => ({ ...e, type: 'EXPENSE' }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setTransactions(merged);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando Finanzas...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Finanzas y Reportes</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <div className="text-gray-500 text-sm font-bold uppercase">Ingresos Totales</div>
                    <div className="text-3xl font-bold text-green-600">${stats?.totalIncome.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1">Pendiente: ${stats?.pendingIncome.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
                    <div className="text-gray-500 text-sm font-bold uppercase">Gastos Totales</div>
                    <div className="text-3xl font-bold text-red-600">${stats?.totalExpenses.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-1">Pendiente: ${stats?.pendingExpenses.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <div className="text-gray-500 text-sm font-bold uppercase">Utilidad Neta</div>
                    <div className={`text-3xl font-bold ${stats?.netProfit! >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ${stats?.netProfit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Margen Real</div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-bold text-gray-700">Movimientos Recientes</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Meteodo</th>
                            <th className="p-4 text-right">Monto</th>
                            <th className="p-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="p-4 font-medium">
                                    {t.type === 'INCOME' ?
                                        `Pago Cliente (Ref: ${t.reference || '-'})` :
                                        t.description}
                                </td>
                                <td className="p-4 text-sm">
                                    {t.type === 'INCOME' ?
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">INGRESO</span> :
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">GASTO ({t.category})</span>
                                    }
                                </td>
                                <td className="p-4 text-sm text-gray-500">{t.method || '-'}</td>
                                <td className={`p-4 text-right font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'Pagado' || t.status === 'Completed' ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinanceDashboard;
