type EventProps = Record<string, any>;

export const Analytics = {
    init: () => {
        if (import.meta.env.PROD) {
            console.log('Analytics initialized');
            // Init Google Analytics / Mixpanel here
        }
    },

    trackPageView: (path: string) => {
        if (import.meta.env.PROD) {
            console.log(`[Analytics] Page View: ${path}`);
            // gtag('config', 'GA_MEASUREMENT_ID', { page_path: path });
        }
    },

    trackEvent: (category: string, action: string, props?: EventProps) => {
        if (import.meta.env.PROD) {
            console.log(`[Analytics] Event: ${category} - ${action}`, props);
        }
    },

    trackError: (error: Error) => {
        if (import.meta.env.PROD) {
            console.error(`[Analytics] Error tracked:`, error);
        }
    }
};
