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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-primavera-black text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-serif text-primavera-gold font-bold flex-shrink-0">Primavera Events Group</div>

          {/* Mobile Scrollable Nav (Desktop: Grid/Wrap) */}
          <div className="w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <div className="flex md:flex-wrap space-x-4 md:space-x-2 min-w-max md:min-w-0 px-2 md:px-0">
              <button
                onClick={() => setView('quote')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'quote' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Cotizador
              </button>
              <button
                onClick={() => setView('venues')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'venues' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Locaciones
              </button>
              <button
                onClick={() => setView('crm')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'crm' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                CRM Clientes
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'calendar' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Calendario
              </button>
              <button
                onClick={() => setView('inventory')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'inventory' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Inventario
              </button>
              <button
                onClick={() => setView('suppliers')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'suppliers' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Proveedores
              </button>
              <button
                onClick={() => setView('finance')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'finance' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Finanzas
              </button>
              <button
                onClick={() => setView('catering')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'catering' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Catering
              </button>
              <button
                onClick={() => setView('production')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'production' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Producción
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-3 py-1 rounded transition whitespace-nowrap ${view === 'analytics' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
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
      </main>
    </div>
  );
}

export default App;
