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
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([]);
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

    // 1. Click to Add (Fallback)
    const addLayoutObject = (type: LayoutObject['type']) => {
        const newObj: LayoutObject = {
            id: Date.now().toString(),
            type,
            x: 50,
            y: 50,
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

    const renderObjectStyle = (type: LayoutObject['type']) => {
        const baseStyle = "absolute cursor-move flex items-center justify-center text-xs font-bold transition-transform active:scale-105 border-2 text-center overflow-hidden";
        switch (type) {
            case 'table-round': return `${baseStyle} w-16 h-16 rounded-full bg-blue-100 border-blue-500 text-blue-800`;
            case 'table-square': return `${baseStyle} w-16 h-16 rounded-sm bg-blue-100 border-blue-500 text-blue-800`;
            case 'table-main-wedding': return `${baseStyle} w-32 h-12 rounded bg-yellow-100 border-yellow-600 text-yellow-900 border-double border-4`;
            case 'table-main-xv': return `${baseStyle} w-32 h-12 rounded bg-pink-100 border-pink-500 text-pink-800 border-double border-4`;
            case 'chair': return `${baseStyle} w-6 h-6 rounded bg-red-100 border-red-500 text-red-800`;
            case 'cocktail-table': return `${baseStyle} w-8 h-8 rounded-full bg-orange-100 border-orange-500 text-orange-800`;
            case 'lounge': return `${baseStyle} w-20 h-10 rounded-lg bg-purple-100 border-purple-500 text-purple-800`;
            case 'bar': return `${baseStyle} w-24 h-8 bg-amber-800 border-amber-900 text-white`;
            case 'stage': return `${baseStyle} w-32 h-24 bg-gray-300 border-gray-600 text-gray-800`;
            case 'dj-booth': return `${baseStyle} w-16 h-12 bg-black text-white border-gray-600`;
            case 'sound-area': return `${baseStyle} w-12 h-12 bg-gray-800 text-white rounded border-gray-600`;
            case 'kitchen-cold': return `${baseStyle} w-24 h-24 bg-teal-100 border-teal-600 text-teal-900`;
            case 'kitchen-hot': return `${baseStyle} w-24 h-24 bg-red-50 border-red-800 text-red-900`;
            case 'restroom': return `${baseStyle} w-20 h-20 bg-cyan-50 border-cyan-500 text-cyan-800`;
            case 'garden-area': return `${baseStyle} w-64 h-64 bg-green-100 border-green-500 text-green-800 opacity-50 border-dashed z-0`; // Big & transparent
            case 'tent': return `${baseStyle} w-96 h-96 bg-white border-gray-400 text-gray-400 opacity-30 border-dashed z-0`; // Huge overlay
            default: return baseStyle;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Producción y Logística</h1>

            <div className="flex gap-4 mb-6 border-b pb-2">
                <button onClick={() => setView('layout')} className={`font-bold pb-2 ${view === 'layout' ? 'text-primavera-gold border-b-2 border-primavera-gold' : 'text-gray-500'}`}>Diseñador de Planos (Layout)</button>
                <button onClick={() => setView('timeline')} className={`font-bold pb-2 ${view === 'timeline' ? 'text-primavera-gold border-b-2 border-primavera-gold' : 'text-gray-500'}`}>Minuto a Minuto</button>
            </div>

            {view === 'layout' && (
                <div className="flex-grow flex gap-6 h-full overflow-hidden">
                    {/* Toolbar */}
                    <div className="w-64 bg-white p-4 rounded shadow space-y-4 flex flex-col h-full overflow-y-auto shrink-0 text-sm">
                        <h3 className="font-bold text-gray-700 border-b pb-2">Configuración</h3>
                        <div className="space-y-2">
                            <div><label className="text-xs font-bold text-gray-500">Ancho (px)</label><input type="number" className="w-full border p-1 rounded text-sm" value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} /></div>
                            <div><label className="text-xs font-bold text-gray-500">Alto (px)</label><input type="number" className="w-full border p-1 rounded text-sm" value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} /></div>
                        </div>

                        <h3 className="font-bold text-gray-700 border-b pb-2 pt-4">Mobiliario</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-round')} onClick={() => addLayoutObject('table-round')} className="p-2 bg-gray-50 hover:bg-gray-100 border rounded cursor-pointer text-center text-xs">
                                <div className="w-6 h-6 rounded-full bg-blue-200 mx-auto border-2 border-blue-400 mb-1"></div>Redonda
                            </div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-square')} onClick={() => addLayoutObject('table-square')} className="p-2 bg-gray-50 hover:bg-gray-100 border rounded cursor-pointer text-center text-xs">
                                <div className="w-6 h-6 bg-blue-200 mx-auto border-2 border-blue-400 mb-1"></div>Cuadrada
                            </div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'chair')} onClick={() => addLayoutObject('chair')} className="p-2 bg-gray-50 hover:bg-gray-100 border rounded cursor-pointer text-center text-xs">
                                <div className="w-4 h-4 bg-red-200 mx-auto border-2 border-red-400 mb-1"></div>Silla
                            </div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'cocktail-table')} onClick={() => addLayoutObject('cocktail-table')} className="p-2 bg-gray-50 hover:bg-gray-100 border rounded cursor-pointer text-center text-xs">
                                <div className="w-4 h-4 rounded-full bg-orange-200 mx-auto border-2 border-orange-400 mb-1"></div>Periquera
                            </div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'lounge')} onClick={() => addLayoutObject('lounge')} className="p-2 bg-gray-50 hover:bg-gray-100 border rounded cursor-pointer text-center text-xs col-span-2">
                                <div className="w-10 h-4 rounded bg-purple-200 mx-auto border-2 border-purple-400 mb-1"></div>Sala / Sillón
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-700 border-b pb-2 pt-2">Especiales</h3>
                        <div className="space-y-1">
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-main-wedding')} onClick={() => addLayoutObject('table-main-wedding')} className="p-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded cursor-pointer text-center text-xs font-bold text-yellow-800">Mesa Novios</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'table-main-xv')} onClick={() => addLayoutObject('table-main-xv')} className="p-2 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded cursor-pointer text-center text-xs font-bold text-pink-800">Mesa XV Años</div>
                        </div>

                        <h3 className="font-bold text-gray-700 border-b pb-2 pt-2">Servicios</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'stage')} onClick={() => addLayoutObject('stage')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">Pista/Stage</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'bar')} onClick={() => addLayoutObject('bar')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">Barra</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'dj-booth')} onClick={() => addLayoutObject('dj-booth')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">DJ Booth</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'sound-area')} onClick={() => addLayoutObject('sound-area')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">Sonido</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'kitchen-hot')} onClick={() => addLayoutObject('kitchen-hot')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">C. Caliente</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'kitchen-cold')} onClick={() => addLayoutObject('kitchen-cold')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">C. Fría</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'restroom')} onClick={() => addLayoutObject('restroom')} className="p-1 bg-gray-50 border rounded cursor-pointer text-center text-xs">Baños</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'garden-area')} onClick={() => addLayoutObject('garden-area')} className="p-1 bg-green-50 border border-green-200 rounded cursor-pointer text-center text-xs text-green-800">Área Jardín</div>
                            <div draggable onDragStart={(e) => handleDragStartNew(e, 'tent')} onClick={() => addLayoutObject('tent')} className="p-1 bg-white border border-dashed rounded cursor-pointer text-center text-xs col-span-2">Carpas (Zona)</div>
                        </div>

                        <div className="pt-4 mt-auto">
                            <button onClick={deleteSelectedObject} disabled={!selectedId} className={`w-full py-2 rounded font-bold text-sm mb-2 transition ${selectedId ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>Eliminar Sel.</button>
                            <button className="w-full bg-green-600 text-white py-2 rounded font-bold text-sm hover:brightness-110">Guardar</button>
                        </div>
                    </div>

                    {/* Canvas Container (Scrollable) */}
                    <div className="flex-grow bg-gray-200 rounded shadow border-inner overflow-auto relative p-8 flex items-center justify-center">
                        {/* Actual Canvas */}
                        <div
                            ref={canvasRef}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={(e) => {
                                // Deselect if clicking on empty canvas area
                                if (e.target === canvasRef.current) setSelectedId(null);
                            }}
                            className="bg-white shadow-xl relative transition-all duration-300"
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                                minWidth: canvasWidth, // Ensure it doesn't shrink
                                minHeight: canvasHeight
                            }}
                        >
                            <div className="absolute -top-6 left-0 text-xs text-gray-500 font-bold select-none whitespace-nowrap">
                                Dimensiones: {canvasWidth}px x {canvasHeight}px
                            </div>

                            {layoutObjects.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none text-xl font-bold select-none">Arrastra elementos aquí</div>}

                            {layoutObjects.map(obj => (
                                <div
                                    key={obj.id}
                                    draggable
                                    onDragStart={(e) => handleDragStartObject(e, obj.id)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedId(obj.id);
                                    }}
                                    className={`${renderObjectStyle(obj.type)} ${selectedId === obj.id ? 'ring-4 ring-yellow-400 shadow-xl z-50' : 'hover:shadow-md'}`}
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
                <div className="bg-white p-6 rounded shadow flex-grow">
                    <div className="flex gap-4 mb-6 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500">Hora</label>
                            <input type="time" className="border p-2 rounded" value={newItemTime} onChange={e => setNewItemTime(e.target.value)} />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-gray-500">Actividad</label>
                            <input type="text" className="border p-2 rounded w-full" placeholder="Ej. Entrada de Novios" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
                        </div>
                        <button onClick={addTimelineItem} className="bg-primavera-gold text-white px-4 py-2 rounded font-bold">Agregar</button>
                    </div>

                    <div className="space-y-4 relative pl-8 border-l-2 border-gray-200">
                        {timelineItems.map((item, idx) => (
                            <div key={item.id} className="relative mb-6">
                                <div className="absolute -left-[41px] bg-primavera-gold text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                                    {idx + 1}
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-gray-200 shadow-sm flex justify-between items-center">
                                    <div>
                                        <span className="text-xl font-bold text-gray-800 mr-4">{item.time}</span>
                                        <span className="text-gray-700 font-medium">{item.description}</span>
                                    </div>
                                    <button className="text-red-400 hover:text-red-600">×</button>
                                </div>
                            </div>
                        ))}
                        {timelineItems.length === 0 && <div className="text-gray-400 italic">No hay actividades programadas.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionDashboard;
