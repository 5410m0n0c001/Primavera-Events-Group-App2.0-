import React, { useEffect, useState } from 'react';

// Comprehensive BI Dashboard
interface Metrics {
    // Finance
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;

    // Operations
    activeProjects: number;
    completedProjects: number;

    // CRM
    pendingLeads: number;
    totalClients: number;

    // Quotes
    totalQuotes: number;
    acceptedQuotes: number;
    quoteConversionRate: string;

    // Inventory
    totalStockValue: number;
    lowStockItems: number;
    damagedItems: number;

    // Ecosystem
    totalVenues: number;
    totalSuppliers: number;
    totalDishes: number;
}

interface ChartData {
    labels: string[];
    data: number[];
}

const AnalyticsDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [revenueData, setRevenueData] = useState<ChartData | null>(null);
    const [eventStats, setEventStats] = useState<ChartData | null>(null);
    const [pipeline, setPipeline] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics/dashboard');
            const data = await res.json();
            setMetrics(data.metrics || null);
            setRevenueData(data.revenue || { labels: [], data: [] });
            setEventStats(data.eventStats || { labels: [], data: [] });
            setPipeline(data.pipeline || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Analizando datos del negocio...</p>
            </div>
        </div>
    );

    const maxRevenue = Math.max(...(revenueData?.data || [0]));

    // Format currency helper
    const fMoney = (amount: number = 0) => amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-800">Business Intelligence</h1>
                    <p className="text-gray-500 mt-1">Visión estratégica 360° de Primavera Events Group</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.href = '/?view=quote'} className="bg-gradient-to-r from-primavera-gold to-yellow-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all font-bold text-sm">
                        + Nueva Cotización
                    </button>
                </div>
            </div>

            {/* SECTION 1: FINANCIAL HEALTH */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📊</span>
                    <h2 className="text-xl font-bold text-gray-800">Salud Financiera</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 relative z-10">Ingresos Totales (YTD)</p>
                        <p className="text-4xl font-bold text-emerald-600 relative z-10">{fMoney(metrics?.totalRevenue)}</p>
                        <p className="text-xs text-green-600 mt-2 font-medium flex items-center relative z-10">
                            ↑ Tendencia positiva
                        </p>
                    </div>

                    {/* Expenses */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 relative z-10">Gastos Operativos</p>
                        <p className="text-4xl font-bold text-rose-500 relative z-10">{fMoney(metrics?.totalExpenses)}</p>
                    </div>

                    {/* Net Profit */}
                    <div className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 relative z-10">Utilidad Neta</p>
                        <p className="text-4xl font-bold text-white relative z-10">{fMoney(metrics?.netProfit)}</p>
                        <p className="text-xs text-gray-400 mt-2 relative z-10">Margen real del periodo</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
                    <h3 className="font-bold text-gray-700 mb-6 flex justify-between items-center">
                        <span>Tendencia Mensual</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Año Actual</span>
                    </h3>
                    <div className="flex items-end justify-between h-48 space-x-3">
                        {revenueData?.labels.map((label, idx) => (
                            <div key={label} className="flex flex-col items-center flex-1 group">
                                <div className="w-full bg-gray-50 rounded-t-lg relative flex items-end justify-center overflow-hidden" style={{ height: '100%' }}>
                                    <div
                                        className="w-full bg-indigo-500 opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out rounded-t-sm"
                                        style={{ height: `${maxRevenue > 0 ? (revenueData.data[idx] / maxRevenue) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2: OPERATIONS & SALES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
                {/* Sales Funnel */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🚀</span>
                        <h2 className="text-xl font-bold text-gray-800">Ventas y CRM</h2>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <p className="text-blue-600 text-xs font-bold uppercase mb-1">Cotizaciones Totales</p>
                                <p className="text-2xl font-bold text-gray-800">{metrics?.totalQuotes}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <p className="text-green-600 text-xs font-bold uppercase mb-1">Tasa de Cierre</p>
                                <p className="text-2xl font-bold text-gray-800">{metrics?.quoteConversionRate}%</p>
                            </div>
                        </div>

                        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Pipeline de Leads</h3>
                        <div className="space-y-4">
                            {pipeline.map(p => (
                                <div key={p.name}>
                                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                        <span className="capitalize">{p.name.toLowerCase()}</span>
                                        <span>{p.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${p.name === 'LEAD' ? 'bg-yellow-400' : p.name === 'ACTIVE' ? 'bg-indigo-500' : 'bg-gray-400'}`}
                                            style={{ width: `${(p.value / (metrics?.totalClients || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Operations */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⚙️</span>
                        <h2 className="text-xl font-bold text-gray-800">Operaciones</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Inventory Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group cursor-pointer hover:border-blue-200 transition-colors" onClick={() => window.location.href = '/?view=inventory'}>
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Valor de Inventario</p>
                                <p className="text-3xl font-bold text-gray-800">{fMoney(metrics?.totalStockValue)}</p>
                                <div className="flex gap-3 mt-2 text-xs font-medium">
                                    <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded">⚠ {metrics?.lowStockItems} Stock Bajo</span>
                                    <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded">✖ {metrics?.damagedItems} Dañados</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">📦</div>
                        </div>

                        {/* Projects Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Eventos Activos</p>
                                <p className="text-3xl font-bold text-gray-800">{metrics?.activeProjects}</p>
                                <p className="text-xs text-green-600 mt-1">+{metrics?.completedProjects} Completados históricamente</p>
                            </div>
                            <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">📅</div>
                        </div>

                        {/* Ecosystem Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-800">{metrics?.totalVenues}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Locaciones</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-800">{metrics?.totalSuppliers}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Proveedores</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold text-gray-800">{metrics?.totalDishes}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Platillos</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Empty State / Call to Action */}
            {metrics?.totalRevenue === 0 && metrics?.totalQuotes === 0 && (
                <div className="mt-8 bg-indigo-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">Comienza tu viaje con Primavera Events</h3>
                        <p className="text-indigo-200 mb-6 max-w-2xl mx-auto">Parece que aún no hay datos suficientes. Crea tu primera cotización para ver cómo este tablero cobra vida con información valiosa.</p>
                        <button onClick={() => window.location.href = '/?view=quote'} className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                            Crear Primera Cotización
                        </button>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
