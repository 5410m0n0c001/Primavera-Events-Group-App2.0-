import React, { useState } from 'react';
import { useRentasWizard } from './RentasContext';

type EstadoArticulo = 'completo' | 'incompleto' | 'danado';

interface EstadoRecepcion {
    [itemId: string]: {
        estado: EstadoArticulo;
        notas: string;
    };
}

const Paso4Devolucion: React.FC = () => {
    const { clienteActual, carrito, limpiarWizard } = useRentasWizard();
    const [recepcion, setRecepcion] = useState<EstadoRecepcion>(
        carrito.reduce((acc, item) => ({
            ...acc,
            [item.item.id]: { estado: 'completo', notas: '' }
        }), {})
    );

    const handleEstadoChange = (itemId: string, estado: EstadoArticulo) => {
        setRecepcion(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], estado }
        }));
    };

    const handleNotasChange = (itemId: string, notas: string) => {
        setRecepcion(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], notas }
        }));
    };

    const handleFinalizar = () => {
        // Lógica de API para devolver inventario
        alert('Recepción de mobiliario procesada. Inventario actualizado y pedido cerrado.');
        limpiarWizard();
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recepción de Mobiliario</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Registra el estado en el que el mobiliario fue devuelto por el cliente <strong>{clienteActual.nombre || 'Desconocido'}</strong>.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Artículo Rentado</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cant. Salida</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Estado de Recepción</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Notas / Observaciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {carrito.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        No hay artículos en este pedido.
                                    </td>
                                </tr>
                            ) : (
                                carrito.map(cartItem => {
                                    const { item, cantidad } = cartItem;
                                    const state = recepcion[item.id] || { estado: 'completo', notas: '' };

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.subCategoryId}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {cantidad} {item.unit}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-2">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                            checked={state.estado === 'completo'}
                                                            onChange={() => handleEstadoChange(item.id, 'completo')}
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Completo y Buen Estado</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            className="h-4 w-4 text-yellow-500 border-gray-300 focus:ring-yellow-400"
                                                            checked={state.estado === 'incompleto'}
                                                            onChange={() => handleEstadoChange(item.id, 'incompleto')}
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Entrega Incompleta</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            className="h-4 w-4 text-red-500 border-gray-300 focus:ring-red-400"
                                                            checked={state.estado === 'danado'}
                                                            onChange={() => handleEstadoChange(item.id, 'danado')}
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Presenta Daños</span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                {(state.estado === 'incompleto' || state.estado === 'danado') ? (
                                                    <textarea
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                        rows={3}
                                                        placeholder="Detalla cuántas piezas faltan o el daño..."
                                                        value={state.notas}
                                                        onChange={(e) => handleNotasChange(item.id, e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">No requiere notas</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleFinalizar}
                    disabled={carrito.length === 0}
                    className={`px-8 py-3 flex items-center shadow-md text-base font-bold rounded-lg transition-all
                        ${carrito.length > 0
                            ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                            : 'text-gray-400 bg-gray-200 cursor-not-allowed'}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cerrar Pedido y Devolver Inventario
                </button>
            </div>
        </div>
    );
};

export default Paso4Devolucion;
