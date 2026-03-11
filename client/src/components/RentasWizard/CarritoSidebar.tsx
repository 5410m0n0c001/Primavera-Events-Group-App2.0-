import React from 'react';
import { useRentasWizard } from './RentasContext';

const CarritoSidebar: React.FC = () => {
    const { carrito, actualizarCantidad, removerDelCarrito, totalPedido, setStepActual } = useRentasWizard();

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center p-8 text-center h-full text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="font-medium text-gray-500">Tu pedido actual está vacío</p>
            <p className="text-sm mt-1">Selecciona artículos del catálogo para agregarlos aquí.</p>
        </div>
    );

    return (
        <div className="bg-white border rounded-xl shadow-lg border-gray-200 flex flex-col h-[calc(100vh-140px)] sticky top-[90px] overflow-hidden">
            {/* Header del Carrito */}
            <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <h3 className="text-white font-bold text-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Resumen del Pedido
                </h3>
                <span className="bg-white text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                </span>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {carrito.length === 0 ? renderEmptyState() : (
                    <ul className="space-y-4">
                        {carrito.map(cartItem => (
                            <li key={cartItem.item.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative group hover:border-indigo-200 transition-colors">
                                {/* Botón Borrar (Aparece en hover) */}
                                <button
                                    onClick={() => removerDelCarrito(cartItem.item.id)}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-sm"
                                    title="Eliminar artículo"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-gray-800 text-sm w-3/4 pr-4">{cartItem.item.name}</span>
                                    <span className="text-sm font-bold text-gray-900">${cartItem.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs text-gray-500">${cartItem.item.price.toFixed(2)} c/u</span>

                                    {/* Controles + / - Pequeños */}
                                    <div className="flex items-center border border-gray-200 rounded-md">
                                        <button
                                            onClick={() => actualizarCantidad(cartItem.item.id, Math.max(1, cartItem.cantidad - 1))}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                                        >-</button>
                                        <span className="px-2 py-1 text-sm font-medium w-8 text-center text-gray-800 border-x border-gray-200 bg-gray-50">
                                            {cartItem.cantidad}
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (cartItem.cantidad < (cartItem.item.available || Number.MAX_SAFE_INTEGER)) {
                                                    actualizarCantidad(cartItem.item.id, cartItem.cantidad + 1);
                                                }
                                            }}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors"
                                            disabled={cartItem.cantidad >= (cartItem.item.available || 0)}
                                        >+</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Total y Botón */}
            <div className="bg-white border-t border-gray-200 p-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium text-sm">Subtotal</span>
                    <span className="font-bold text-gray-900">
                        ${totalPedido.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                {totalPedido.iva > 0 && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium text-sm">IVA (16%)</span>
                        <span className="font-bold text-gray-900">
                            ${totalPedido.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                )}
                {totalPedido.descuento > 0 && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium text-sm">Descuento</span>
                        <span className="font-bold text-red-600">
                            -${totalPedido.descuento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                )}
                {totalPedido.flete > 0 && (
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 font-medium text-sm">Flete</span>
                        <span className="font-bold text-gray-900">
                            ${totalPedido.flete.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                )}
                <div className="flex justify-between items-end mb-4 border-t border-gray-100 pt-3 mt-3">
                    <span className="text-gray-800 font-bold">Total</span>
                    <span className="text-2xl font-bold text-indigo-600 flex items-end">
                        <span className="text-lg mr-1 text-indigo-400 font-normal">$</span>
                        {totalPedido.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <button
                    onClick={() => setStepActual(3)}
                    disabled={carrito.length === 0}
                    className={`w-full py-3.5 px-4 flex justify-center items-center text-base font-bold rounded-lg transition-all shadow-sm
                        ${carrito.length > 0
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    Revisar Pedido Completo
                    {carrito.length > 0 && (
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
                <div className="mt-3 text-center">
                    <button
                        onClick={() => setStepActual(1)}
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        Volver a Datos del Cliente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarritoSidebar;
