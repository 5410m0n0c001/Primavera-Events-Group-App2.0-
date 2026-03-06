import React, { useState, useMemo } from 'react';
import type { QuoteDraft } from '../../types';

import SmartCategory from './SmartCategory';
import ManualItemForm from './ManualItemForm';
import QuoteBreakdown from './QuoteBreakdown';

// Mock Data for MVP - Replace with API calls
const DATA_CATEGORIES = [
    {
        id: 'cat_packages', title: 'Paquetes de Eventos Oficiales', items: [
            { id: 'pkg_gob', name: 'Paquete Gobernador', price: 900, unit: 'persona', description: 'Venue: Convenciones Presidente. 3 tiempos, Coctel, DJ 8 hrs', category: 'Paquetes' },
            { id: 'pkg_pres', name: 'Paquete Presidente', price: 1100, unit: 'persona', description: 'Venue: Convenciones Presidente. 4 tiempos, Capitán, Grupo Musical', category: 'Paquetes' },
            { id: 'pkg_yolo', name: 'Destino Yolomecatl', price: 850, unit: 'persona', description: 'Venue: Jardín Yolomecatl. Paquete base con locación incluida', category: 'Paquetes' },
            { id: 'pkg_flor', name: 'Esencia Floral', price: 950, unit: 'persona', description: 'Venue: Villa San Gaspar. Boda íntima (Max 200px), Back Fotográfico', category: 'Paquetes' },
            { id: 'pkg_ecues', name: 'Imperial Ecuestre', price: 800, unit: 'persona', description: 'Venue: Jardín Los Caballos. 4 tiempos, DJ Residente, Letras 1.10m', category: 'Paquetes' },
            { id: 'pkg_pura', name: 'Linaje Pura Sangre', price: 1050, unit: 'persona', description: 'Venue: Rancho Los Potrillos. Bodas Charras. Toro Mecánico incluido', category: 'Paquetes' },
            { id: 'pkg_zara', name: 'Armonía Zarabanda', price: 1250, unit: 'persona', description: 'Venue: Quinta Zarabanda. Suite VIP', category: 'Paquetes' },
            { id: 'pkg_vuelo', name: 'Vuelo Esmeralda', price: 1350, unit: 'persona', description: 'Venue: Jardín Tsu Nuum. Hotel 60px', category: 'Paquetes' },
            { id: 'pkg_natur', name: 'Nature\'s Majesty', price: 1150, unit: 'persona', description: 'Venue: Finca Los Isabeles. Hospedaje 14px', category: 'Paquetes' }
        ]
    },
    {
        id: 'cat_photo', title: 'Fotografía y Video', items: [
            { id: 'pho_1', name: 'Bodas: Eternal Promise', price: 9900, unit: 'paquete', description: 'Fotos ilimitadas, álbum 200 fotos, sesión previa', category: 'Foto/Video' },
            { id: 'pho_2', name: 'Bodas: Royal Cinematic', price: 13900, unit: 'paquete', description: '2 cámaras, drone 4K, photobook 100 fotos', category: 'Foto/Video' },
            { id: 'pho_3', name: 'XV: Memoria Clásica', price: 9350, unit: 'paquete', description: '7 hrs continuas, álbum, 100 fotos impresas', category: 'Foto/Video' },
            { id: 'pho_4', name: 'XV: Experiencia Deluxe', price: 10900, unit: 'paquete', description: 'Sesión previa exterior + videoclip', category: 'Foto/Video' },
            { id: 'pho_5', name: 'XV: Cinematic Prestige', price: 13900, unit: 'paquete', description: 'Grabación a 2 cámaras + Drone 4K', category: 'Foto/Video' }
        ]
    },
    {
        id: 'cat_furniture', title: 'Mobiliario Individual', items: [
            { id: 'fur_smi', name: 'Silla cross back miel', price: 45, unit: 'pz', description: 'Madera natural', category: 'Sillas' },
            { id: 'fur_sno', name: 'Silla cross back nogal', price: 45, unit: 'pz', description: 'Madera oscura', category: 'Sillas' },
            { id: 'fur_stb', name: 'Silla tiffany laqueada blanca', price: 35, unit: 'pz', description: 'Elegante', category: 'Sillas' },
            { id: 'fur_std', name: 'Silla tiffany dorada', price: 35, unit: 'pz', description: 'Premium', category: 'Sillas' },
            { id: 'fur_svc', name: 'Silla versalles caoba', price: 40, unit: 'pz', description: 'Clásica', category: 'Sillas' },
            { id: 'fur_sdm', name: 'Silla diana madera', price: 45, unit: 'pz', description: 'Exclusiva', category: 'Sillas' },
            { id: 'fur_spr', name: 'Silla praga', price: 50, unit: 'pz', description: 'Estilo contemporaneo', category: 'Sillas' },
            { id: 'fur_mre', name: 'Mesa redonda (10 personas)', price: 80, unit: 'pz', description: 'Tradicional', category: 'Mesas' },
            { id: 'fur_mtb', name: 'Tablón', price: 70, unit: 'pz', description: '2.44x0.76m', category: 'Mesas' },
            { id: 'fur_mcm', name: 'Mesa cuadrada de madera', price: 90, unit: 'pz', description: 'Madera robusta', category: 'Mesas' },
            { id: 'fur_mrm', name: 'Mesa rectangular tipo mármol', price: 120, unit: 'pz', description: 'Diseño VIP', category: 'Mesas' },
            { id: 'fur_pam', name: 'Periquera alta madera', price: 80, unit: 'pz', description: 'Cocktails', category: 'Salas Lounge' },
            { id: 'fur_pat', name: 'Periquera alta metal', price: 80, unit: 'pz', description: 'Industrial', category: 'Salas Lounge' },
            { id: 'fur_slm', name: 'Sala lounge madera', price: 150, unit: 'set', description: 'Comodidad', category: 'Salas Lounge' },
            { id: 'fur_blc', name: 'Banca larga con respaldo', price: 80, unit: 'pz', description: 'Ceremonias', category: 'Salas Lounge' }
        ]
    },
    {
        id: 'cat_glassware', title: 'Cristalería, Loza y Plaquetería', items: [
            { id: 'gls_cgb', name: 'Copa globo', price: 12, unit: 'pz', description: 'Para bebidas preparadas', category: 'Cristalería' },
            { id: 'gls_cfl', name: 'Copa flauta', price: 12, unit: 'pz', description: 'Para brindis', category: 'Cristalería' },
            { id: 'gls_cvt', name: 'Copa vino tinto', price: 12, unit: 'pz', description: 'Clásica', category: 'Cristalería' },
            { id: 'gls_caz', name: 'Copa de color azul', price: 15, unit: 'pz', description: 'Estilizada', category: 'Cristalería' },
            { id: 'gls_cam', name: 'Copa vino ámbar', price: 15, unit: 'pz', description: 'Vintage', category: 'Cristalería' },
            { id: 'loz_pbc', name: 'Plato base de concha dorado', price: 18, unit: 'pz', description: 'Premium', category: 'Loza' },
            { id: 'loz_pbt', name: 'Plato base talavera', price: 18, unit: 'pz', description: 'Tradicional', category: 'Loza' },
            { id: 'loz_pbg', name: 'Plato base gótico negro', price: 20, unit: 'pz', description: 'Elegante oscuro', category: 'Loza' },
            { id: 'loz_ptc', name: 'Plato trinche cuadrado', price: 12, unit: 'pz', description: 'Minimalista', category: 'Loza' },
            { id: 'cuc_tce', name: 'Trinche dorado acero', price: 15, unit: 'pz', description: 'Para carne o ensalada', category: 'Cuchillería' },
            { id: 'cuc_scd', name: 'Cuchara sopera dorada', price: 15, unit: 'pz', description: 'Vajilla VIP', category: 'Cuchillería' },
            { id: 'cuc_cpn', name: 'Cuchillo dorado carnicero', price: 15, unit: 'pz', description: 'Acero inoxidable', category: 'Cuchillería' }
        ]
    },
    {
        id: 'cat_mantels', title: 'Mantelería y Caminos', items: [
            { id: 'mtl_mbr', name: 'Mantel blanco redondo', price: 40, unit: 'pz', description: 'Para mesas de 10', category: 'Mantelería' },
            { id: 'mtl_cmo', name: 'Cubre mantel organza', price: 25, unit: 'pz', description: 'Varios colores', category: 'Mantelería' },
            { id: 'mtl_fbc', name: 'Faldón / Bambalina', price: 35, unit: 'pz', description: 'Color sólido', category: 'Mantelería' },
            { id: 'mtl_mvl', name: 'Mantel vintage encaje', price: 50, unit: 'pz', description: 'Estilo romántico', category: 'Mantelería' },
            { id: 'cam_ary', name: 'Camino azul rey', price: 15, unit: 'pz', description: 'Tela premium', category: 'Caminos Color' },
            { id: 'cam_ama', name: 'Camino azul marino', price: 15, unit: 'pz', description: 'Clásico', category: 'Caminos Color' },
            { id: 'cam_vbd', name: 'Camino verde bandera', price: 15, unit: 'pz', description: 'Brillante', category: 'Caminos Color' },
            { id: 'cam_rpa', name: 'Camino rojo pasión', price: 15, unit: 'pz', description: 'Romántico', category: 'Caminos Color' },
            { id: 'cam_dor', name: 'Camino dorado u oro', price: 15, unit: 'pz', description: 'VIP', category: 'Caminos Color' },
            { id: 'cam_bgh', name: 'Camino beige/hueso', price: 15, unit: 'pz', description: 'Boho', category: 'Caminos Color' }
        ]
    },
    {
        id: 'cat_structures', title: 'Decoración y Estructuras', items: [
            { id: 'dec_lg1', name: 'Letras Gigantes 1.10m', price: 600, unit: 'set', description: 'Love / XV', category: 'Decoración Iluminada' },
            { id: 'dec_lg8', name: 'Letras Gigantes 1.80m', price: 900, unit: 'set', description: 'Máximo impacto', category: 'Decoración Iluminada' },
            { id: 'dec_cgi', name: 'Corazón Gigante Iluminado', price: 700, unit: 'pz', description: 'Fondo de fotos', category: 'Decoración Iluminada' },
            { id: 'str_por', name: 'Portería perimetral 3x3x2.5', price: 1500, unit: 'pz', description: 'Metálica', category: 'Estructuras Gigantes' },
            { id: 'str_som', name: 'Sombrillas 3m', price: 300, unit: 'pz', description: 'Blanco/Crudo', category: 'Estructuras Gigantes' },
            { id: 'dec_spl', name: 'Sillón Princesa', price: 350, unit: 'pz', description: 'Estilo Imperio', category: 'Decoración Base' },
            { id: 'dec_cbl', name: 'Cabildo madera ceremonia', price: 400, unit: 'pz', description: 'Estilo rústico', category: 'Decoración Base' }
        ]
    },
    {
        id: 'cat_extras', title: 'Extras y Barras', items: [
            { id: 'ext_hmd', name: 'Hielera mediana', price: 100, unit: 'pz', description: 'Básica', category: 'Equipo y Accesorios' },
            { id: 'ext_hrb', name: 'Hielera redonda blanca grande', price: 150, unit: 'pz', description: 'Eventos masivos', category: 'Equipo y Accesorios' },
            { id: 'ext_jcr', name: 'Jarra cristalina de mesa', price: 25, unit: 'pz', description: 'Centro de mesa', category: 'Equipo y Accesorios' },
            { id: 'ext_bar', name: 'Barra Mix (Toppings)', price: 4500, unit: 'servicio', description: 'Dulces y Salados', category: 'Extras' },
            { id: 'ext_shots', name: 'Carrito de Shots', price: 3500, unit: 'servicio', description: 'Con personal', category: 'Extras' },
            { id: 'ext_esqu', name: 'Carrito de Esquites', price: 2500, unit: 'servicio', description: 'Con personal', category: 'Extras' }
        ]
    }
];

