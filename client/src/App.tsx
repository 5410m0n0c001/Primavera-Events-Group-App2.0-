import { useState, useEffect } from 'react';
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex text-[#1D1D1F] dark:text-white transition-colors duration-300">

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.03)] z-50 transition-all">
        <div className="p-6">
          <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Primavera Events</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'quote', label: 'Cotizador Inteligente', icon: '✨' },
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
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all duration-300 group flex items-center gap-4 ${view === item.id
                ? 'bg-white dark:bg-[#2c2c2e] shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-black dark:text-white scale-[1.02]'
                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <span className={`text-xl transition-transform duration-300 ${view === item.id ? 'scale-110' : 'scale-100 group-hover:scale-125'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100/50 dark:border-white/5 space-y-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] transition-colors"
          >
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Modo Oscuro</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${darkMode ? 'left-6' : 'left-1'}`} />
            </div>
          </button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primavera-gold to-yellow-100 flex items-center justify-center text-xs font-bold text-white shadow-glow">PE</div>
            <div className="text-xs font-medium">
              <p className="text-gray-900 dark:text-white">Admin User</p>
              <p className="text-green-500">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 p-4 flex justify-between items-center transition-colors">
        <span className="font-bold text-lg dark:text-white">Primavera Events</span>
        <button className="text-2xl dark:text-white" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '🌙' : '☀️'}</button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen relative scroll-smooth">
        {/* Header Glass for Content */}
        <header className="sticky top-0 z-40 px-8 py-3 bg-[#F5F5F7]/80 dark:bg-black/80 backdrop-blur-xl flex justify-between items-center border-b border-white/0 md:hidden">
          {/* Mobile header spacer */}
        </header>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in-up mt-14 md:mt-0 pb-24">
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
