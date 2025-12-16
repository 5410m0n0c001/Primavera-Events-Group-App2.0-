import React, { useState } from 'react';

interface MobileNavigationProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

interface NavItem {
    view: string;
    emoji: string;
    label: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
    currentView,
    onViewChange
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems: NavItem[] = [
        { view: 'quote', emoji: '📋', label: 'Cotizador' },
        { view: 'clients', emoji: '👥', label: 'Clientes' },
        { view: 'venues', emoji: '🏛️', label: 'Locaciones' },
        { view: 'calendar', emoji: '📅', label: 'Calendario' },
        { view: 'finance', emoji: '💰', label: 'Finanzas' },
        { view: 'inventory', emoji: '📦', label: 'Inventario' },
        { view: 'analytics', emoji: '📊', label: 'Analytics' },
        { view: 'suppliers', emoji: '🚚', label: 'Proveedores' },
        { view: 'catering', emoji: '👨‍🍳', label: 'Catering' },
        { view: 'production', emoji: '🎬', label: 'Producción' },
        { view: 'crm', emoji: '📞', label: 'CRM' }
    ];

    const handleViewChange = (view: string) => {
        onViewChange(view);
        setIsOpen(false);
    };

    return (
        <>
            {/* Botón Hamburguesa - Solo visible en móvil */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition-colors"
                aria-label="Toggle menu"
                style={{ fontSize: '24px' }}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Overlay - Solo visible cuando el menú está abierto */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menú Lateral - Solo visible en móvil */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header del menú */}
                    <div className="p-6 border-b border-gray-200 bg-yellow-500">
                        <h2 className="text-xl font-bold text-white">Primavera Events</h2>
                        <p className="text-sm text-yellow-100">Sistema de Gestión</p>
                    </div>

                    {/* Items de navegación */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        {navItems.map((item) => {
                            const isActive = currentView === item.view;
                            return (
                                <button
                                    key={item.view}
                                    onClick={() => handleViewChange(item.view)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 transition-colors text-left ${isActive
                                            ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-2xl">{item.emoji}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer del menú */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-500 text-center">
                            Versión 1.1.0 - Diciembre 2025
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
