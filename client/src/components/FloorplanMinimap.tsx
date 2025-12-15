import React from 'react';

// Define a simplified interface for what the minimap needs to render
export interface MinimapItem {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    colorClass?: string;
    shape?: string;
}

interface FloorplanMinimapProps {
    items: MinimapItem[]; // Use live items, not static elements
    canvasWidth: number;
    canvasHeight: number;
}

export const FloorplanMinimap: React.FC<FloorplanMinimapProps> = ({
    items,
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
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-2">🗺️ Vista General (En Vivo)</h4>
            <div
                className="relative border border-gray-200 rounded bg-gray-50 mx-auto overflow-hidden"
                style={{ width: minimapWidth, height: minimapHeight }}
            >
                {items.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">Vacío</div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className={`absolute ${item.shape === 'circle' ? 'rounded-full' : 'rounded-sm'} transition-all duration-75`}
                            style={{
                                width: Math.max(3, item.width * scaleX),
                                height: Math.max(3, item.height * scaleY),
                                left: item.x * scaleX,
                                top: item.y * scaleY,
                                backgroundColor: item.colorClass?.includes('bg-') ? undefined : '#3b82f6', // Fallback color
                                opacity: 0.7
                            }}
                        >
                            {/* Try to extract color from tailwind class if possible, or just use CSS var. 
                    For now, simple blue block for clarity in minimap. 
                 */}
                            <div className="w-full h-full bg-blue-500/80"></div>
                        </div>
                    ))
                )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 text-center uppercase tracking-wider">
                {items.length} OBJETOS EN LIENZO
            </p>
        </div>
    );
};