import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

const QuoteWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<QuoteDraft>({
        eventName: '',
        guestCount: 100,
        date: '',
        selectedItems: [], // { item: any, quantity: number }
        discount: 0,
        downPaymentPercentage: 30, // Default 30%
        paymentLimitDate: ''
    });
    const [budget, setBudget] = useState(0);
    const [showManualForm, setShowManualForm] = useState(false);

    // Use the centralized calculation hook
    const totals = useQuoteCalculations(draft);

    // Leads Management
    const [showLeads, setShowLeads] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);

    React.useEffect(() => {
        if (showLeads) fetchLeads();
    }, [showLeads]);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/clients');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.filter((c: any) => c.type === 'LEAD'));
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('¿Eliminar este lead?')) return;
        try {
            const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const handleResumeLead = (lead: any) => {
        setDraft(prev => ({
            ...prev,
            eventName: `${lead.firstName} ${lead.lastName}`,
            guestCount: 100 // Default or if captured in lead
        }));
        setShowLeads(false);
        alert(`Lead ${lead.firstName} cargado. Puedes comenzar a cotizar.`);
    };

    const handleEditLead = async (lead: any) => {
        const newName = prompt('Editar Nombre:', lead.firstName);
        if (newName && newName !== lead.firstName) {
            try {
                // Simple update for MVP
                const res = await fetch(`/api/clients/${lead.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...lead, firstName: newName })
                });
                if (res.ok) fetchLeads();
            } catch (e) { console.error(e); }
        }
    };


    // Dynamic Quantity Scaling when guestCount changes
    // This solves the bug: "los datos no son dinámicos al cambiar el número de invitados"
    React.useEffect(() => {
        // Only run if there are selected items to update
        if (draft.selectedItems.length === 0) return;

        setDraft(prev => {
            let hasChanges = false;
            const updatedItems = prev.selectedItems.map(si => {
                const isPerPerson = si.item?.unit?.toLowerCase() === 'persona' || si.item?.unit?.toLowerCase() === 'pax';
                if (!isPerPerson && !si.item?.name?.toLowerCase().includes('mesero') && !si.item?.name?.toLowerCase().includes('mesa')) {
                    return si; // Keep same quantity if it doesn't auto-scale
                }

                // Re-apply smart quantity rule
                let suggestedQty = si.quantity;
                if (isPerPerson) suggestedQty = prev.guestCount;
                if (si.item?.name?.toLowerCase().includes('mesero')) suggestedQty = Math.ceil(prev.guestCount / 15);
                if (si.item?.name?.toLowerCase().includes('mesa') && !si.item?.name?.toLowerCase().includes('principal')) suggestedQty = Math.ceil(prev.guestCount / 10);

                if (suggestedQty !== si.quantity) {
                    hasChanges = true;
                }

                return {
                    ...si,
                    quantity: suggestedQty,
                    cost: suggestedQty * si.unitPrice
                };
            });
            // Prevent infinite loop by returning exact same reference if nothing actually changed
            return hasChanges ? { ...prev, selectedItems: updatedItems } : prev;
        });
    }, [draft.guestCount]); // Solo debe reaccionar al cambio del contador de invitados

    // Capacity Validation checks absolute max venue size.
    const locationCapacity = 800; // Max venue capacity for C.C Presidente
    const isOverCapacity = draft.guestCount > locationCapacity;

    const handleToggleItem = (item: any, quantity: number) => {
        setDraft(prev => {
            const existing = prev.selectedItems.find(i => i.item?.id === item.id);
            if (quantity <= 0) {
                return { ...prev, selectedItems: prev.selectedItems.filter(i => i.item?.id !== item.id) };
            }
            if (existing) {
                return { ...prev, selectedItems: prev.selectedItems.map(i => i.item?.id === item.id ? { ...i, quantity } : i) };
            }
            // Ensure strictly typed and structured QuoteItem
            const newItem = {
                item,
                quantity,
                id: `qi_${Date.now()}_${item.id}`,
                quoteId: 'temp',
                serviceItemId: item.id || 'manual',
                serviceItem: item,
                unitPrice: Number(item.price) || 0,
                cost: (Number(item.price) || 0) * quantity
            };
            return { ...prev, selectedItems: [...prev.selectedItems, newItem as any] };
        });
    };

    const handleAddManualItem = (newItem: any) => {
        handleToggleItem(newItem, 1);
    };

    const handleRemoveItem = (itemId: string) => {
        setDraft(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.filter(i => i.item?.id !== itemId)
        }));
    };

    const handleSaveDraft = async (status: 'DRAFT' | 'ACCEPTED' = 'DRAFT') => {
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: draft.eventName,
                    guestCount: draft.guestCount,
                    date: draft.date,
                    items: draft.selectedItems,
                    totals,
                    status, // Dynamic status
                    discount: draft.discount,
                    downPaymentPercentage: draft.downPaymentPercentage,
                    paymentLimitDate: draft.paymentLimitDate
                })
            });

            if (response.ok) {
                const action = status === 'ACCEPTED' ? 'aprobada y registrada' : 'guardada';
                alert(`Cotización ${action} exitosamente.`);
                resetForm();
            } else {
                const err = await response.json();
                alert('Error al guardar: ' + (err.error || 'Error desconocido'));
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión con el servidor.');
        }
    };

    const resetForm = () => {
        setDraft({
            eventName: '',
            guestCount: 100,
            date: '',
            selectedItems: [],
            discount: 0,
            downPaymentPercentage: 30,
            paymentLimitDate: ''
        });
        setStep(1);
        setBudget(0);
    };

    const handleNextStep = async () => {
        // Validation Step 1
        if (!draft.eventName.trim()) {
            alert('Por favor agrega un Nombre del Evento.');
            return;
        }
        if (!draft.date) {
            alert('Por favor selecciona una Fecha.');
            return;
        }
        if (draft.guestCount <= 0) {
            alert('El número de invitados debe ser mayor a 0.');
            return;
        }

        // Hybrid Validation: Validate with backend before showing final summary -> MOVED TO FINALIZE
        // But we can do basic check here.
        setStep(2);
    };

    const handleFinalize = async () => {
        try {
            // Hybrid Validation: Validate with backend before showing final summary
            const response = await fetch('/api/quotes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: draft.selectedItems,
                    guestCount: draft.guestCount
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid && data.items) {
                    // Update draft with validated items (source of truth)
                    // This updates unitPrices if backend applies rules/corrections
                    setDraft(prev => ({ ...prev, selectedItems: data.items }));
                }
            }
        } catch (e) {
            console.error("Validation warning:", e);
        }
        setStep(3);
    };

    const handleGeneratePDF = async () => {
        const payload = {
            eventName: draft.eventName,
            guestCount: draft.guestCount,
            date: draft.date,
            items: draft.selectedItems.map(i => ({
                name: i.item?.name || 'Item',
                quantity: i.quantity,
                price: Number(i.unitPrice || i.item?.price || 0),
                unit: i.item?.unit || 'pz'
            })),
            totals // Include calculated totals
        };
        try {
            const response = await fetch('/api/quotes/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion-${draft.eventName}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 relative">

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-primavera-gold font-bold mb-2 break-words">
                        Nueva Cotización Inteligente
                    </h1>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-500">Diseña el evento perfecto con cálculos automáticos.</p>
                        <button
                            onClick={() => setShowLeads(true)}
                            className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition flex items-center gap-1"
                        >
                            📋 Leads Pendientes
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex gap-4 mb-8 text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-4 overflow-x-auto">
                    <span className={step === 1 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>1. Evento</span>
                    <span className={step === 2 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>2. Servicios</span>
                    <span className={step === 3 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>3. Finalizar</span>
                </div>

                {step === 1 && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-primavera-gold focus:border-transparent outline-none transition"
                                    placeholder="e.j. Boda Juan y Maria"
                                    value={draft.eventName}
                                    onChange={e => setDraft({ ...draft, eventName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Tentativa</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    value={draft.date}
                                    onChange={e => setDraft({ ...draft, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Número de Invitados</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border font-bold text-lg"
                                    value={draft.guestCount}
                                    onChange={e => setDraft({ ...draft, guestCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Presupuesto Objetivo (Opcional)</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    placeholder="$0.00"
                                    value={budget}
                                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            {/* Financial Settings */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Descuento ($)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="0.00"
                                        value={draft.discount || ''}
                                        onChange={e => setDraft({ ...draft, discount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Anticipo Mínimo (%)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="30"
                                        value={draft.downPaymentPercentage || ''}
                                        onChange={e => setDraft({ ...draft, downPaymentPercentage: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Límite de Pago</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        value={draft.paymentLimitDate || ''}
                                        onChange={e => setDraft({ ...draft, paymentLimitDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={handleNextStep} className="w-full md:w-auto bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Siguiente: Seleccionar Servicios →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="w-full md:w-auto bg-white border border-primavera-gold text-primavera-gold px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 transition flex items-center justify-center gap-2"
                            >
                                + Agregar Elemento Manual
                            </button>
                        </div>

                        {DATA_CATEGORIES.map(cat => (
                            <SmartCategory
                                key={cat.id}
                                title={cat.title}
                                items={cat.items}
                                selectedItems={draft.selectedItems}
                                onToggleItem={handleToggleItem}
                                guestCount={draft.guestCount}
                            />
                        ))}
                        <div className="flex flex-col-reverse md:flex-row justify-between pt-6 gap-4">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium py-2">
                                ← Volver
                            </button>
                            <button onClick={handleFinalize} className="bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Ver Resumen Final →
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="mb-6">
                            <span className="text-6xl">🎉</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">¡Cotización Lista!</h2>
                        <p className="text-gray-600 mb-8">Has configurado un evento para {draft.guestCount} personas.</p>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button onClick={handleGeneratePDF} className="bg-primavera-gold text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition flex items-center justify-center gap-2">
                                <span>📄</span> Descargar PDF
                            </button>
                            <button onClick={() => handleSaveDraft('DRAFT')} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                                Guardar como Borrador
                            </button>
                            <button onClick={() => handleSaveDraft('ACCEPTED')} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2">
                                <span>✅</span> Aprobar y Registrar Evento
                            </button>
                        </div>
                        <button onClick={() => setStep(2)} className="mt-6 text-gray-500 underline text-sm">
                            Volver a editar
                        </button>
                    </div>
                )}

            </div>

            {/* Sidebar Calculator - Replaced by Breakdown Panel */}
            <div className="w-full md:w-96 flex-shrink-0 relative order-first md:order-last">
                <div className="sticky top-6">
                    <QuoteBreakdown
                        draft={draft}
                        onRemove={handleRemoveItem}
                    />

                    {isOverCapacity && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <strong>Capacidad Excedida</strong>
                                <p>Tus recintos soportan un máximo operativo regular de {locationCapacity} personas, pero tienes configurado {draft.guestCount} invitados. Confirme logística.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showManualForm && (
                <ManualItemForm
                    categories={DATA_CATEGORIES.map(c => c.title)}
                    onSave={handleAddManualItem}
                    onClose={() => setShowManualForm(false)}
                />
            )}

            {/* Leads Drawer */}
            {showLeads && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Leads Pendientes</h2>
                            <button onClick={() => setShowLeads(false)} className="text-gray-500 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            {leads.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay leads pendientes.</p>
                            ) : leads.map(lead => (
                                <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                            <p className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pendiente</span>
                                    </div>

                                    <div className="flex gap-2 mt-4 border-t pt-3">
                                        <button
                                            onClick={() => handleResumeLead(lead)}
                                            className="flex-1 bg-primavera-gold text-white px-2 py-1 rounded text-sm font-bold hover:brightness-105"
                                        >
                                            Cotizar
                                        </button>
                                        <button
                                            onClick={() => handleEditLead(lead)}
                                            className="px-3 py-1 border rounded text-sm hover:bg-white"
                                            title="Modificar Nombre"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLead(lead.id)}
                                            className="px-3 py-1 border border-red-200 text-red-500 rounded text-sm hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default QuoteWizard;
