import React from 'react';

// Wrapper for React.lazy with min delay to avoid flash
export const lazyLoad = (importFunc: () => Promise<any>, delay = 300) => {
    return React.lazy(() => {
        return Promise.all([
            importFunc(),
            new Promise(resolve => setTimeout(resolve, delay))
        ]).then(([moduleExports]) => moduleExports);
    });
};

export const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
    });
};
