import React, { useState, useEffect, useRef } from 'react';
import { FloorplanCatalog } from '../FloorplanCatalog';
import { FloorplanControls } from '../FloorplanControls';
import { FloorplanMinimap, type MinimapItem } from '../FloorplanMinimap'; // Updated Import
import type { FloorplanElement } from '../../data/floorplanElements';

// Types
interface TimelineItem {
    id: string;
    time: string;
    description: string;
    order: number;
}

interface LayoutObject {
    id: string;
    type: string;
    x: number;
    y: number;
    label: string;
    width: number;
    height: number;
    shape: 'rect' | 'circle' | 'rounded';
    colorClass: string;
    catalogueId?: string;
}

const ProductionDashboard: React.FC = () => {
    // --- VIEW STATE ---
    const [view, setView] = useState<'layout' | 'timeline'>('layout');

    // --- CATALOG STATE ---
    const [selectedElements, setSelectedElements] = useState<FloorplanElement[]>([]);
    const [isCatalogExpanded, setIsCatalogExpanded] = useState(false);

    // --- CANVAS STATE ---
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([
        { id: '1', type: 'stage-main', x: 300, y: 50, label: 'Pista Principal', width: 150, height: 80, shape: 'rect', colorClass: 'bg-gray-800 text-white' },
    ]);
    const [dragId, setDragId] = useState<string | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(1200);
    const [canvasHeight, setCanvasHeight] = useState(800);
    const [zoom, setZoom] = useState(1);

    const canvasRef = useRef<HTMLDivElement>(null);

    // --- TIMELINE STATE ---
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [newItemTime, setNewItemTime] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');

    // --- HANDLERS: CATALOG -> CANVAS ---
    const handleAddElement = (element: FloorplanElement) => {
        // 1. Add to selection list for tracking
        if (!selectedElements.find(el => el.id === element.id)) {
            setSelectedElements([...selectedElements, element]);
        }

        // 2. Add visual object to canvas
        const newObj: LayoutObject = {
            id: Date.now().toString(),
            catalogueId: element.id,
            type: element.category,
            x: 100 + (Math.random() * 50), // Slight random offset to avoid exact stacking
            y: 100 + (Math.random() * 50),
            label: element.name,
            width: element.width || 60,
            height: element.height || 60,
            shape: 'rect',
            colorClass: 'bg-white border-2 border-gray-800 text-gray-900 shadow-sm'
        };
        setLayoutObjects([...layoutObjects, newObj]);
    };

    const handleRemoveElement = (elementId: string) => {
        // Remove from list
        setSelectedElements(selectedElements.filter(el => el.id !== elementId));
        // Remove from canvas
        setLayoutObjects(prev => prev.filter(obj => obj.catalogueId !== elementId));
    };

    const handleClearAll = () => {
        if (window.confirm(`¿Eliminar todos los elementos del plano?`)) {
            setSelectedElements([]);
            // Keep default items (no catalogueId) or clear all? 
            // Clearing only catalogue items to be safe, user can delete others manually if needed.
            setLayoutObjects(prev => prev.filter(obj => !obj.catalogueId));
        }
    };

    const handleCreateCustomElement = (element: FloorplanElement) => {
        handleAddElement(element);
    };

    // --- HANDLERS: CANVAS INTERACTIONS ---
    const handleCanvasSizeChange = (width: number, height: number) => {
        setCanvasWidth(width);
        setCanvasHeight(height);
    };

    const handleDragStartObject = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setDragId(id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!canvasRef.current || !dragId) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        // Adjust mouse coordinates for Zoom level
        const x = (e.clientX - canvasRect.left) / zoom;
        const y = (e.clientY - canvasRect.top) / zoom;

        const constrainedX = Math.max(0, Math.min(x, canvasWidth));
        const constrainedY = Math.max(0, Math.min(y, canvasHeight));

        setLayoutObjects(prev => prev.map(obj =>
            obj.id === dragId ? {
                ...obj,
                x: constrainedX - (obj.width / 2),
                y: constrainedY - (obj.height / 2)
            } : obj
        ));
        setDragId(null);
    };

    // --- TIMELINE LOGIC (Restored) ---
    const addTimelineItem = () => {
        if (!newItemTime || !newItemDesc) return;
        const newItem: TimelineItem = {
            id: Date.now().toString(),
            time: newItemTime,
            description: newItemDesc,
            order: timelineItems.length + 1
        };
        setTimelineItems([...timelineItems, newItem].sort((a, b) => a.time.localeCompare(b.time)));
        setNewItemTime('');
        setNewItemDesc('');
    };

    const removeTimelineItem = (id: string) => {
        setTimelineItems(items => items.filter(item => item.id !== id));
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans">
            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Producción y Logística</h1>
                    <p className="text-xs text-gray-500 font-medium">Diseñador de Planos & Itinerario</p>
                </div>
                <div className="flex bg-gray-100/50 p-1 rounded-lg">
                    <button onClick={() => setView('layout')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'layout' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>Plano</button>
                    <button onClick={() => setView('timeline')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'timeline' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>Minuto a Minuto</button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {view === 'layout' && (
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:overflow-hidden overflow-y-auto">
                    {/* LEFT PANEL: CATALOG */}
                    <div className={`border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10 transition-all duration-300 ease-in-out flex flex-col w-full ${isCatalogExpanded ? 'md:w-96' : 'md:w-72'} shrink-0 order-1`}>
                        <FloorplanCatalog
                            onAddElement={handleAddElement}
                            selectedElements={selectedElements}
                            onRemoveElement={handleRemoveElement}
                            onClearAll={handleClearAll}
                            isExpanded={isCatalogExpanded}
                            onToggleExpand={() => setIsCatalogExpanded(!isCatalogExpanded)}
                        />
                    </div>

                    {/* CENTER PANEL: CANVAS */}
                    <div className="flex-1 bg-[#F5F5F7] overflow-hidden relative flex flex-col order-2 min-h-[500px]">
                        <div className="flex-1 overflow-auto custom-scrollbar p-4 md:p-8 relative flex items-start justify-center">
                            <div
                                style={{
                                    transform: `scale(${zoom})`,
                                    transformOrigin: 'top center',
                                    transition: 'transform 0.1s ease-out'
                                }}
                            >
                                <div
                                    ref={canvasRef}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="bg-white shadow-2xl relative transition-all duration-300"
                                    style={{
                                        width: canvasWidth,
                                        height: canvasHeight,
                                        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px'
                                    }}
                                >
                                    {/* Canvas Dimensions Label */}
                                    <div className="absolute -top-6 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {canvasWidth}px x {canvasHeight}px
                                    </div>

                                    {/* Objects */}
                                    {layoutObjects.map(obj => (
                                        <div
                                            key={obj.id}
                                            draggable
                                            onDragStart={(e) => handleDragStartObject(e, obj.id)}
                                            className={`absolute cursor-move flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 active:scale-95 text-center overflow-hidden select-none hover:shadow-lg hover:z-50 ${obj.shape === 'circle' ? 'rounded-full' : 'rounded-md'} ${obj.colorClass}`}
                                            style={{
                                                left: obj.x,
                                                top: obj.y,
                                                width: obj.width,
                                                height: obj.height,
                                                lineHeight: '1.1'
                                            }}
                                            title={obj.label}
                                        >
                                            <span className="px-1 line-clamp-2 pointer-events-none">{obj.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: CONTROLS */}
                    <div className="w-full md:w-72 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col overflow-y-auto z-10 p-4 space-y-4 shadow-lg shrink-0 order-3 h-auto md:h-auto">
                        <FloorplanControls
                            canvasWidth={canvasWidth}
                            canvasHeight={canvasHeight}
                            onCanvasSizeChange={handleCanvasSizeChange}
                            zoom={zoom}
                            onZoomChange={setZoom}
                            onCreateCustomElement={handleCreateCustomElement}
                        />
                        {/* UPDATE: Pass 'layoutObjects' instead of 'selectedElements' for LIVE position updates */}
                        <FloorplanMinimap
                            items={layoutObjects}
                            canvasWidth={canvasWidth}
                            canvasHeight={canvasHeight}
                        />
                    </div>
                </div>
            )}

            {view === 'timeline' && (
                <div className="p-8 overflow-y-auto h-full bg-[#FAFAFA]">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">Minuto a Minuto</h2>
                                    <p className="text-gray-500">Planifica la secuencia exacta del evento.</p>
                                </div>
                                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold">
                                    {timelineItems.length} Actividades
                                </div>
                            </div>

                            {/* ADD NEW ITEM FORM */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 flex gap-4 items-end">
                                <div className="w-40">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                                        value={newItemTime}
                                        onChange={e => setNewItemTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Actividad</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej. Entrada de Novios con pirotecnia..."
                                        value={newItemDesc}
                                        onChange={e => setNewItemDesc(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addTimelineItem()}
                                    />
                                </div>
                                <button
                                    onClick={addTimelineItem}
                                    disabled={!newItemTime || !newItemDesc}
                                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                                >
                                    AGREGAR
                                </button>
                            </div>

                            {/* TIMELINE LIST */}
                            <div className="relative pl-8 border-l-2 border-dashed border-gray-200 space-y-8">
                                {timelineItems.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 italic">
                                        No hay actividades programadas. Agrega una arriba.
                                    </div>
                                ) : (
                                    timelineItems.map((item, idx) => (
                                        <div key={item.id} className="relative group">
                                            {/* Index Bubble */}
                                            <div className="absolute -left-[42px] top-1/2 -translate-y-1/2 bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-gray-100 shadow-sm z-10">
                                                {idx + 1}
                                            </div>

                                            {/* Card */}
                                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group-hover:border-blue-200">
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-xl font-bold text-gray-800 font-mono">
                                                        {item.time}
                                                    </div>
                                                    <div className="text-lg text-gray-700 font-medium">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeTimelineItem(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                    title="Eliminar actividad"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionDashboard;
