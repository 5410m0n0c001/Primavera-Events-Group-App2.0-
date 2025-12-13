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
      <nav className="bg-primavera-black text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-xl font-serif text-primavera-gold font-bold">Primavera Events Group</div>
          <div className="space-x-4">
            <button
              onClick={() => setView('quote')}
              className={`px-3 py-1 rounded transition ${view === 'quote' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Cotizador
            </button>
            <button
              onClick={() => setView('venues')}
              className={`px-3 py-1 rounded transition ${view === 'venues' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Locaciones
            </button>
            <button
              onClick={() => setView('crm')}
              className={`px-3 py-1 rounded transition ${view === 'crm' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              CRM Clientes
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded transition ${view === 'calendar' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Calendario
            </button>
            <button
              onClick={() => setView('inventory')}
              className={`px-3 py-1 rounded transition ${view === 'inventory' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Inventario
            </button>
            <button
              onClick={() => setView('suppliers')}
              className={`px-3 py-1 rounded transition ${view === 'suppliers' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Proveedores
            </button>
            <button
              onClick={() => setView('finance')}
              className={`px-3 py-1 rounded transition ${view === 'finance' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Finanzas
            </button>
            <button
              onClick={() => setView('catering')}
              className={`px-3 py-1 rounded transition ${view === 'catering' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Catering
            </button>
            <button
              onClick={() => setView('production')}
              className={`px-3 py-1 rounded transition ${view === 'production' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Producción
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-3 py-1 rounded transition ${view === 'analytics' ? 'bg-primavera-gold text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Analytics
            </button>
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
