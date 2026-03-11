import React from 'react';
import CatalogoGrid from './CatalogoGrid';
import CarritoSidebar from './CarritoSidebar';

const Paso2Seleccion: React.FC = () => {
    return (
        <div className="h-full">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Selección de Inventario</h2>
                    <p className="text-gray-500 text-sm mt-1">Busca y añade los artículos que el cliente necesita para su evento.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 pb-10">
                {/* Panel Central: Catálogo */}
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <CatalogoGrid />
                </div>

                {/* Panel Derecho: Carrito (Sticky) */}
                <div className="w-full lg:w-1/3 xl:w-1/4">
                    <CarritoSidebar />
                </div>
            </div>
        </div>
    );
};

export default Paso2Seleccion;
