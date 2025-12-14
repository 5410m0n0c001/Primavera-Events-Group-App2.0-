import React, { useState, useEffect, useRef } from 'react';
import { FloorplanCatalog } from '../FloorplanCatalog';
import { FloorplanElement } from '../../data/floorplanElements';

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
    catalogueId?: string; // Links back to catalogue
}

const ProductionDashboard: React.FC = () => {
    const [view, setView] = useState<'layout' | 'timeline'>('layout');

    // --- TIMELINE STATE ---
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
    const [newItemTime, setNewItemTime] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');

    // --- CATALOG STATE (New) ---
    const [selectedElements, setSelectedElements] = useState<FloorplanElement[]>([]);

    // --- LAYOUT CANVAS STATE ---
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([
        { id: '1', type: 'stage-main', x: 300, y: 50, label: 'Pista Principal', width: 150, height: 80, shape: 'rect', colorClass: 'bg-gray-800 text-white' },
    ]);
    const [dragId, setDragId] = useState<string | null>(null);
    const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(1200);
    const [canvasHeight, setCanvasHeight] = useState(800);

    const canvasRef = useRef<HTMLDivElement>(null);

    // --- HANDLERS FOR CATALOG ---
    const handleAddElement = (element: FloorplanElement) => {
        // 1. Add to selected list if not exists
        if (!selectedElements.find(el => el.id === element.id)) {
            setSelectedElements([...selectedElements, element]);
        }

        // 2. Add visual object to canvas
        const newObj: LayoutObject = {
            id: Date.now().toString(),
            catalogueId: element.id,
            type: 'catalogue-item',
            x: 100 + (layoutObjects.length * 20), // Cascade
            y: 100 + (layoutObjects.length * 20),
            label: element.name,
            width: 60,
            height: 60,
            shape: 'rect',
            colorClass: 'bg-blue-200 border-2 border-blue-400'
        };
        setLayoutObjects([...layoutObjects, newObj]);
    };

    const handleRemoveElement = (elementId: string) => {
        // 1. Remove from selected list (Catalog Side)
        setSelectedElements(selectedElements.filter(el => el.id !== elementId));

        // 2. Remove all instances from Canvas
        setLayoutObjects(prev => prev.filter(obj => obj.catalogueId !== elementId));
    };

    // --- CANVAS HANDLERS ---
    const handleDragStartObject = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        setDragId(id);
        setSelectedCanvasId(id);
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
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;

        const constrainedX = Math.max(0, Math.min(x, canvasWidth - 10));
        const constrainedY = Math.max(0, Math.min(y, canvasHeight - 10));

        setLayoutObjects(prev => prev.map(obj =>
            obj.id === dragId ? {
                ...obj,
                x: constrainedX - (obj.width / 2),
                y: constrainedY - (obj.height / 2)
            } : obj
        ));
        setDragId(null);
    };

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

    return (
        <div className="p-4 md:p-8 max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in-up">
            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Producción y Logística</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Diseña el plano del evento y coordina cada momento.</p>

            <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-white/10 pb-1 shrink-0">
                <button onClick={() => setView('layout')} className={`text-sm font-bold pb-3 px-2 ${view === 'layout' ? 'text-primavera-gold' : 'text-gray-400'}`}>
                    Diseñador de Planos
                </button>
                <button onClick={() => setView('timeline')} className={`text-sm font-bold pb-3 px-2 ${view === 'timeline' ? 'text-primavera-gold' : 'text-gray-400'}`}>
                    Minuto a Minuto
                </button>
            </div>

            {view === 'layout' && (
                <div className="flex h-full gap-4 overflow-hidden">
                    {/* PANEL IZQUIERDO: CATÁLOGO (Integración Solicitada) */}
                    <div className="w-80 flex-shrink-0">
                        <FloorplanCatalog
                            onAddElement={handleAddElement}
                            selectedElements={selectedElements}
                            onRemoveElement={handleRemoveElement}
                        />
                    </div>

                    {/* ÁREA PRINCIPAL: CANVAS DEL PLANO */}
                    <div className="flex-1 bg-[#F5F5F7] dark:bg-black rounded-xl shadow-inner border border-black/5 dark:border-white/5 overflow-auto custom-scrollbar relative">
                        <div
                            ref={canvasRef}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="bg-white dark:bg-[#111] shadow-2xl relative transition-all duration-300 rounded-lg mx-auto mt-8"
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                backgroundImage: `radial-gradient(var(--dot-color, #cbd5e1) 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        >
                            <style>{`.dark .bg-white { --dot-color: #333; }`}</style>

                            {/* Canvas objects */}
                            {layoutObjects.map(obj => (
                                <div
                                    key={obj.id}
                                    draggable
                                    onDragStart={(e) => handleDragStartObject(e, obj.id)}
                                    className={`absolute cursor-move flex items-center justify-center text-xs font-bold transition-all hover:scale-105 border-2 text-center overflow-hidden shadow-sm backdrop-blur-sm select-none ${obj.shape === 'circle' ? 'rounded-full' : 'rounded-md'} ${obj.colorClass}`}
                                    style={{
                                        left: obj.x,
                                        top: obj.y,
                                        width: obj.width,
                                        height: obj.height
                                    }}
                                >
                                    <span className="line-clamp-2 px-1">{obj.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'timeline' && (
                <div className="apple-card p-8 rounded-3xl shadow-xl flex-grow dark:bg-[#1c1c1e]">
                    <div className="flex gap-4 mb-8 items-end bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div className="w-48">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hora</label>
                            <input type="time" className="apple-input bg-white dark:bg-black/50" value={newItemTime} onChange={e => setNewItemTime(e.target.value)} />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Actividad</label>
                            <input type="text" className="apple-input bg-white dark:bg-black/50" placeholder="Ej. Entrada de Novios..." value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
                        </div>
                        <button onClick={addTimelineItem} className="btn-primary h-[50px] px-8 bg-gradient-to-r from-primavera-gold to-[#B38728] border-none shadow-glow">AGREGAR</button>
                    </div>
                    <div className="space-y-6">{timelineItems.map(item => <div key={item.id} className="p-4 bg-white shadow">{item.time} - {item.description}</div>)}</div>
                </div>
            )}
        </div>
    );
};

export default ProductionDashboard;
