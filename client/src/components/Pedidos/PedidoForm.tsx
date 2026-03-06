import React, { useState, useEffect } from 'react';
import InventarioSelector from './InventarioSelector';

interface PedidoFormProps {
    pedidoId: string | null;
    onClose: () => void;
    onSave: () => void;
}

export default function PedidoForm({ pedidoId, onClose, onSave }: PedidoFormProps) {
    const isEdit = !!pedidoId;

    const [form, setForm] = useState({
        clienteNombre: '',
        clienteTelefono: '',
        clienteEmail: '',
        eventoTipo: '',
        fechaEntrega: new Date().toISOString().split('T')[0],
        horaEntrega: '10:00',
        direccionEntrega: '',
        fechaRecoleccion: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        horaRecoleccion: '10:00',
        requiereFactura: false,
        rfc: '',
        razonSocial: '',
        emailFactura: '',
        costoFlete: 0,
        descuento: 0,
        notas: '',
        items: [] as any[]
    });

    const [loading, setLoading] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            fetch(`/api/pedidos/${pedidoId}`)
                .then(res => res.json())
                .then(data => {
                    setForm({
                        ...data,
                        fechaEntrega: new Date(data.fechaEntrega).toISOString().split('T')[0],
                        fechaRecoleccion: new Date(data.fechaRecoleccion).toISOString().split('T')[0]
                    });
                    setLoading(false);
                });
        }
    }, [pedidoId]);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleAddItem = (item: any) => {
        setForm(prev => {
            const existing = prev.items.find((i: any) => i.inventarioId === item.id);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map((i: any) =>
                        i.inventarioId === item.id
                            ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioUnitario }
                            : i
                    )
                };
            }
            return {
                ...prev,
                items: [...prev.items, {
                    inventarioId: item.id,
                    descripcion: item.nombre,
                    cantidad: 1,
                    precioUnitario: item.precioRenta,
                    subtotal: item.precioRenta
                }]
            };
        });
    };

    const updateItemQuantity = (index: number, delta: number) => {
        setForm(prev => {
            const newItems = [...prev.items];
            const item = newItems[index];
            const newQty = item.cantidad + delta;

            if (newQty <= 0) {
                newItems.splice(index, 1);
            } else {
                newItems[index] = {
                    ...item,
                    cantidad: newQty,
                    subtotal: newQty * item.precioUnitario
                };
            }
            return { ...prev, items: newItems };
        });
    };

    const subtotal = form.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
    const base = subtotal + form.costoFlete - form.descuento;
    const iva = form.requiereFactura ? base * 0.16 : 0;
    const total = base + iva;

    const handleSubmit = async () => {
        try {
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? `/api/pedidos/${pedidoId}` : '/api/pedidos';

            const payload = { ...form };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Error saving pedido');
            onSave();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar el pedido.");
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Cargando...</div>;

    const InputLine = ({ label, name, type = "text", req = false, isHalf = false }: any) => (
        <div className={`flex flex-col mb-4 ${isHalf ? 'w-full md:w-[48%]' : 'w-full'}`}>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {label} {req && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type} name={name}
                value={(form as any)[name] || ''}
                onChange={handleChange}
                required={req}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primavera-gold outline-none transition"
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

            {/* LEFT COLUMN: Data Form */}
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar pr-2">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-black p-4 rounded-xl">
                    <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
                        {isEdit ? 'Editar Pedido' : 'Nuevo Pedido'}
                    </h2>
                    <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition">✖ Cerrar</button>
                </div>

                {/* Sec 1: Cliente */}
                <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                    <legend className="px-2 font-bold text-primavera-gold uppercase text-sm tracking-wide">👨‍💼 Datos del Cliente</legend>
                    <div className="flex flex-wrap justify-between">
                        <InputLine label="Nombre" name="clienteNombre" req isHalf />
                        <InputLine label="Teléfono" name="clienteTelefono" req isHalf />
                        <InputLine label="Email" name="clienteEmail" type="email" isHalf />
                        <InputLine label="Tipo de Evento" name="eventoTipo" isHalf />
                    </div>
                </fieldset>

                {/* Sec 2: Logistica */}
                <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                    <legend className="px-2 font-bold text-primavera-gold uppercase text-sm tracking-wide">🚚 Logística</legend>

                    <h4 className="text-sm border-b dark:border-gray-800 pb-1 mb-3 text-gray-500 uppercase tracking-widest font-semibold">Entrega</h4>
                    <div className="flex flex-wrap justify-between">
                        <InputLine label="Fecha" name="fechaEntrega" type="date" req isHalf />
                        <InputLine label="Hora (HH:MM)" name="horaEntrega" type="time" req isHalf />
                        <InputLine label="Dirección de Entrega" name="direccionEntrega" req />
                    </div>

                    <h4 className="text-sm border-b dark:border-gray-800 pb-1 mb-3 mt-4 text-gray-500 uppercase tracking-widest font-semibold">Recolección</h4>
                    <div className="flex flex-wrap justify-between">
                        <InputLine label="Fecha" name="fechaRecoleccion" type="date" req isHalf />
                        <InputLine label="Hora (HH:MM)" name="horaRecoleccion" type="time" req isHalf />
                    </div>
                </fieldset>

                {/* Sec 3: Facturacion & Finanzas */}
                <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                    <legend className="px-2 font-bold text-primavera-gold uppercase text-sm tracking-wide">🧾 Facturación y Extras</legend>

                    <label className="flex items-center gap-3 mb-4 cursor-pointer p-3 bg-gray-50 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-gray-800">
                        <input type="checkbox" name="requiereFactura" checked={form.requiereFactura} onChange={handleChange} className="w-5 h-5 accent-primavera-gold" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Requiere Factura (+16% IVA)</span>
                    </label>

                    {form.requiereFactura && (
                        <div className="flex flex-wrap justify-between animate-fade-in-up">
                            <InputLine label="Razón Social" name="razonSocial" req isHalf />
                            <InputLine label="RFC" name="rfc" req isHalf />
                            <InputLine label="Email de Facturación" name="emailFactura" type="email" req isHalf />
                            <InputLine label="Uso CFDI" name="usoCFDI" isHalf />
                        </div>
                    )}

                    <div className="flex flex-wrap justify-between mt-4">
                        <InputLine label="Costo de Flete Extra ($)" name="costoFlete" type="number" isHalf />
                        <InputLine label="Descuento Autorizado ($)" name="descuento" type="number" isHalf />
                        <div className="w-full mt-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Observaciones / Notas del Pedido</label>
                            <textarea
                                name="notas" value={form.notas} onChange={handleChange}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white outline-none min-h-[80px]"
                            />
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* RIGHT COLUMN: Items & Totals */}
            <div className="w-full md:w-[380px] shrink-0 flex flex-col space-y-4">

                {/* Selector de items */}
                <InventarioSelector onSelect={handleAddItem} fechaEntrega={form.fechaEntrega} />

                {/* Lista de Items */}
                <div className="flex-1 bg-gray-50 dark:bg-[#2c2c2e] p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[400px]">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Artículos Seleccionados</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {form.items.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm mt-8 opacity-50">Ningún artículo agregado</div>
                        ) : (
                            form.items.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#1c1c1e] p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex flex-col gap-2 shadow-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-sm truncate dark:text-gray-200" title={item.descripcion}>{item.descripcion}</span>
                                        <span className="font-bold text-sm text-green-600 dark:text-green-400 shrink-0">${item.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500">${item.precioUnitario}/u</span>
                                        <div className="flex bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                            <button type="button" onClick={() => updateItemQuantity(idx, -1)} className="px-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white">-</button>
                                            <span className="px-3 py-1 font-semibold dark:text-white text-sm bg-white dark:bg-[#2c2c2e]">{item.cantidad}</span>
                                            <button type="button" onClick={() => updateItemQuantity(idx, 1)} className="px-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Resumen Totales Sticky */}
                <div className="bg-gray-900 dark:bg-black p-5 rounded-2xl shadow-xl border border-gray-800 text-white">
                    <h3 className="font-bold text-primavera-gold uppercase text-xs tracking-widest mb-4">Resumen Financiero</h3>

                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between"><p>Subtotal Mobiliario:</p><p>${subtotal.toFixed(2)}</p></div>
                        {form.costoFlete > 0 && <div className="flex justify-between"><p>Flete Extra:</p><p className="text-yellow-400">${form.costoFlete.toFixed(2)}</p></div>}
                        {form.descuento > 0 && <div className="flex justify-between"><p>Descuento:</p><p className="text-red-400">-${form.descuento.toFixed(2)}</p></div>}
                        {form.requiereFactura && <div className="flex justify-between"><p>IVA (16%):</p><p>${iva.toFixed(2)}</p></div>}
                    </div>

                    <div className="border-t border-gray-700 my-4"></div>

                    <div className="flex justify-between items-end mb-6">
                        <p className="text-gray-400 font-medium">TOTAL PAGO</p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                            ${total.toFixed(2)}
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={form.items.length === 0 || !form.clienteNombre || !form.fechaEntrega}
                        className="w-full py-4 bg-gradient-to-r from-primavera-gold to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                    >
                        {isEdit ? '💾 Guardar Cambios' : '✅ Confirmar Pedido'}
                    </button>
                </div>

            </div>
        </div>
    );
}
