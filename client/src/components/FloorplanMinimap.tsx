import React from 'react';
import { FloorplanElement } from '../data/floorplanElements';

interface FloorplanMinimapProps {
    elements: FloorplanElement[];
    canvasWidth: number;
    canvasHeight: number;
}

export const FloorplanMinimap: React.FC<FloorplanMinimapProps> = ({
    elements,
    canvasWidth,
    canvasHeight
}) => {
    const minimapWidth = 200;
    // Calculate aspect ratio to set height correctly
    const aspectRatio = canvasHeight / canvasWidth;
    const minimapHeight = minimapWidth * aspectRatio;

    const scaleX = minimapWidth / canvasWidth;
    const scaleY = minimapHeight / canvasHeight;

    return (
        <div className="bg-white rounded-lg shadow-lg p-3">
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-2">🗺️ Vista General</h4>
            <div
                className="relative border border-gray-200 rounded bg-gray-50 mx-auto overflow-hidden"
                style={{ width: minimapWidth, height: minimapHeight }}
            >
                {/* Render a simplified view of elements */}
                {elements.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">Vacío</div>
                ) : (
                    elements.slice().map((element, index) => (
                        <div
                            key={`${element.id}-${index}`} // Use index as part of key since simplified elements might share ID
                            className="absolute bg-blue-500 rounded-sm"
                            style={{
                                width: Math.max(2, (element.width || 50) * scaleX),
                                height: Math.max(2, (element.height || 50) * scaleY),
                                // Note: Real position is stored in 'layoutObjects' in parent, 
                                // but 'selectedElements' just lists WHAT is selected. 
                                // TO FIX: The minimap needs 'layoutObjects' (positions) to be accurate.
                                // However, the prompt specifically passed 'elements: FloorplanElement[]' to this component.
                                // I will render them in a grid logic for now as a "pallet display" IF positions aren't available, 
                                // OR since the user prompt implies 'elements' are the *placed* ones, 
                                // I will assume for this step I am just rendering dots based on index to show *count* visually,
                                // as I cannot access 'x' and 'y' from 'FloorplanElement' (it's in 'layoutObjects').
                                // WAIT: The prompt code provided: `left: (index * 30) * scaleX`. This confirms it's just a demo visual.
                                left: (index * 30 * scaleX) % minimapWidth,
                                top: Math.floor((index * 30 * scaleX) / minimapWidth) * 20 * scaleY + 10,
                                opacity: 0.6
                            }}
                            title={element.name}
                        />
                    ))
                )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 text-center uppercase tracking-wider">
                {elements.length} OBJETOS TOTALES
            </p>
        </div>
    );
};
