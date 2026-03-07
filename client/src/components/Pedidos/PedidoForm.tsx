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
    const [step, setStep] = useState(1);
    const [mobileTab, setMobileTab] = useState<'catalogo' | 'carrito'>('catalogo');

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

    const updateItemField = (index: number, field: string, value: any) => {
        setForm(prev => {
            const newItems = [...prev.items];
            const item = newItems[index];
            const updatedItem = { ...item, [field]: value };

            if (field === 'precioUnitario') {
                updatedItem.subtotal = updatedItem.cantidad * value;
            }

            newItems[index] = updatedItem;
            return { ...prev, items: newItems };
        });
    };

    const handleRemoveItem = (index: number) => {
        setForm(prev => {
            const newItems = [...prev.items];
            newItems.splice(index, 1);
            return { ...prev, items: newItems };
        });
    };

    const handleClearCart = () => {
        if (window.confirm('¿Seguro que deseas vaciar todo el pedido?')) {
            setForm(prev => ({ ...prev, items: [] }));
        }
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
        <div className="bg-[#f8f9fa] dark:bg-[#121212] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 md:p-8 w-[95vw] md:w-[90vw] max-w-7xl mx-auto flex flex-col h-[90vh] md:h-[85vh]">
            <div className="flex justify-between items-center bg-white dark:bg-[#1c1c1e] p-4 rounded-xl mb-6 shrink-0 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-900 dark:text-white">
                        {isEdit ? 'Editar Pedido Maestro' : 'Nuevo Pedido Maestro'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Selecciona artículos y completa los detalles estructurales del pedido.
                    </p>
                </div>
                <button onClick={onClose} className="text-sm font-medium text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    ✖ Cerrar
                </button>
            </div>

            {/* Main 3-Column Layout Container */}
            <div className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-4 lg:gap-5">

                {/* Column 1: Inventory Catalog */}
                <div className="flex-[3] flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#1c1c1e] shadow-sm overflow-hidden min-h-[350px]">
                    <InventarioSelector onSelect={handleAddItem} fechaEntrega={form.fechaEntrega} />
                </div>

                {/* Column 2: Order Details Form */}
                <div className="flex-[4] flex flex-col h-full bg-white dark:bg-[#1c1c1e] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-y-auto custom-scrollbar min-h-[350px] space-y-6">
                    {/* Sec 1: Cliente */}
                    <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20">
                        <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">👨‍💼 Datos del Cliente</legend>
                        <div className="flex flex-wrap justify-between pt-2">
                            <InputLine label="Nombre" name="clienteNombre" req isHalf />
                            <InputLine label="Teléfono" name="clienteTelefono" req isHalf />
                            <InputLine label="Email" name="clienteEmail" type="email" isHalf />
                            <InputLine label="Tipo de Evento" name="eventoTipo" isHalf />
                        </div>
                    </fieldset>

                    {/* Sec 2: Logistica */}
                    <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20">
                        <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">🚚 Logística</legend>

                        <h4 className="text-sm border-b border-gray-200 dark:border-gray-800 pb-1 mb-2 pt-2 text-gray-500 uppercase tracking-widest font-semibold">Entrega</h4>
                        <div className="flex flex-wrap justify-between">
                            <InputLine label="Fecha" name="fechaEntrega" type="date" req isHalf />
                            <InputLine label="Hora" name="horaEntrega" type="time" req isHalf />
                            <InputLine label="Dirección de Entrega" name="direccionEntrega" req />
                        </div>

                        <h4 className="text-sm border-b border-gray-200 dark:border-gray-800 pb-1 mb-2 mt-2 text-gray-500 uppercase tracking-widest font-semibold">Recolección</h4>
                        <div className="flex flex-wrap justify-between">
                            <InputLine label="Fecha" name="fechaRecoleccion" type="date" req isHalf />
                            <InputLine label="Hora" name="horaRecoleccion" type="time" req isHalf />
                        </div>
                    </fieldset>

                    {/* Sec 3: Facturacion */}
                    <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20 flex flex-col pb-6">
                        <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">🧾 Facturación y Extras</legend>

                        <div className="flex flex-wrap justify-between">
                            <InputLine label="Flete Extra ($)" name="costoFlete" type="number" isHalf />
                            <InputLine label="Descuento ($)" name="descuento" type="number" isHalf />
                        </div>

                        <label className="flex items-center gap-3 mt-2 mb-4 cursor-pointer p-3 bg-white dark:bg-black shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition hover:border-primavera-gold">
                            <input type="checkbox" name="requiereFactura" checked={form.requiereFactura} onChange={handleChange} className="w-5 h-5 accent-primavera-gold" />
                            <span className="font-bold text-gray-800 dark:text-gray-200">Requiere Factura (+16% IVA)</span>
                        </label>

                        {form.requiereFactura && (
                            <div className="flex flex-wrap justify-between animate-fade-in-up bg-white dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4 shadow-inner">
                                <InputLine label="Razón Social" name="razonSocial" req isHalf />
                                <InputLine label="RFC" name="rfc" req isHalf />
                                <InputLine label="Email Factura" name="emailFactura" type="email" req isHalf />
                                <InputLine label="Uso CFDI" name="usoCFDI" isHalf />
                            </div>
                        )}

                        <div className="w-full mt-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Observaciones / Notas</label>
                            <textarea
                                name="notas" value={form.notas} onChange={handleChange}
                                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white outline-none min-h-[80px] focus:ring-2 focus:ring-primavera-gold transition resize-y text-sm"
                                placeholder="Detalles de entrega..."
                            />
                        </div>
                    </fieldset>
                </div>

                {/* Column 3: Cart & Total */}
                <div className="flex-[3] flex flex-col h-full gap-4 min-h-[350px]">
                    {/* Cart Items */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-[#1c1c1e] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[200px]">
                        <div className="flex justify-between items-center mb-3 border-b border-gray-100 dark:border-gray-800 pb-2 shrink-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-md flex items-center gap-2">🛒 Artículos</h3>
                            {form.items.length > 0 && (
                                <button onClick={handleClearCart} className="text-xs text-red-500 hover:text-red-700 font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full transition">
                                    Vaciar Todo
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 pb-2">
                            {form.items.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-8 opacity-50 flex flex-col items-center">
                                    <span className="text-4xl mb-3 grayscale opacity-20">🛒</span>
                                    <span>Selecciona artículos para rentar</span>
                                </div>
                            ) : (
                                form.items.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-black/40 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-2 shadow-sm relative group hover:border-primavera-gold/50 transition-colors">
                                        <button onClick={() => handleRemoveItem(idx)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-sm border border-red-200 dark:border-red-800 z-10" title="Eliminar">
                                            ✖
                                        </button>
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <input
                                                type="text"
                                                value={item.descripcion}
                                                onChange={(e) => updateItemField(idx, 'descripcion', e.target.value)}
                                                className="font-semibold text-sm bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primavera-gold outline-none dark:text-gray-100 transition-colors w-full pb-0.5"
                                                placeholder="Descripción..."
                                            />
                                            <div className="flex flex-wrap justify-between items-center bg-white dark:bg-[#1c1c1e] p-1.5 rounded-md border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                    $ <input
                                                        type="number"
                                                        value={item.precioUnitario}
                                                        onChange={(e) => updateItemField(idx, 'precioUnitario', Number(e.target.value))}
                                                        className="w-14 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primavera-gold outline-none text-gray-900 dark:text-white px-1 font-bold text-xs"
                                                        min="0"
                                                    /> c/u
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-green-600 dark:text-green-400 shrink-0">${item.subtotal.toFixed(2)}</span>
                                                    <div className="flex bg-gray-100 dark:bg-black rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm shrink-0">
                                                        <button type="button" onClick={() => updateItemQuantity(idx, -1)} className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white font-bold text-xs">-</button>
                                                        <span className="px-2 py-0.5 font-bold text-primavera-gold text-xs bg-white dark:bg-[#1c1c1e] border-x border-gray-300 dark:border-gray-700 min-w-[2rem] text-center">{item.cantidad}</span>
                                                        <button type="button" onClick={() => updateItemQuantity(idx, 1)} className="px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white font-bold text-xs">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-900 dark:bg-black p-5 rounded-2xl shadow-xl border border-gray-800 text-white shrink-0 gap-3 flex flex-col">
                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between items-center"><p>Subtotal:</p><p className="font-bold">${subtotal.toFixed(2)}</p></div>
                            {form.costoFlete > 0 && <div className="flex justify-between items-center"><p>🚚 Flete:</p><p className="text-yellow-400 font-bold">+ ${form.costoFlete.toFixed(2)}</p></div>}
                            {form.descuento > 0 && <div className="flex justify-between items-center"><p>🔥 Descuento:</p><p className="text-red-400 font-bold">- ${form.descuento.toFixed(2)}</p></div>}
                            {form.requiereFactura && <div className="flex justify-between items-center pt-2 border-t border-gray-800"><p>IVA (16%):</p><p>${iva.toFixed(2)}</p></div>}
                            <div className="flex justify-between items-end pt-2 mt-2 border-t border-gray-700">
                                <p className="text-gray-400 font-bold uppercase text-xs">Total Final</p>
                                <p className="text-3xl font-extrabold text-green-400">${total.toFixed(2)}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!form.clienteNombre || !form.fechaEntrega || form.items.length === 0}
                            className="w-full py-3 bg-gradient-to-r from-primavera-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-black font-extrabold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isEdit ? '💾 Guardar Edición' : '⚡ Confirmar y Generar'}
                        </button>

                        {(!form.clienteNombre || !form.fechaEntrega || form.items.length === 0) && (
                            <p className="text-center text-[10px] text-red-400/80 m-0">
                                Falta cliente, fecha o artículos.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
