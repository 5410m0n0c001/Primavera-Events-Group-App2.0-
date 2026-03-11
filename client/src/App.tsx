import { useState, useEffect } from 'react';
import QuoteWizard from './components/QuoteBuilder/Wizard';
import { MobileNavigation } from './components/MobileNavigation';
import ClientList from './components/CRM/ClientList';
import CalendarView from './components/CRM/CalendarView';
import InventoryDashboard from './components/Inventory/InventoryDashboard';
import SupplierList from './components/Suppliers/SupplierList';
import FinanceDashboard from './components/Finance/FinanceDashboard';
import CateringDashboard from './components/Catering/CateringDashboard';
import ProductionDashboard from './components/Production/ProductionDashboard';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import VenuesManager from './components/Venues/VenuesManager';
import WebsiteDashboard from './components/Website/WebsiteDashboard';
import AIChatInterface from './components/Chat/AIChatInterface';
import AdminLogin from './components/Auth/AdminLogin';
import RentasWizardWrapper from './components/RentasWizard';

export type ViewState = 'quote' | 'events' | 'floorplans' | 'inventory' | 'catalog' | 'landing' | 'budget' | 'exports' | 'aiChat' | 'adminLogin' | 'crm' | 'calendar' | 'suppliers' | 'finance' | 'catering' | 'production' | 'analytics' | 'venues' | 'website' | 'pedidos';

function App() {
  const [view, setView] = useState<ViewState>('aiChat');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderNavigation = () => (
    <>
      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col h-screen sticky top-0 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.03)] z-50 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24 items-center'}`}>
        <div className={`p-6 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} w-full`}>
          {isSidebarOpen ? (
            <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent truncate pr-2">Primavera Events</h1>
          ) : (
            <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent" title="Primavera Events">PE</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${!isSidebarOpen && 'mt-2'}`}
            title={isSidebarOpen ? "Contraer menú" : "Expandir menú"}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className={`flex-1 ${isSidebarOpen ? 'px-4' : 'px-2'} space-y-2 overflow-y-auto custom-scrollbar w-full`}>
          {[
            { id: 'quote', label: 'Cotizador Inteligente', icon: '✨' },
            { id: 'crm', label: 'CRM Clientes', icon: '👥' },
            { id: 'calendar', label: 'Calendario', icon: '📅' },
            { id: 'venues', label: 'Locaciones', icon: '🏰' },
            { id: 'inventory', label: 'Inventario', icon: '📦' },
            { id: 'pedidos', label: 'Renta de Mobiliario', icon: '🚚' },
            { id: 'suppliers', label: 'Proveedores', icon: '🚛' },
            { id: 'finance', label: 'Finanzas', icon: '📊' },
            { id: 'catering', label: 'Catering', icon: '🍽️' },
            { id: 'production', label: 'Producción', icon: '🎭' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'website', label: 'Sitio Web', icon: '🌐' },
            { id: 'exports', label: 'Exportar Datos', icon: '📤' },
            { id: 'aiChat', label: 'AI Chat', icon: '🤖' },
            { id: 'ext-dashboard', label: 'Dashboard Transformación Digital', icon: '🚀', externalUrl: 'https://5410m0n0c001.github.io/banquetes-primavera-project/' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.externalUrl ? window.open(item.externalUrl, '_blank') : setView(item.id as any)}
              title={!isSidebarOpen ? item.label : undefined}
              className={`w-full text-left ${isSidebarOpen ? 'px-4 py-3.5' : 'px-0 py-3.5 justify-center'} rounded-2xl text-[15px] font-medium transition-all duration-300 group flex items-center ${isSidebarOpen ? 'gap-4' : 'gap-0'} ${view === item.id
                ? 'bg-white dark:bg-[#2c2c2e] shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-black dark:text-white scale-[1.02]'
                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <span className={`text-xl transition-transform duration-300 ${view === item.id ? 'scale-110' : 'scale-100 group-hover:scale-125'}`}>{item.icon}</span>
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className={`${isSidebarOpen ? 'p-4' : 'p-2 flex flex-col items-center'} border-t border-gray-100/50 dark:border-white/5 space-y-4 w-full`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Modo Oscuro"
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-4 py-3' : 'justify-center py-3'} rounded-xl bg-gray-100 dark:bg-[#2c2c2e] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] transition-colors`}
          >
            {isSidebarOpen ? (
              <>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Modo Oscuro</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${darkMode ? 'left-6' : 'left-1'}`} />
                </div>
              </>
            ) : (
              <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
            )}
          </button>

          <div
            onClick={() => {
              if (adminToken) {
                setView('quote');
              } else {
                setView('adminLogin');
              }
            }}
            className={`flex items-center ${isSidebarOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2'} w-full rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition cursor-pointer`} title="Admin User">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-primavera-gold to-yellow-100 flex items-center justify-center text-xs font-bold text-white shadow-glow shrink-0`}>PE</div>
            {isSidebarOpen && (
              <div className="text-xs font-medium truncate">
                <p className="text-gray-900 dark:text-white truncate">Admin User</p>
                <p className="text-green-500">Online</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 p-4 flex justify-between items-center transition-colors">
        <span className="font-bold text-lg dark:text-white">Primavera Events</span>
        <button className="text-2xl dark:text-white" onClick={() => setDarkMode(!darkMode)}>{darkMode ? '🌙' : '☀️'}</button>
      </div>

      {/* Navegación móvil - NUEVO */}
      <MobileNavigation currentView={view} onViewChange={(v) => setView(v as any)} />
    </>
  );

  const renderContent = () => (
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
        {view === 'pedidos' && <RentasWizardWrapper />}
        {view === 'suppliers' && <SupplierList />}
        {view === 'finance' && <FinanceDashboard />}
        {view === 'catering' && <CateringDashboard />}
        {view === 'production' && <ProductionDashboard />}
        {view === 'analytics' && <AnalyticsDashboard />}
        {view === 'venues' && <VenuesManager />}
        {view === 'website' && <WebsiteDashboard />}
      </div>
    </main>
  );

  // Views that don't need the dashboard shell
  if (view === 'aiChat') {
    return <AIChatInterface onLoginClick={() => setView('adminLogin')} adminToken={adminToken} onLogout={() => setAdminToken(null)} />;
  }

  if (view === 'adminLogin') {
    return <AdminLogin onLoginSuccess={(token) => {
      setAdminToken(token);
      setView('quote');
    }} onBack={() => setView('aiChat')} />;
  }

  // Dashboard views require authentication conceptually for security of data
  // Even if backend protects, frontend shouldn't show UI if not logged in
  if (!adminToken) {
    // Force redirect to login if they manipulated state or refreshed
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión como administrador para ver esta página.</p>
          <button onClick={() => setView('adminLogin')} className="btn btn-primary w-full">Ir al Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex text-[#1D1D1F] dark:text-white transition-colors duration-300">
      {renderNavigation()}
      {renderContent()}
    </div>
  );
}

export default App;
