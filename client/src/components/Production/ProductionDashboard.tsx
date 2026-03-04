import React, { useState, useRef } from 'react';
import { FloorplanCatalog } from '../FloorplanCatalog';
import { FloorplanControls } from '../FloorplanControls';
import { FloorplanMinimap } from '../FloorplanMinimap';
import type { FloorplanElement } from '../../data/floorplanElements';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
    const [isCatalogExpanded, setIsCatalogExpanded] = useState(true);
    const [isControlsExpanded, setIsControlsExpanded] = useState(true);

    // --- CANVAS STATE ---
    // --- CANVAS STATE ---
    const [layoutObjects, setLayoutObjects] = useState<LayoutObject[]>([]); // Empty initial state
    const [dragId, setDragId] = useState<string | null>(null);
    const [canvasWidth, setCanvasWidth] = useState(1200);
    const [canvasHeight, setCanvasHeight] = useState(800);
    const [zoom, setZoom] = useState(0.25); // Initial zoom 25%
    const [selectedLayoutObjectId, setSelectedLayoutObjectId] = useState<string | null>(null);

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

        const width = element.width || 60;
        const height = element.height || 60;

        // 2. Add visual object to canvas (CENTERED)
        const newObj: LayoutObject = {
            id: Date.now().toString(),
            catalogueId: element.id,
            type: element.category,
            x: (canvasWidth / 2) - (width / 2), // Center X
            y: (canvasHeight / 2) - (height / 2), // Center Y
            label: element.name,
            width: width,
            height: height,
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
            setLayoutObjects([]); // Clear EVERYTHING
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

    const handleUpdateSelectedElement = (updates: Partial<LayoutObject>) => {
        setLayoutObjects(prev => prev.map(obj =>
            obj.id === selectedLayoutObjectId ? { ...obj, ...updates } : obj
        ));
    };

    const handleDuplicateSelectedElement = () => {
        const objToDuplicate = layoutObjects.find(obj => obj.id === selectedLayoutObjectId);
        if (objToDuplicate) {
            const copy: LayoutObject = {
                ...objToDuplicate,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                x: objToDuplicate.x + 20,
                y: objToDuplicate.y + 20
            };
            setLayoutObjects([...layoutObjects, copy]);
            setSelectedLayoutObjectId(copy.id);
        }
    };

    const handleDeleteSelectedElement = () => {
        setLayoutObjects(prev => prev.filter(obj => obj.id !== selectedLayoutObjectId));
        setSelectedLayoutObjectId(null);
    };

    // --- TIMELINE LOGIC (Restored) ---
    const canAdd = Boolean(newItemDesc); // Only description is strict required to enable

    const addTimelineItem = () => {
        if (!newItemDesc) return;

        const newItem: TimelineItem = {
            id: Date.now().toString(),
            time: newItemTime || '00:00', // Default if missing
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

    // --- PDF EXPORT LOGIC ---
    const exportCombinedPDF = async () => {
        const layoutElement = document.getElementById('layout-export-area');
        const timelineElement = document.getElementById('timeline-export-area');

        if (!layoutElement || !timelineElement) {
            alert('Asegúrate de que los elementos estén cargados en pantalla.');
            return;
        }

        try {
            // Un-hide containers forcefully for html2canvas
            const layoutContainer = document.getElementById('layout-container');
            const timelineContainer = document.getElementById('timeline-container');

            if (layoutContainer) {
                layoutContainer.classList.remove('opacity-0', 'absolute', '-z-50');
            }
            if (timelineContainer) {
                timelineContainer.classList.remove('opacity-0', 'absolute', '-z-50');
            }

            // We use A4 portrait format
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            let currentY = 10;

            pdf.setFontSize(16);
            pdf.text('Reporte de Producción: Day Out', 10, currentY);
            currentY += 10;

            // 1. Export Layout if it has elements
            if (layoutObjects.length > 0) {
                pdf.setFontSize(12);
                pdf.text('Plano de Distribución:', 10, currentY);
                currentY += 5;

                // html2canvas requires elements to be visible in viewport usually
                const layoutCanvas = await html2canvas(layoutElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const layoutImgData = layoutCanvas.toDataURL('image/png');

                // Calculate reasonable height to fit width
                const imgWidth = pdfWidth - 20;
                const imgHeight = (layoutCanvas.height * imgWidth) / layoutCanvas.width;

                pdf.addImage(layoutImgData, 'PNG', 10, currentY, imgWidth, imgHeight);
                currentY += imgHeight + 10;
            }

            // 2. Export Timeline if it has elements
            if (timelineItems.length > 0) {
                if (currentY > pdf.internal.pageSize.getHeight() - 40) {
                    pdf.addPage();
                    currentY = 10;
                }

                pdf.setFontSize(12);
                pdf.text('Itinerario (Minuto a Minuto):', 10, currentY);
                currentY += 5;

                const timelineCanvas = await html2canvas(timelineElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                const timelineImgData = timelineCanvas.toDataURL('image/png');

                const imgWidth = pdfWidth - 20;
                const imgHeight = (timelineCanvas.height * imgWidth) / timelineCanvas.width;

                pdf.addImage(timelineImgData, 'PNG', 10, currentY, imgWidth, imgHeight);
            }

            pdf.save('Reporte_DayOut_Primavera.pdf');

            // Restore visibility state
            if (view !== 'layout' && layoutContainer) {
                layoutContainer.classList.add('opacity-0', 'absolute', '-z-50');
            }
            if (view !== 'timeline' && timelineContainer) {
                timelineContainer.classList.add('opacity-0', 'absolute', '-z-50');
            }

        } catch (err) {
            console.error('Error exportando PDF:', err);
            alert('Hubo un error al generar el PDF combinado.');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans">
            {/* TOP BAR */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0 z-20 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Producción y Logística</h1>
                    <p className="text-xs text-gray-500 font-medium">Diseñador de Planos & Itinerario</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex bg-gray-100/50 p-1 rounded-lg">
                        <button onClick={() => setView('layout')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'layout' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>Plano</button>
                        <button onClick={() => setView('timeline')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${view === 'timeline' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>Minuto a Minuto</button>
                    </div>
                    <button onClick={exportCombinedPDF} className="px-4 py-2 bg-red-600 text-white rounded shadow text-sm font-bold hover:bg-red-700 transition flex items-center gap-2">
                        📄 Exportar Day Out PDF
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div id="layout-container" className={`flex-1 flex flex-col md:flex-row overflow-hidden md:overflow-hidden overflow-y-auto ${view !== 'layout' ? 'absolute opacity-0 pointer-events-none -z-50 w-full h-full' : ''}`}>
                {/* LEFT PANEL: CATALOG */}
                <div className={`border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10 transition-all duration-300 ease-in-out flex flex-col h-full shrink-0 order-1 ${isCatalogExpanded ? 'w-full md:w-80' : 'w-full md:w-16'}`}>
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
                            {/* We add the layout-export-area id here */}
                            <div
                                id="layout-export-area"
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
                                <div className="absolute -top-6 left-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest" data-html2canvas-ignore>
                                    {canvasWidth}px x {canvasHeight}px
                                </div>

                                {/* Objects */}
                                {layoutObjects.map(obj => (
                                    <div
                                        key={obj.id}
                                        draggable
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLayoutObjectId(obj.id);
                                        }}
                                        onDragStart={(e) => handleDragStartObject(e, obj.id)}
                                        className={`absolute cursor-move flex items-center justify-center font-bold transition-all hover:scale-105 active:scale-95 text-center hover:shadow-lg hover:z-50 ${obj.shape === 'circle' ? 'rounded-full' : 'rounded-md'} ${obj.colorClass} ${selectedLayoutObjectId === obj.id ? 'ring-4 ring-blue-500 shadow-xl z-50' : ''}`}
                                        style={{
                                            left: obj.x,
                                            top: obj.y,
                                            width: obj.width,
                                            height: obj.height,
                                            boxSizing: 'border-box'
                                        }}
                                        title={obj.label}
                                    >
                                        <div style={{
                                            fontSize: '11px',
                                            lineHeight: '1.1',
                                            color: '#1f2937', // Text-gray-800 explicit for html2canvas
                                            width: '100%',
                                            maxHeight: '100%',
                                            overflow: 'hidden',
                                            wordWrap: 'break-word',
                                            pointerEvents: 'none',
                                            textAlign: 'center'
                                        }}>
                                            {obj.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: CONTROLS */}
                <div className={`bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col overflow-y-auto z-10 shadow-lg shrink-0 order-3 h-auto md:h-full transition-all duration-300 ease-in-out ${isControlsExpanded ? 'w-full md:w-80 p-4 space-y-4' : 'w-full md:w-16 p-2 space-y-2 items-center'}`}>
                    <FloorplanControls
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        onCanvasSizeChange={handleCanvasSizeChange}
                        zoom={zoom}
                        onZoomChange={setZoom}
                        onCreateCustomElement={handleCreateCustomElement}
                        isExpanded={isControlsExpanded}
                        onToggleExpand={() => setIsControlsExpanded(!isControlsExpanded)}
                    />

                    {/* Selected Element Editor */}
                    {selectedLayoutObjectId && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in-up">
                            <h4 className="font-bold text-sm text-blue-800 mb-3 flex justify-between items-center">
                                <span>✏️ Editar Elemento</span>
                                <button onClick={() => setSelectedLayoutObjectId(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </h4>
                            {layoutObjects.filter(obj => obj.id === selectedLayoutObjectId).map(obj => (
                                <div key={`edit-${obj.id}`} className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-blue-600/70 mb-1">Nombre / Etiqueta</label>
                                        <input
                                            type="text"
                                            value={obj.label}
                                            onChange={(e) => handleUpdateSelectedElement({ label: e.target.value })}
                                            className="w-full px-2 py-1.5 text-sm border border-blue-200 rounded bg-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-blue-600/70 mb-1">Ancho (px)</label>
                                            <input
                                                type="number"
                                                value={obj.width}
                                                onChange={(e) => handleUpdateSelectedElement({ width: parseInt(e.target.value) || 20 })}
                                                className="w-full px-2 py-1 border border-blue-200 rounded text-sm bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-blue-600/70 mb-1">Alto (px)</label>
                                            <input
                                                type="number"
                                                value={obj.height}
                                                onChange={(e) => handleUpdateSelectedElement({ height: parseInt(e.target.value) || 20 })}
                                                className="w-full px-2 py-1 border border-blue-200 rounded text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-blue-100">
                                        <button
                                            onClick={handleDuplicateSelectedElement}
                                            className="flex-1 px-2 py-1.5 bg-white border border-blue-300 text-blue-700 text-xs font-bold rounded shadow-sm hover:bg-blue-100 transition"
                                        >
                                            DUPLICAR
                                        </button>
                                        <button
                                            onClick={handleDeleteSelectedElement}
                                            className="flex-1 px-2 py-1.5 bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded shadow-sm hover:bg-red-200 transition"
                                        >
                                            ELIMINAR
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* UPDATE: Pass 'layoutObjects' instead of 'selectedElements' for LIVE position updates */}
                    <FloorplanMinimap
                        items={layoutObjects}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                    />
                </div>
            </div>

            <div id="timeline-container" className={`p-8 overflow-y-auto h-full bg-[#FAFAFA] ${view !== 'timeline' ? 'absolute opacity-0 pointer-events-none -z-50 w-full h-full top-0 left-0' : ''}`}>
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
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                            <div className="w-full md:w-40">
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
                                disabled={!canAdd}
                                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                            >
                                AGREGAR
                            </button>
                        </div>

                        {/* TIMELINE LIST */}
                        <div id="timeline-export-area" className="relative pl-8 border-l-2 border-dashed border-gray-200 space-y-8 bg-white pb-8">
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
                                                data-html2canvas-ignore
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
        </div>
    );
};

export default ProductionDashboard;
