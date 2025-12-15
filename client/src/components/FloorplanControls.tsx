import React, { useState } from 'react';
import { FloorplanElement } from '../data/floorplanElements';

interface FloorplanControlsProps {
    canvasWidth: number;
    canvasHeight: number;
    onCanvasSizeChange: (width: number, height: number) => void;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    onCreateCustomElement: (element: FloorplanElement) => void;
}

export const FloorplanControls: React.FC<FloorplanControlsProps> = ({
    canvasWidth,
    canvasHeight,
    onCanvasSizeChange,
    zoom,
    onZoomChange,
    onCreateCustomElement
}) => {
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customName, setCustomName] = useState('');
    const [customWidth, setCustomWidth] = useState('50');
    const [customHeight, setCustomHeight] = useState('50');
    const [tempWidth, setTempWidth] = useState(canvasWidth.toString());
    const [tempHeight, setTempHeight] = useState(canvasHeight.toString());

    const handleCreateCustom = () => {
        if (customName.trim()) {
            const newElement: FloorplanElement = {
                id: `custom-${Date.now()}`,
                name: customName,
                category: 'custom',
                width: parseInt(customWidth) || 50,
                height: parseInt(customHeight) || 50
            };
            onCreateCustomElement(newElement);
            setCustomName('');
            setCustomWidth('50');
            setCustomHeight('50');
            setShowCustomForm(false);
        }
    };

    const handleApplySize = () => {
        const w = parseInt(tempWidth) || 1200;
        const h = parseInt(tempHeight) || 800;
        onCanvasSizeChange(w, h);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
            <h3 className="font-bold text-lg text-gray-800">⚙️ Controles</h3>

            {/* Tamaño del Lienzo */}
            <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">📏 Tamaño del Lienzo</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Ancho (px)</label>
                        <input
                            type="number"
                            value={tempWidth}
                            onChange={(e) => setTempWidth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="400"
                            max="5000"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Alto (px)</label>
                        <input
                            type="number"
                            value={tempHeight}
                            onChange={(e) => setTempHeight(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="400"
                            max="5000"
                        />
                    </div>
                </div>
                <button
                    onClick={handleApplySize}
                    className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded hover:bg-gray-200 transition-colors text-xs"
                >
                    APLICAR TAMAÑO
                </button>
            </div>

            {/* Control de Zoom */}
            <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">🔍 Zoom</h4>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors font-bold text-gray-600"
                    >
                        -
                    </button>
                    <input
                        type="range"
                        min="0.25"
                        max="2"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                        className="flex-1 accent-blue-500"
                    />
                    <button
                        onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                        className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors font-bold text-gray-600"
                    >
                        +
                    </button>
                </div>
                <div className="text-center mt-1">
                    <span className="text-sm font-bold text-blue-600">
                        {Math.round(zoom * 100)}%
                    </span>
                </div>
                <button
                    onClick={() => onZoomChange(1)}
                    className="w-full mt-2 px-4 py-1 text-gray-400 hover:text-gray-600 rounded transition-colors text-xs underline"
                >
                    Restablecer (100%)
                </button>
            </div>

            {/* Crear Elemento Personalizado */}
            <div className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3">✨ Personalizado</h4>
                {!showCustomForm ? (
                    <button
                        onClick={() => setShowCustomForm(true)}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition-colors text-xs shadow-md"
                    >
                        + NUEVO ELEMENTO
                    </button>
                ) : (
                    <div className="space-y-2">
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="ej. Mesa Dulces"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Ancho</label>
                                <input
                                    type="number"
                                    value={customWidth}
                                    onChange={(e) => setCustomWidth(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    min="20"
                                    max="500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Alto</label>
                                <input
                                    type="number"
                                    value={customHeight}
                                    onChange={(e) => setCustomHeight(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    min="20"
                                    max="500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setShowCustomForm(false);
                                    setCustomName('');
                                    setCustomWidth('50');
                                    setCustomHeight('50');
                                }}
                                className="px-3 py-2 bg-gray-200 text-gray-500 rounded font-bold hover:bg-gray-300 transition-colors text-xs"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={handleCreateCustom}
                                disabled={!customName.trim()}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition-colors text-xs disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                            >
                                CREAR
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
