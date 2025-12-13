import React, { useEffect, useState } from 'react';

interface Metrics {
    totalRevenue: number;
    activeProjects: number;
    pendingLeads: number;
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
            const res = await fetch('http://localhost:3000/api/analytics/dashboard');
            const data = await res.json();
            setMetrics(data.metrics);
            setRevenueData(data.revenue);
            setEventStats(data.eventStats);
            setPipeline(data.pipeline);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Calculando Métricas...</div>;

    const maxRevenue = Math.max(...(revenueData?.data || [0]));

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Business Intelligence (BI)</h1>
            <p className="text-gray-500 mb-8">Visión general del rendimiento de Primavera Events Group.</p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-t-4 border-indigo-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Ingresos Anuales (YTD)</div>
                    <div className="text-4xl font-bold text-gray-800">${metrics?.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-pink-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Proyectos Activos</div>
                    <div className="text-4xl font-bold text-gray-800">{metrics?.activeProjects}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                    <div className="text-gray-500 text-sm font-bold uppercase mb-2">Leads Pendientes</div>
                    <div className="text-4xl font-bold text-gray-800">{metrics?.pendingLeads}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart (CSS Bar Chart) */}
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="font-bold text-gray-700 mb-6">Tendencia de Ingresos Mensuales</h3>
                    <div className="flex items-end justify-between h-64 space-x-2">
                        {revenueData?.labels.map((label, idx) => (
                            <div key={label} className="flex flex-col items-center flex-1 group relative">
                                <div className="w-full bg-indigo-50 rounded-t overflow-hidden relative" style={{ height: '100%' }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-indigo-500 transition-all duration-1000 ease-out group-hover:bg-indigo-600"
                                        style={{ height: `${(revenueData.data[idx] / maxRevenue) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{label}</span>
                                {/* Tooltip */}
                                <div className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${revenueData.data[idx].toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline & Stats */}
                <div className="space-y-8">
                    {/* Pipeline */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold text-gray-700 mb-4">Pipeline de Clientes</h3>
                        <div className="space-y-3">
                            {pipeline.map(p => (
                                <div key={p.name}>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span className="capitalize">{p.name.toLowerCase()}</span>
                                        <span className="font-bold">{p.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${(p.value / (metrics?.pendingLeads || 1) * 10) * 10}%` }} // Approximate scaling
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Event Stats */}
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold text-gray-700 mb-4">Tipos de Evento</h3>
                        <div className="flex flex-wrap gap-2">
                            {eventStats?.labels.map((label, idx) => (
                                <div key={label} className="bg-gray-50 px-3 py-2 rounded text-sm flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                                    <span className="font-bold text-gray-700">{label}</span>
                                    <span className="bg-white px-2 rounded text-gray-500 text-xs shadow-sm border">{eventStats.data[idx]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
