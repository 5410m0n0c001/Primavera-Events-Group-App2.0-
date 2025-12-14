import React, { useState, useEffect, useRef } from 'react';
import { LAYOUT_CATEGORIES, type LayoutItemConfig } from '../../config/layoutConfig';

// Types
interface TimelineItem {
    id: string;
    time: string;
    description: string;
    order: number;
}

interface LayoutObject {
    id: string;
    type: string; // Dynamic type from config
    x: number;
    y: number;
    label: string;
    width: number;
    height: number;
    shape: 'rect' | 'circle' | 'rounded';
    colorClass: string;
}

const ProductionDashboard: React.FC = () => {
    const [view, setView] = useState<'layout' | 'timeline'>('layout');

    // --- TIMELINE STATE ---
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [newItemTime, setNewItemTime] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');

    // --- LAYOUT STATE ---
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([
        { id: '1', type: 'stage-main', x: 300, y: 50, label: 'Pista Principal', width: 150, height: 80, shape: 'rect', colorClass: 'bg-gray-800 text-white' },
        { id: '2', type: 'table-wedding', x: 320, y: 180, label: 'Mesa Novios', width: 100, height: 50, shape: 'rounded', colorClass: 'bg-yellow-100 border-yellow-500' },
        { id: '3', type: 'table-round', x: 200, y: 300, label: 'Fam. Novio', width: 60, height: 60, shape: 'circle', colorClass: 'bg-blue-100 border-blue-400' },
        { id: '4', type: 'table-round', x: 500, y: 300, label: 'Fam. Novia', width: 60, height: 60, shape: 'circle', colorClass: 'bg-blue-100 border-blue-400' },
        { id: '5', type: 'dj-booth', x: 50, y: 50, label: 'DJ', width: 50, height: 30, shape: 'rect', colorClass: 'bg-black text-white' }
    ]);
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragItemConfig, setDragItemConfig] = useState<LayoutItemConfig | null>(null);

    // Canvas & Custom Item State
    const [canvasWidth, setCanvasWidth] = useState(1200);
    const [canvasHeight, setCanvasHeight] = useState(800);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customLabel, setCustomLabel] = useState('');
    const [customWidth, setCustomWidth] = useState(50);
    const [customHeight, setCustomHeight] = useState(50);

    const canvasRef = useRef<HTMLDivElement>(null);

    // MOCK DATA LOADING
    useEffect(() => {
        if (view === 'timeline') {
            // fetch timeline...
        }
    }, [view]);

    // KEYBOARD DELETE HANDLER
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                // Ignore if typing in an input
                if (document.activeElement?.tagName === 'INPUT') return;
                deleteSelectedObject();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);

    // --- TIMELINE HANDLERS ---
    const addTimelineItem = () => {
        if (!newItemTime || !newItemDesc) return;
        const newItem: TimelineItem = {
            id: Date.now().toString(),
            time: newItemTime,
            description: newItemDesc,
            order: timelineItems.length + 1
        };
        setTimelineItems([...timelineItems, newItem].sort((a, b) => a.time.localeCompare(b.time)));
        setNewItemTime(''); setNewItemDesc('');
    };

    // --- LAYOUT HANDLERS ---

    const addLayoutObject = (config: LayoutItemConfig) => {
        // Random pos within 200px range of center to avoid stacking
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const randomOffsetX = (Math.random() - 0.5) * 200;
        const randomOffsetY = (Math.random() - 0.5) * 200;

        const newObj: LayoutObject = {
            id: Date.now().toString(),
            type: config.type,
            x: Math.max(0, Math.min(centerX + randomOffsetX, canvasWidth - 50)),
            y: Math.max(0, Math.min(centerY + randomOffsetY, canvasHeight - 50)),
            label: config.label,
            width: config.width,
            height: config.height,
            shape: config.shape,
            colorClass: config.colorClass
        };
        setLayoutObjects([...layoutObjects, newObj]);
    };

    const addCustomObject = () => {
        if (!customLabel.trim()) {
            alert("Por favor ingresa un nombre para el elemento.");
            return;
        }

        const newObj: LayoutObject = {
            id: Date.now().toString(),
            type: 'custom',
            x: canvasWidth / 2,
            y: canvasHeight / 2,
            label: customLabel,
            width: Number(customWidth) || 50,
            height: Number(customHeight) || 50,
            shape: 'rect',
            colorClass: 'bg-white border-2 border-black dark:border-white text-black dark:text-white'
        };
        setLayoutObjects([...layoutObjects, newObj]);
        setCustomLabel(''); // Reset input
    }

    const deleteSelectedObject = () => {
        if (!selectedId) return;
        setLayoutObjects(prev => prev.filter(obj => obj.id !== selectedId));
        setSelectedId(null);
    };

    // 2. Drag Start (Existing Object)
    const handleDragStartObject = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setDragId(id);
        setDragItemConfig(null);
        setSelectedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    // 3. Drag Start (New Item from Sidebar)
    const handleDragStartNew = (e: React.DragEvent, config: LayoutItemConfig) => {
        setDragItemConfig(config);
        setDragId(null);
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = dragItemConfig ? "copy" : "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        // Constrain to bounds
        const constrainedX = Math.max(0, Math.min(x, canvasWidth - 10));
        const constrainedY = Math.max(0, Math.min(y, canvasHeight - 10));

        if (dragItemConfig) {
            // Drop New Item
            const newObj: LayoutObject = {
                id: Date.now().toString(),
                type: dragItemConfig.type,
                x: constrainedX - (dragItemConfig.width / 2),
                y: constrainedY - (dragItemConfig.height / 2),
                label: dragItemConfig.label,
                width: dragItemConfig.width,
                height: dragItemConfig.height,
                shape: dragItemConfig.shape,
                colorClass: dragItemConfig.colorClass
            };
            setLayoutObjects(prev => [...prev, newObj]);
            setDragItemConfig(null);
        } else if (dragId) {
            // Move Existing Item
            const existing = layoutObjects.find(o => o.id === dragId);
            if (existing) {
                setLayoutObjects(prev => prev.map(obj =>
                    obj.id === dragId ? {
                        ...obj,
                        x: constrainedX - (obj.width / 2),
                        y: constrainedY - (obj.height / 2)
                    } : obj
                ));
            }
            setDragId(null);
        }
    };

    // --- TOUCH HANDLERS (Mobile Support) ---
    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
    };

    const handleTouchMove = (e: React.TouchEvent, id: string) => {
        e.stopPropagation();
        if (!canvasRef.current) return;

        const touch = e.touches[0];
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = touch.clientX - canvasRect.left;
        const y = touch.clientY - canvasRect.top;

        // Constrain
        const constrainedX = Math.max(0, Math.min(x, canvasWidth));
        const constrainedY = Math.max(0, Math.min(y, canvasHeight));

        setLayoutObjects(prev => prev.map(obj =>
            obj.id === id ? { ...obj, x: constrainedX - (obj.width / 2), y: constrainedY - (obj.height / 2) } : obj
        ));
    };

    const getShapeStyle = (shape: string): string => {
        if (shape === 'circle') return 'rounded-full';
        if (shape === 'rounded') return 'rounded-xl';
        return 'rounded-md';
    }

    return (
        <div className="p-4 md:p-8 max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in-up">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Producción y Logística</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Diseña el plano del evento y coordina cada momento.</p>

            <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-white/10 pb-1 shrink-0">
                <button
                    onClick={() => setView('layout')}
                    className={`text-sm font-bold pb-3 px-2 transition-all duration-300 relative ${view === 'layout'
                        ? 'text-primavera-gold'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                >
                    Diseñador de Planos
                    {view === 'layout' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primavera-gold rounded-full transition-all"></span>}
                </button>
                <button
                    onClick={() => setView('timeline')}
                    className={`text-sm font-bold pb-3 px-2 transition-all duration-300 relative ${view === 'timeline'
                        ? 'text-primavera-gold'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                >
                    Minuto a Minuto
                    {view === 'timeline' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primavera-gold rounded-full transition-all"></span>}
                </button>
            </div>

            {view === 'layout' && (
                <div className="flex-grow flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                    {/* Toolbar - FIXED STRUCTURE */}
                    <div className="w-full md:w-80 glass-panel flex flex-col h-full overflow-hidden shrink-0 dark:bg-[#1c1c1e]/90 dark:border-white/10 p-0">

                        {/* 1. FIXED HEADER: Configuration & Custom Item & Delete */}
                        <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm z-10 shrink-0 space-y-5">
                            {/* Canvas Size */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Tamaño Lienzo</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <label className="absolute -top-1.5 left-2 text-[8px] bg-white dark:bg-[#2c2c2e] px-1 text-gray-400 font-bold">ANCHO</label>
                                        <input type="number" className="apple-input py-1 text-sm h-8" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-1.5 left-2 text-[8px] bg-white dark:bg-[#2c2c2e] px-1 text-gray-400 font-bold">ALTO</label>
                                        <input type="number" className="apple-input py-1 text-sm h-8" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>

                            {/* Custom Object Creator */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Crear Elemento</h3>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre (ej. Mesa Dulces)"
                                        className="apple-input py-1 text-sm h-8 w-full"
                                        value={customLabel}
                                        onChange={(e) => setCustomLabel(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="number" placeholder="W" className="apple-input py-1 text-sm h-8" value={customWidth} onChange={(e) => setCustomWidth(Number(e.target.value))} />
                                        <input type="number" placeholder="H" className="apple-input py-1 text-sm h-8" value={customHeight} onChange={(e) => setCustomHeight(Number(e.target.value))} />
                                    </div>
                                    <button
                                        onClick={addCustomObject}
                                        className="w-full py-2 bg-primavera-gold text-white rounded-lg text-xs font-bold shadow hover:bg-yellow-600 transition-colors"
                                    >
                                        + AGREGAR
                                    </button>
                                </div>
                            </div>

                            {/* Delete Button (Moved here per request) */}
                            <div>
                                <button
                                    onClick={deleteSelectedObject}
                                    disabled={!selectedId}
                                    className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${selectedId ? 'bg-red-500 text-white shadow hover:bg-red-600' : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {selectedId ? 'ELIMINAR SELECCIONADO' : 'SELECCIONA PARA ELIMINAR'}
                                </button>
                            </div>
                        </div>

                        {/* 2. SCROLLABLE BODY: Categories (SEPARATE MODULE) */}
                        <div className="flex-grow overflow-hidden p-4">
                            <div className="h-full flex flex-col bg-white dark:bg-black/30 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                                <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                    <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-widest text-center">Catálogo de Elementos</h3>
                                </div>
                                <div className="flex-grow overflow-y-auto p-3 custom-scrollbar space-y-6">
                                    {LAYOUT_CATEGORIES.map(cat => (
                                        <div key={cat.id}>
                                            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 sticky top-0 bg-white/95 dark:bg-[#1c1c1e] py-1 z-10">{cat.title}</h3>
                                            <div className="grid grid-cols-3 gap-2">
                                                {cat.items.map(item => (
                                                    <div
                                                        key={item.type}
                                                        draggable
                                                        onDragStart={(e) => handleDragStartNew(e, item)}
                                                        onClick={() => addLayoutObject(item)}
                                                        className="p-1 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-lg cursor-pointer text-center group flex flex-col items-center justify-center h-20 relative"
                                                        title={item.label}
                                                    >
                                                        <div className={`mb-1 border border-black/10 dark:border-white/20 ${getShapeStyle(item.shape)} ${item.colorClass} shadow-sm`}
                                                            style={{ width: Math.min(item.width, 24), height: Math.min(item.height, 24) }}>
                                                        </div>
                                                        <span className="font-medium text-[7px] leading-tight text-gray-600 dark:text-gray-300 line-clamp-2">{item.label}</span>
                                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 p-1">+</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. FIXED FOOTER: Global Actions */}
                        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0 z-20 flex flex-col items-center">
                            <button className="w-full btn-primary bg-gradient-to-r from-green-600 to-green-500 border-none shadow-green-500/30 text-sm py-3 mb-2">
                                Guardar Diseño Completo
                            </button>
                            <span className="text-[10px] text-red-500 font-bold">v2.2.0 (Emergency Fix)</span>
                        </div>
                    </div>

                    {/* Canvas Container (Scrollable) */}
                    <div className="flex-grow bg-[#F5F5F7] dark:bg-black rounded-2xl shadow-inner border border-black/5 dark:border-white/5 overflow-auto relative p-8 flex items-center justify-center custom-scrollbar">
                        {/* Actual Canvas */}
                        <div
                            ref={canvasRef}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={(e) => {
                                // Deselect if clicking on empty canvas area
                                if (e.target === canvasRef.current) setSelectedId(null);
                            }}
                            className="bg-white dark:bg-[#111] shadow-2xl relative transition-all duration-300 rounded-lg"
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                backgroundImage: `radial-gradient(var(--dot-color, #cbd5e1) 1px, transparent 1px)`,
                                backgroundSize: '24px 24px',
                                minWidth: canvasWidth, // Ensure it doesn't shrink
                                minHeight: canvasHeight
                            }}
                        >
                            <style>{`
                                .dark .bg-white { --dot-color: #333; }
                            `}</style>

                            <div className="absolute -top-8 left-0 text-xs font-bold text-gray-400 uppercase tracking-widest select-none whitespace-nowrap">
                                Canvas: {canvasWidth}px x {canvasHeight}px
                            </div>

                            {layoutObjects.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                                    <div className="w-24 h-24 mb-4 rounded-3xl bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        <span className="text-4xl">✨</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-400 dark:text-gray-600">Arrastra elementos aquí</div>
                                </div>
                            )}

                            {layoutObjects.map(obj => (
                                <div
                                    key={obj.id}
                                    draggable
                                    onDragStart={(e) => handleDragStartObject(e, obj.id)}
                                    // Touch Events
                                    onTouchStart={(e) => handleTouchStart(e, obj.id)}
                                    onTouchMove={(e) => handleTouchMove(e, obj.id)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedId(obj.id);
                                    }}
                                    className={`absolute cursor-move flex items-center justify-center text-xs font-bold transition-all hover:scale-105 active:scale-95 border-2 text-center overflow-hidden shadow-lg backdrop-blur-sm ${getShapeStyle(obj.shape)} ${obj.colorClass} ${selectedId === obj.id ? 'ring-4 ring-primavera-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] z-50 scale-105' : ''}`}
                                    style={{
                                        left: obj.x,
                                        top: obj.y,
                                        width: obj.width,
                                        height: obj.height
                                    }}
                                >
                                    {obj.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'timeline' && (
                <div className="apple-card p-8 rounded-3xl shadow-xl flex-grow dark:bg-[#1c1c1e] animate-fade-in-up">
                    <div className="flex gap-4 mb-8 items-end bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div className="w-48">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hora</label>
                            <input type="time" className="apple-input bg-white dark:bg-black/50" value={newItemTime} onChange={e => setNewItemTime(e.target.value)} />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Actividad</label>
                            <input type="text" className="apple-input bg-white dark:bg-black/50" placeholder="Ej. Entrada de Novios con pirotecnia..." value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
                        </div>
                        <button onClick={addTimelineItem} className="btn-primary h-[50px] px-8 bg-gradient-to-r from-primavera-gold to-[#B38728] border-none shadow-glow">
                            AGREGAR
                        </button>
                    </div>

                    <div className="space-y-6 relative pl-8 border-l-2 border-dashed border-gray-200 dark:border-white/10 ml-4">
                        {timelineItems.map((item, idx) => (
                            <div key={item.id} className="relative group">
                                <div className="absolute -left-[43px] bg-white dark:bg-[#1c1c1e] text-primavera-gold w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-gray-100 dark:ring-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {idx + 1}
                                </div>
                                <div className="glass-panel p-6 flex justify-between items-center group-hover:border-primavera-gold/30 transition-colors bg-white dark:bg-[#2c2c2e]">
                                    <div className="flex items-center gap-6">
                                        <div className="text-2xl font-display font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-black/30 px-4 py-2 rounded-lg">{item.time}</div>
                                        <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">{item.description}</div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 transition-colors p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {timelineItems.length === 0 && <div className="text-gray-400 dark:text-gray-600 italic text-center py-12">No hay actividades programadas aún.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionDashboard;
