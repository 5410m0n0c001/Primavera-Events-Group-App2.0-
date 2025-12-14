import React, { useState, useEffect, useRef } from 'react';

// Types
interface TimelineItem {
    id: string;
    time: string;
    description: string;
    order: number;
}

interface LayoutObject {
    id: string;
    type: 'table-round' | 'table-square' | 'table-main-wedding' | 'table-main-xv' | 'chair' | 'stage' | 'bar' | 'cocktail-table' | 'lounge' | 'dj-booth' | 'sound-area' | 'kitchen-cold' | 'kitchen-hot' | 'restroom' | 'garden-area' | 'tent';
    x: number;
    y: number;
    label: string;
}

const ProductionDashboard: React.FC = () => {
    const [view, setView] = useState<'layout' | 'timeline'>('layout');

    // --- TIMELINE STATE ---
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [newItemTime, setNewItemTime] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');

    // --- LAYOUT STATE ---
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([
        { id: '1', type: 'stage', x: 300, y: 50, label: 'Pista Principal' },
        { id: '2', type: 'table-main-wedding', x: 320, y: 180, label: 'Mesa Novios' },
        { id: '3', type: 'table-round', x: 200, y: 300, label: 'Fam. Novio' },
        { id: '4', type: 'table-round', x: 500, y: 300, label: 'Fam. Novia' },
        { id: '5', type: 'dj-booth', x: 50, y: 50, label: 'DJ' }
    ]);
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragType, setDragType] = useState<LayoutObject['type'] | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(800);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [selectedId, setSelectedId] = useState<string | null>(null);
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

    // 1. Click to Add (Fallback with Random Position)
    const addLayoutObject = (type: LayoutObject['type']) => {
        // Random pos within 200px range of center to avoid stacking
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const randomOffsetX = (Math.random() - 0.5) * 200;
        const randomOffsetY = (Math.random() - 0.5) * 200;

        const newObj: LayoutObject = {
            id: Date.now().toString(),
            type,
            x: Math.max(0, Math.min(centerX + randomOffsetX, canvasWidth - 50)),
            y: Math.max(0, Math.min(centerY + randomOffsetY, canvasHeight - 50)),
            label: getLabelForType(type)
        };
        setLayoutObjects([...layoutObjects, newObj]);
    };

    const getLabelForType = (type: string) => {
        switch (type) {
            case 'table-round': return 'Redonda';
            case 'table-square': return 'Cuadrada';
            case 'table-main-wedding': return 'Novios';
            case 'table-main-xv': return 'XV Años';
            case 'chair': return 'Silla';
            case 'stage': return 'Pista/Stage';
            case 'bar': return 'Barra';
            case 'cocktail-table': return 'Periquera';
            case 'lounge': return 'Salas/Sillón';
            case 'dj-booth': return 'DJ';
            case 'sound-area': return 'Sonido';
            case 'kitchen-cold': return 'C. Fría';
            case 'kitchen-hot': return 'C. Caliente';
            case 'restroom': return 'Baños';
            case 'garden-area': return 'Jardín';
            case 'tent': return 'Carpa';
            default: return type;
        }
    };

    const deleteSelectedObject = () => {
        if (!selectedId) return;
        setLayoutObjects(prev => prev.filter(obj => obj.id !== selectedId));
        setSelectedId(null);
    };

    // 2. Drag Start (Existing Object)
    const handleDragStartObject = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setDragId(id);
        setDragType(null);
        setSelectedId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    // 3. Drag Start (New Item from Sidebar)
    const handleDragStartNew = (e: React.DragEvent, type: LayoutObject['type']) => {
        setDragType(type);
        setDragId(null);
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = dragType ? "copy" : "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        // Constrain to bounds
        const constrainedX = Math.max(0, Math.min(x - (dragType ? 0 : 25), canvasWidth - 40));
        const constrainedY = Math.max(0, Math.min(y - (dragType ? 0 : 25), canvasHeight - 40));

        if (dragType) {
            // Case A: Dropping a NEW item from Sidebar
            const newObj: LayoutObject = {
                id: Date.now().toString(),
                type: dragType,
                x: constrainedX - 20, // Center roughly
                y: constrainedY - 20,
                label: getLabelForType(dragType)
            };
            setLayoutObjects(prev => [...prev, newObj]);
            setDragType(null); // Reset
        } else if (dragId) {
            // Case B: Moving EXISTING item
            setLayoutObjects(prev => prev.map(obj =>
                obj.id === dragId ? { ...obj, x: constrainedX, y: constrainedY } : obj
            ));
            setDragId(null);
        }
    };

    // --- TOUCH HANDLERS (Mobile Support) ---
    const handleTouchStart = (e: React.TouchEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
        // We don't use dragId for touch, we move directly in TouchMove
    };

    const handleTouchMove = (e: React.TouchEvent, id: string) => {
        e.stopPropagation();
        if (!canvasRef.current) return;

        const touch = e.touches[0];
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = touch.clientX - canvasRect.left;
        const y = touch.clientY - canvasRect.top;

        // Constrain
        const constrainedX = Math.max(0, Math.min(x - 25, canvasWidth - 40));
        const constrainedY = Math.max(0, Math.min(y - 25, canvasHeight - 40));

        setLayoutObjects(prev => prev.map(obj =>
            obj.id === id ? { ...obj, x: constrainedX, y: constrainedY } : obj
        ));
    };

    const renderObjectStyle = (type: LayoutObject['type']) => {
        const baseStyle = "absolute cursor-move flex items-center justify-center text-xs font-bold transition-all hover:scale-105 active:scale-95 border-2 text-center overflow-hidden shadow-lg backdrop-blur-sm";
        switch (type) {
            case 'table-round': return `${baseStyle} w-16 h-16 rounded-full bg-blue-100/90 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-100`;
            case 'table-square': return `${baseStyle} w-16 h-16 rounded-lg bg-blue-100/90 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-100`;
            case 'table-main-wedding': return `${baseStyle} w-36 h-14 rounded-xl bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/50 dark:to-yellow-800/50 border-yellow-600 text-yellow-900 dark:text-yellow-100 border-double border-4 shadow-yellow-500/20`;
            case 'table-main-xv': return `${baseStyle} w-36 h-14 rounded-xl bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/50 dark:to-pink-800/50 border-pink-500 text-pink-800 dark:text-pink-100 border-double border-4 shadow-pink-500/20`;
            case 'chair': return `${baseStyle} w-6 h-6 rounded bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-100`;
            case 'cocktail-table': return `${baseStyle} w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 border-orange-500 text-orange-800 dark:text-orange-100`;
            case 'lounge': return `${baseStyle} w-20 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 border-purple-500 text-purple-800 dark:text-purple-100`;
            case 'bar': return `${baseStyle} w-24 h-8 bg-amber-800 dark:bg-amber-900 border-amber-900 text-white`;
            case 'stage': return `${baseStyle} w-32 h-24 bg-gray-300 dark:bg-gray-700/80 border-gray-600 text-gray-800 dark:text-white`;
            case 'dj-booth': return `${baseStyle} w-16 h-12 bg-black dark:bg-[#111] text-white border-gray-600`;
            case 'sound-area': return `${baseStyle} w-12 h-12 bg-gray-800 dark:bg-gray-900 text-white rounded border-gray-600`;
            case 'kitchen-cold': return `${baseStyle} w-24 h-24 bg-teal-100 dark:bg-teal-900/50 border-teal-600 text-teal-900 dark:text-teal-100`;
            case 'kitchen-hot': return `${baseStyle} w-24 h-24 bg-red-50 dark:bg-red-900/30 border-red-800 text-red-900 dark:text-red-100`;
            case 'restroom': return `${baseStyle} w-20 h-20 bg-cyan-50 dark:bg-cyan-900/30 border-cyan-500 text-cyan-800 dark:text-cyan-100`;
            case 'garden-area': return `${baseStyle} w-64 h-64 bg-green-100/50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-100 border-dashed z-0`;
            case 'tent': return `${baseStyle} w-96 h-96 bg-white/50 dark:bg-white/5 border-gray-400 text-gray-400 dark:text-gray-500 border-dashed z-0`;
            default: return baseStyle;
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in-up">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Producción y Logística</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Diseña el plano del evento y coordina cada momento.</p>

            <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-white/10 pb-1">
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
                    {/* Toolbar */}
                    <div className="w-full md:w-72 glass-panel p-5 space-y-6 flex flex-col h-full overflow-y-auto shrink-0 custom-scrollbar dark:bg-[#1c1c1e]/90 dark:border-white/10">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Configuración</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-[10px] font-bold text-gray-400 mb-1 block">Ancho (px)</label><input type="number" className="apple-input py-2 text-sm" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} /></div>
                                <div><label className="text-[10px] font-bold text-gray-400 mb-1 block">Alto (px)</label><input type="number" className="apple-input py-2 text-sm" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} /></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Mobiliario</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-round')} onClick={() => addLayoutObject('table-round')} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-xl cursor-pointer text-center text-xs transition-all duration-200 group">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto border-2 border-blue-400/50 mb-2 group-hover:scale-110 transition-transform"></div>
                                    <span className="font-medium text-gray-600 dark:text-gray-300">Redonda</span>
                                </div>
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-square')} onClick={() => addLayoutObject('table-square')} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-xl cursor-pointer text-center text-xs transition-all duration-200 group">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 mx-auto border-2 border-blue-400/50 mb-2 group-hover:scale-110 transition-transform"></div>
                                    <span className="font-medium text-gray-600 dark:text-gray-300">Cuadrada</span>
                                </div>
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'chair')} onClick={() => addLayoutObject('chair')} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-xl cursor-pointer text-center text-xs transition-all duration-200 group">
                                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900/50 mx-auto border-2 border-red-400/50 mb-2 group-hover:scale-110 transition-transform"></div>
                                    <span className="font-medium text-gray-600 dark:text-gray-300">Silla</span>
                                </div>
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'lounge')} onClick={() => addLayoutObject('lounge')} className="p-3 bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-xl cursor-pointer text-center text-xs transition-all duration-200 group">
                                    <div className="w-10 h-5 rounded bg-purple-100 dark:bg-purple-900/50 mx-auto border-2 border-purple-400/50 mb-2 group-hover:scale-110 transition-transform"></div>
                                    <span className="font-medium text-gray-600 dark:text-gray-300">Sala</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Zonas Especiales</h3>
                            <div className="space-y-2">
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-main-wedding')} onClick={() => addLayoutObject('table-main-wedding')} className="p-3 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-transparent border border-yellow-100 dark:border-yellow-900/30 rounded-xl cursor-pointer flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-glow"></div>
                                    <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">Mesa Novios</span>
                                </div>
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'stage')} onClick={() => addLayoutObject('stage')} className="p-3 bg-gray-50 dark:bg-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-xl cursor-pointer flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Pista / Stage</span>
                                </div>
                                <div draggable onDragStart={(e) => handleDragStartNew(e, 'dj-booth')} onClick={() => addLayoutObject('dj-booth')} className="p-3 bg-black dark:bg-[#111] border border-gray-800 rounded-xl cursor-pointer flex items-center gap-3">
                                    <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-white">DJ Booth</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 mt-auto space-y-3">
                            <button onClick={deleteSelectedObject} disabled={!selectedId} className={`w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${selectedId ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}>Eliminar Seleccionado</button>
                            <button className="w-full btn-primary bg-gradient-to-r from-green-600 to-green-500 border-none shadow-green-500/30">Guardar Cambios</button>
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
                                    className={`${renderObjectStyle(obj.type)} ${selectedId === obj.id ? 'ring-4 ring-primavera-gold shadow-[0_0_30px_rgba(212,175,55,0.4)] z-50 scale-105' : ''}`}
                                    style={{ left: obj.x, top: obj.y }}
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
