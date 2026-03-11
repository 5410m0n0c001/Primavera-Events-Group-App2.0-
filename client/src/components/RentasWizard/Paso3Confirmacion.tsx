import React from 'react';
import { useRentasWizard } from './RentasContext';

const Paso3Confirmacion: React.FC = () => {
    const { clienteActual, carrito, totalPedido, setStepActual, limpiarWizard } = useRentasWizard();

    const handleConfirmar = () => {
        // Aquí iría la llamada a la API y el vaciado del form en caso de éxito.
        alert('Pedido Confirmado con éxito. Inventario actualizado.');
        limpiarWizard();
    };

    const handleGuardarBorrador = () => {
        alert('Pedido guardado como borrador.');
        limpiarWizard();
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Confirma el Pedido</h2>
                    <p className="text-gray-500 text-sm mt-1">Revisa que todos los datos y artículos sean correctos antes de finalizar.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
                {/* Resumen del Cliente y Evento */}
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Datos del Cliente</h3>
                        <p className="text-lg font-bold text-gray-900">{clienteActual.nombre || 'No especificado'}</p>
                        <p className="text-sm text-gray-600 mt-1">{clienteActual.direccionEntrega || 'Sin dirección de entrega'}</p>
                        {clienteActual.requiereFactura && (
                            <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Requiere Factura
                            </span>
                        )}
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Entrega</h3>
                            <p className="text-sm font-medium text-gray-900">{clienteActual.fechaEntrega || '--'}</p>
                            <p className="text-sm text-gray-500">{clienteActual.horaEntrega || '--'}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recolección</h3>
                            <p className="text-sm font-medium text-gray-900">{clienteActual.fechaRecoleccion || '--'}</p>
                            <p className="text-sm text-gray-500">{clienteActual.horaRecoleccion || '--'}</p>
                        </div>
                    </div>
                </div>

                {clienteActual.notas && (
                    <div className="p-4 bg-yellow-50 border-b border-yellow-100 text-sm text-yellow-800">
                        <span className="font-semibold mr-1">Notas de Logística:</span> {clienteActual.notas}
                    </div>
                )}

                {/* Resumen de Artículos */}
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Mobiliario Renteado</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="pb-3 text-sm font-semibold text-gray-600">Artículo</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 text-center">Cantidad</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Precio Unitario</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-600 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.map(cartItem => (
                                    <tr key={cartItem.item.id} className="border-b border-gray-100 last:border-0">
                                        <td className="py-4 text-sm font-medium text-gray-900">
                                            {cartItem.item.name}
                                            <span className="block text-xs text-gray-500 font-normal">{cartItem.item.subCategoryId}</span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-600 text-center">{cartItem.cantidad} {cartItem.item.unit}</td>
                                        <td className="py-4 text-sm text-gray-600 text-right">${cartItem.item.price.toFixed(2)}</td>
                                        <td className="py-4 text-sm font-bold text-gray-900 text-right">${cartItem.subtotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${totalPedido.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                                <span>Impuestos (16%)</span>
                                <span>${(totalPedido * 0.16).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                                <span className="font-bold text-gray-900 text-lg">Total</span>
                                <span className="font-black text-indigo-600 text-2xl">${(totalPedido * 1.16).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
                <button
                    onClick={() => setStepActual(2)}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors order-3 sm:order-1"
                >
                    Volver a Editar
                </button>
                <button
                    onClick={handleGuardarBorrador}
                    className="w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors order-2"
                >
                    Guardar Borrador
                </button>
                <button
                    onClick={handleConfirmar}
                    className="w-full sm:w-auto px-8 py-3 border border-transparent shadow-md text-base font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center justify-center order-1 sm:order-3"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar Pedido
                </button>
            </div>
        </div>
    );
};

export default Paso3Confirmacion;
