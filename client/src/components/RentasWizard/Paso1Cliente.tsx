import React from 'react';
import { useRentasWizard } from './RentasContext';

const Paso1Cliente: React.FC = () => {
    const { clienteActual, setClienteActual, setStepActual } = useRentasWizard();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setClienteActual({
            ...clienteActual,
            [name]: type === 'checkbox' ? (name === 'requiereFactura' ? checked : value) : value
        });
    };

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();

        if (!clienteActual.telefono || clienteActual.telefono.length < 10) {
            alert('Por favor ingresa un número de teléfono válido de al menos 10 dígitos.');
            return;
        }

        if (clienteActual.requiereFactura && (!clienteActual.rfc || clienteActual.rfc.length < 12)) {
            alert('Por favor agrega un RFC válido para completar la facturación.');
            return;
        }

        setStepActual(2);
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-5">
                <h2 className="text-xl font-bold text-gray-800">1. Datos del Cliente y Entrega</h2>
                <p className="text-sm text-gray-500 mt-1">Completa los detalles de logística y facturación del evento.</p>
            </div>

            <form onSubmit={handleContinue} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Información Principal */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">Información Principal</h3>

                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo o Empresa <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                required
                                value={clienteActual.nombre}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow"
                                placeholder="Ej: Eventos Primavera S.A. de C.V."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono Fijo o Celular <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    id="telefono"
                                    required
                                    value={clienteActual.telefono}
                                    onChange={handleChange}
                                    pattern="[0-9]{10,14}"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow"
                                    placeholder="Ej: 5512345678"
                                    title="Ingresa 10 dígitos sin espacios"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="direccionEntrega" className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="direccionEntrega"
                                id="direccionEntrega"
                                required
                                value={clienteActual.direccionEntrega}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow"
                                placeholder="Calle, Número, Colonia, Ciudad"
                            />
                        </div>
                    </div>

                    {/* Logística - Entrega */}
                    <div className="space-y-4 mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">Datos de Entrega</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fechaEntrega" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    name="fechaEntrega"
                                    id="fechaEntrega"
                                    required
                                    value={clienteActual.fechaEntrega}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="horaEntrega" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                <input
                                    type="time"
                                    name="horaEntrega"
                                    id="horaEntrega"
                                    required
                                    value={clienteActual.horaEntrega}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logística - Recolección */}
                    <div className="space-y-4 mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">Datos de Recolección</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fechaRecoleccion" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    name="fechaRecoleccion"
                                    id="fechaRecoleccion"
                                    required
                                    value={clienteActual.fechaRecoleccion}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="horaRecoleccion" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                <input
                                    type="time"
                                    name="horaRecoleccion"
                                    id="horaRecoleccion"
                                    required
                                    value={clienteActual.horaRecoleccion}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detalles Extra */}
                    <div className="col-span-1 md:col-span-2 space-y-4 mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider border-b pb-2">Configuración Final</h3>

                        <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                name="requiereFactura"
                                id="requiereFactura"
                                checked={clienteActual.requiereFactura}
                                onChange={handleChange}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="requiereFactura" className="text-sm font-medium text-gray-800 cursor-pointer">
                                El cliente requiere Factura Fiscal de esta orden
                            </label>
                        </div>

                        {clienteActual.requiereFactura && (
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-col gap-2 mt-2">
                                <label htmlFor="rfc" className="block text-sm font-medium text-blue-900 mb-1">RFC del Cliente <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="rfc"
                                    id="rfc"
                                    required={clienteActual.requiereFactura}
                                    value={clienteActual.rfc}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-blue-200 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none uppercase"
                                    placeholder="Ej: XAXX010101000"
                                />
                                <p className="text-xs text-blue-600">Al solicitar factura se agregará automáticamente un 16% de IVA al total del pedido al finalizar el flujo.</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">Notas u Observaciones (Opcional)</label>
                            <textarea
                                name="notas"
                                id="notas"
                                rows={3}
                                value={clienteActual.notas}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow"
                                placeholder="Reglas de acceso al lugar, maniobras largas, nombre del contacto para entrega..."
                            />
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Continuar a Selección de Mobiliario
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Paso1Cliente;
