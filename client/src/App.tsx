import { useState } from 'react';
import QuoteWizard from './components/QuoteBuilder/Wizard';
import ClientList from './components/CRM/ClientList';
import CalendarView from './components/CRM/CalendarView';
import InventoryDashboard from './components/Inventory/InventoryDashboard';
import SupplierList from './components/Suppliers/SupplierList';
import FinanceDashboard from './components/Finance/FinanceDashboard';
import CateringDashboard from './components/Catering/CateringDashboard';
import ProductionDashboard from './components/Production/ProductionDashboard';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import VenuesManager from './components/Venues/VenuesManager';

function App() {
  const [view, setView] = useState<'quote' | 'crm' | 'calendar' | 'inventory' | 'suppliers' | 'finance' | 'catering' | 'production' | 'analytics' | 'venues'>('quote');

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex text-[#1D1D1F]">

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/60 backdrop-blur-xl border-r border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.03)] z-50 transition-all">
        <div className="p-6">
          <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Primavera Events</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'quote', label: 'Cotizador', icon: '📝' },
            { id: 'crm', label: 'CRM Clientes', icon: '👥' },
            { id: 'calendar', label: 'Calendario', icon: '📅' },
            { id: 'venues', label: 'Locaciones', icon: '🏰' },
            { id: 'inventory', label: 'Inventario', icon: '📦' },
            { id: 'suppliers', label: 'Proveedores', icon: '🚚' },
            { id: 'finance', label: 'Finanzas', icon: '📊' },
            { id: 'catering', label: 'Catering', icon: '🍽️' },
            { id: 'production', label: 'Producción', icon: '🎭' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group flex items-center gap-3 ${view === item.id
                  ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-black'
                  : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                }`}
            >
              <span className={`transition-transform duration-300 ${view === item.id ? 'scale-110' : 'scale-100 group-hover:scale-110'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 transition cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primavera-gold to-yellow-100 flex items-center justify-center text-xs font-bold text-white">PE</div>
            <div className="text-xs font-medium">
              <p className="text-gray-900">Admin User</p>
              <p className="text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Primavera Events</span>
        <button className="text-2xl">☰</button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen relative">
        {/* Header Glass for Content */}
        <header className="sticky top-0 z-40 px-8 py-3 bg-[#F5F5F7]/80 backdrop-blur-xl flex justify-between items-center border-b border-white/0 md:hidden">
          {/* Mobile header spacer */}
        </header>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up mt-14 md:mt-0">
          {view === 'quote' && <QuoteWizard />}
          {view === 'crm' && <ClientList />}
          {view === 'calendar' && <CalendarView />}
          {view === 'inventory' && <InventoryDashboard />}
          {view === 'suppliers' && <SupplierList />}
          {view === 'finance' && <FinanceDashboard />}
          {view === 'catering' && <CateringDashboard />}
          {view === 'production' && <ProductionDashboard />}
          {view === 'analytics' && <AnalyticsDashboard />}
          {view === 'venues' && <VenuesManager />}
        </div>
      </main>
    </div>
  );
}

export default App;
