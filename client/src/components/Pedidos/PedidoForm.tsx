import React, { useState, useEffect } from 'react';
import InventarioSelector from './InventarioSelector';

interface PedidoFormProps {
    pedidoId: string | null;
    onClose: () => void;
    onSave: () => void;
}

const InputLine = ({ label, name, type = "text", req = false, isHalf = false, value, onChange }: any) => (
    <div className={`flex flex-col mb-4 ${isHalf ? 'w-full md:w-[48%]' : 'w-full'}`}>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {label} {req && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type} name={name}
            value={value || ''}
            onChange={onChange}
            required={req}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primavera-gold outline-none transition"
        />
    </div>
);

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
    const [showPreview, setShowPreview] = useState(false);

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

    const isFormValid = !!(form.clienteNombre && form.clienteTelefono && form.direccionEntrega && form.fechaEntrega && form.items.length > 0);

    const handleOpenPreview = () => {
        if (!isFormValid) {
            const missing = [];
            if (!form.clienteNombre) missing.push("Nombre");
            if (!form.clienteTelefono) missing.push("Teléfono");
            if (!form.direccionEntrega) missing.push("Dir. Entrega");
            if (form.items.length === 0) missing.push("1 artículo min");

            alert("Por favor, completa los siguientes datos requeridos:\n- " + missing.join("\n- "));
            return;
        }
        setShowPreview(true);
    };

    if (loading) return <div className="p-8 text-center text-white">Cargando...</div>;

    if (loading) return <div className="p-8 text-center text-white">Cargando...</div>;

    const addedItemsRecord = form.items.reduce((acc: any, item: any) => {
        acc[item.inventarioId] = (acc[item.inventarioId] || 0) + item.cantidad;
        return acc;
    }, {} as Record<string, number>);

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

            {/* MODALS */}
            {/* Modal de Catálogo de Inventario */}
            {mobileTab === 'catalogo' && false /* we will use explicitly a new state if needed, but let's just use mobileTab for modals for now to avoid adding state */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center transition-opacity ${mobileTab === 'catalogo' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white dark:bg-[#1c1c1e] w-[95vw] md:w-[80vw] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-gray-200 dark:border-white/10">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/40">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">📦 Agregar al Pedido</h3>
                        <button onClick={() => setMobileTab('carrito')} className="text-gray-500 hover:text-red-500 transition px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-medium">Cerrar Catálogo</button>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <InventarioSelector onSelect={(item) => { handleAddItem(item); }} fechaEntrega={form.fechaEntrega} addedItems={addedItemsRecord} />
                    </div>
                </div>
            </div>

            {/* Modal de Datos del Cliente */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white dark:bg-[#1c1c1e] w-[95vw] md:w-[60vw] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-gray-200 dark:border-white/10">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/40 shrink-0">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">👨‍💼 Datos de Operación</h3>
                        <button onClick={() => setStep(1)} className="text-gray-500 hover:text-primavera-gold transition px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-medium">✔ Guardar Datos</button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        {/* Sec 1: Cliente */}
                        <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20">
                            <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">Datos del Cliente</legend>
                            <div className="flex flex-wrap justify-between pt-2">
                                <InputLine label="Nombre" name="clienteNombre" value={form.clienteNombre} onChange={handleChange} req isHalf />
                                <InputLine label="Teléfono" name="clienteTelefono" value={form.clienteTelefono} onChange={handleChange} req isHalf />
                                <InputLine label="Email" name="clienteEmail" type="email" value={form.clienteEmail} onChange={handleChange} isHalf />
                                <InputLine label="Tipo de Evento" name="eventoTipo" value={form.eventoTipo} onChange={handleChange} isHalf />
                            </div>
                        </fieldset>

                        {/* Sec 2: Logistica */}
                        <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20">
                            <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">Logística</legend>

                            <h4 className="text-sm border-b border-gray-200 dark:border-gray-800 pb-1 mb-2 pt-2 text-gray-500 uppercase tracking-widest font-semibold">Entrega</h4>
                            <div className="flex flex-wrap justify-between">
                                <InputLine label="Fecha" name="fechaEntrega" type="date" value={form.fechaEntrega} onChange={handleChange} req isHalf />
                                <InputLine label="Hora" name="horaEntrega" type="time" value={form.horaEntrega} onChange={handleChange} req isHalf />
                                <InputLine label="Dirección de Entrega" name="direccionEntrega" value={form.direccionEntrega} onChange={handleChange} req />
                            </div>

                            <h4 className="text-sm border-b border-gray-200 dark:border-gray-800 pb-1 mb-2 mt-2 text-gray-500 uppercase tracking-widest font-semibold">Recolección</h4>
                            <div className="flex flex-wrap justify-between">
                                <InputLine label="Fecha" name="fechaRecoleccion" type="date" value={form.fechaRecoleccion} onChange={handleChange} req isHalf />
                                <InputLine label="Hora" name="horaRecoleccion" type="time" value={form.horaRecoleccion} onChange={handleChange} req isHalf />
                            </div>
                        </fieldset>

                        {/* Sec 3: Facturacion */}
                        <fieldset className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/20 flex flex-col pb-6">
                            <legend className="px-3 font-bold text-primavera-gold uppercase text-sm tracking-wide bg-white dark:bg-[#1c1c1e] rounded-full border border-gray-200 dark:border-gray-800 py-1">Facturación y Notas</legend>

                            <div className="flex flex-wrap justify-between">
                                <InputLine label="Costo de Flete Extra ($)" name="costoFlete" type="number" value={form.costoFlete} onChange={handleChange} isHalf />
                                <InputLine label="Descuento Autorizado ($)" name="descuento" type="number" value={form.descuento} onChange={handleChange} isHalf />
                            </div>

                            <label className="flex items-center gap-3 mt-2 mb-4 cursor-pointer p-3 bg-white dark:bg-black shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition hover:border-primavera-gold w-fit">
                                <input type="checkbox" name="requiereFactura" checked={form.requiereFactura} onChange={handleChange} className="w-5 h-5 accent-primavera-gold" />
                                <span className="font-bold text-gray-800 dark:text-gray-200">Requiere Factura (+16% IVA)</span>
                            </label>

                            {form.requiereFactura && (
                                <div className="flex flex-wrap justify-between animate-fade-in-up bg-white dark:bg-black/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mb-4 shadow-inner">
                                    <InputLine label="Razón Social" name="razonSocial" value={form.razonSocial} onChange={handleChange} req isHalf />
                                    <InputLine label="RFC" name="rfc" value={form.rfc} onChange={handleChange} req isHalf />
                                    <InputLine label="Email Factura" name="emailFactura" type="email" value={form.emailFactura} onChange={handleChange} req isHalf />
                                    <InputLine label="Uso CFDI" name="usoCFDI" value={form.usoCFDI} onChange={handleChange} isHalf />
                                </div>
                            )}

                            <div className="w-full mt-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Observaciones / Notas del Pedido</label>
                                <textarea
                                    name="notas" value={form.notas} onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50 text-gray-900 dark:text-white outline-none min-h-[80px] focus:ring-2 focus:ring-primavera-gold transition resize-y text-sm"
                                    placeholder="Detalles sobre entrega, montaje, etc..."
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>

            {/* Modal de Previsualización (Paso Final) */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4 transition-opacity ${showPreview ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white dark:bg-[#121212] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative border border-primavera-gold/30">
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-900 to-black text-white shrink-0 border-b border-white/10">
                        <div>
                            <h3 className="font-extrabold font-serif text-3xl text-primavera-gold tracking-wide">Previsualización Oficial</h3>
                            <p className="text-sm text-gray-400 mt-1">Revisa que todos los datos y el total sean correctos antes de enviar el pedido al sistema.</p>
                        </div>
                        <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white px-4 py-2 border border-gray-700 hover:border-gray-500 rounded-lg transition font-medium">Volver a Editar</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8 text-gray-800 dark:text-gray-200">
                        {/* Preview Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">1. Cliente</h4>
                                <ul className="space-y-2 text-lg">
                                    <li><span className="font-semibold">{form.clienteNombre}</span></li>
                                    <li className="flex items-center gap-2">📞 {form.clienteTelefono}</li>
                                    {form.clienteEmail && <li className="flex items-center gap-2 text-sm text-gray-500">✉️ {form.clienteEmail}</li>}
                                    {form.eventoTipo && <li className="mt-2 text-sm"><span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md">Evento: {form.eventoTipo}</span></li>}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">2. Logística</h4>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-blue-600 dark:text-blue-400 font-bold mb-1">🚚 Entrega</p>
                                        <p>{form.fechaEntrega} a las {form.horaEntrega}</p>
                                        <p className="mt-1 flex items-start gap-1"><span className="text-lg leading-none">📍</span> <span className="font-medium text-base">{form.direccionEntrega}</span></p>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
                                        <p className="text-orange-600 dark:text-orange-400 font-bold mb-1">📦 Recolección</p>
                                        <p>{form.fechaRecoleccion} a las {form.horaRecoleccion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-xs mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">3. Artículos Seleccionados ({form.items.length})</h4>
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs text-gray-400 border-b border-gray-200 dark:border-white/10">
                                        <tr>
                                            <th className="pb-2 font-semibold">Cant</th>
                                            <th className="pb-2 font-semibold">Descripción</th>
                                            <th className="pb-2 font-semibold text-right">P. Unitario</th>
                                            <th className="pb-2 font-semibold text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {form.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-3 font-bold text-primavera-gold">{item.cantidad}</td>
                                                <td className="py-3">{item.descripcion}</td>
                                                <td className="py-3 text-right text-gray-500">${item.precioUnitario.toFixed(2)}</td>
                                                <td className="py-3 font-semibold text-right">${item.subtotal.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {form.notas && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-4 text-sm text-yellow-800 dark:text-yellow-200">
                                <span className="font-bold uppercase tracking-widest text-xs block mb-1">Notas del Pedido:</span>
                                {form.notas}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-100 dark:bg-[#1a1a1a] p-6 md:p-8 shrink-0 border-t border-gray-300 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="w-full md:w-auto flex-1 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between items-center md:max-w-xs"><p>Suma Artículos:</p><p className="font-semibold text-gray-800 dark:text-gray-200">${subtotal.toFixed(2)}</p></div>
                            {form.costoFlete > 0 && <div className="flex justify-between items-center md:max-w-xs"><p>🚚 Flete Autorizado:</p><p className="font-semibold text-gray-800 dark:text-gray-200">+ ${form.costoFlete.toFixed(2)}</p></div>}
                            {form.descuento > 0 && <div className="flex justify-between items-center md:max-w-xs text-red-500"><p>🔥 Descuento:</p><p className="font-semibold">- ${form.descuento.toFixed(2)}</p></div>}
                            {form.requiereFactura && <div className="flex justify-between items-center md:max-w-xs border-t border-gray-300 dark:border-gray-700 pt-2"><p>IVA (16%):</p><p className="font-semibold text-gray-800 dark:text-gray-200">${iva.toFixed(2)}</p></div>}
                        </div>

                        <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end gap-4 bg-white dark:bg-black p-4 md:p-6 rounded-2xl border border-primavera-gold/30 shadow-lg">
                            <div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] mb-1">TOTAL OFICIAL A PAGAR</p>
                                <p className="text-5xl font-black text-green-600 dark:text-green-400 tracking-tighter leading-none">${total.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-2 py-4 px-8 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-400 hover:to-green-300 text-black font-extrabold text-lg rounded-xl transition-all shadow-lg hover:shadow-green-500/50 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                ⚡ Confirmar y Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN VIEW - Streamlined */}
            <div className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-6 lg:gap-8">

                {/* Center Column: Added Items List (Action Center) */}
                <div className="flex-[5] flex flex-col h-full gap-3 min-h-[300px] overflow-hidden">
                    <div className="flex gap-3 mb-1 shrink-0">
                        <button
                            onClick={() => setMobileTab('catalogo')}
                            className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-2 md:py-3 rounded-lg font-bold text-sm md:text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-2"
                        >
                            📦 + Añadir Mobiliario
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="flex-1 bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 py-2 md:py-3 rounded-lg font-bold text-sm md:text-base hover:border-primavera-gold transition shadow-sm flex items-center justify-center gap-2"
                        >
                            👤 Datos de Cliente
                            {form.clienteNombre && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-1 md:ml-2">OK</span>}
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col bg-white dark:bg-[#1c1c1e] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-0">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 shrink-0">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">Lista de Artículos del Pedido</h3>
                                <p className="text-sm text-gray-500">Puedes modificar cantidades y precios directamente aquí.</p>
                            </div>
                            {form.items.length > 0 && (
                                <button onClick={handleClearCart} className="text-sm text-red-500 hover:text-red-700 font-bold bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg transition">
                                    Vaciar Lista
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                            {form.items.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm h-full flex flex-col items-center justify-center opacity-50">
                                    <span className="text-6xl mb-4 grayscale opacity-20">📋</span>
                                    <span className="text-lg">Tu lista está vacía.</span>
                                    <span>Haz clic en "Agregar Artículos del Catálogo" para comenzar.</span>
                                </div>
                            ) : (
                                form.items.map((item, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-black/40 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm group hover:border-primavera-gold/50 transition-colors">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <input
                                                type="text"
                                                value={item.descripcion}
                                                onChange={(e) => updateItemField(idx, 'descripcion', e.target.value)}
                                                className="font-bold text-lg bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primavera-gold outline-none dark:text-gray-100 transition-colors w-full pb-1"
                                                placeholder="Descripción del artículo..."
                                            />
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-1">
                                                Costo unitario: $ <input
                                                    type="number"
                                                    value={item.precioUnitario}
                                                    onChange={(e) => updateItemField(idx, 'precioUnitario', Number(e.target.value))}
                                                    className="w-20 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primavera-gold outline-none text-gray-900 dark:text-white px-1 font-bold text-sm"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:justify-end">
                                            <div className="flex bg-white dark:bg-black rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm shrink-0">
                                                <button type="button" onClick={() => updateItemQuantity(idx, -1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition dark:text-white font-bold text-lg">-</button>
                                                <span className="px-4 py-2 font-bold text-primavera-gold text-lg bg-gray-50 dark:bg-[#1c1c1e] border-x border-gray-300 dark:border-gray-700 min-w-[3rem] text-center">{item.cantidad}</span>
                                                <button type="button" onClick={() => updateItemQuantity(idx, 1)} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition dark:text-white font-bold text-lg">+</button>
                                            </div>

                                            <div className="text-right min-w-[100px]">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Subtotal</p>
                                                <span className="font-bold text-xl text-green-600 dark:text-green-400">${item.subtotal.toFixed(2)}</span>
                                            </div>

                                            <button onClick={() => handleRemoveItem(idx)} className="bg-red-50 dark:bg-red-900/20 text-red-500 hover:text-white hover:bg-red-500 p-3 rounded-lg transition" title="Eliminar">
                                                ✖
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Summary & Checkout */}
                <div className="flex-[2.5] flex flex-col h-full min-h-[300px] overflow-hidden">
                    <div className="bg-gray-900 dark:bg-black p-4 md:p-5 rounded-xl shadow-xl border border-gray-800 text-white flex flex-col h-full overflow-y-auto custom-scrollbar min-h-0">
                        <h3 className="font-bold text-primavera-gold uppercase text-[13px] tracking-widest mb-4 border-b border-gray-800 pb-2 flex items-center gap-2 shrink-0">
                            🧾 Resumen del Pedido
                        </h3>

                        {/* Client Mini-Summary */}
                        <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10 shrink-0">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10 pb-1 mb-1">Cliente Asignado</p>
                            {form.clienteNombre ? (
                                <div>
                                    <p className="font-bold text-lg">{form.clienteNombre}</p>
                                    <p className="text-sm text-gray-300">{form.fechaEntrega} • {form.horaEntrega}</p>
                                </div>
                            ) : (
                                <div className="text-yellow-500/80 text-sm font-medium flex items-center gap-2">
                                    ⚠️ Faltan datos del cliente
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 text-sm text-gray-300 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
                            <div className="flex justify-between items-center"><p>Subtotal de Art.</p><p className="font-bold">${subtotal.toFixed(2)}</p></div>
                            {form.costoFlete > 0 && <div className="flex justify-between items-center bg-gray-800/50 p-2 rounded"><p>🚚 Flete:</p><p className="text-yellow-400 font-bold">+ ${form.costoFlete.toFixed(2)}</p></div>}
                            {form.descuento > 0 && <div className="flex justify-between items-center bg-red-900/20 p-2 rounded border border-red-900/30"><p>🔥 DTO:</p><p className="text-red-400 font-bold">- ${form.descuento.toFixed(2)}</p></div>}
                            {form.requiereFactura && <div className="flex justify-between items-center pt-2 border-t border-gray-800"><p>IVA (16%):</p><p>${iva.toFixed(2)}</p></div>}
                        </div>

                        <div className="shrink-0 mt-2 bg-gray-900 pt-2 border-t border-gray-700">
                            <div className="flex justify-between items-end mb-4">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Oficial</p>
                                <p className="text-3xl font-extrabold text-green-400 tracking-tight leading-none">${total.toFixed(2)}</p>
                            </div>

                            <button
                                onClick={handleOpenPreview}
                                className={`w-full py-3 font-extrabold text-sm md:text-base rounded-lg transition-all flex items-center justify-center gap-2 
                                    ${isFormValid
                                        ? 'bg-white text-black hover:bg-gray-100 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-[0.98]'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600'
                                    }`}
                            >
                                🔍 Revisar Pedido
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
