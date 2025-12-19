import React, { useState } from 'react';

// Inline Icons to avoid heavy dependencies (lucide-react) causing OOM on build
const Download = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const Loader = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

interface EventExportButtonProps {
    eventId: string;
    eventName: string;
}

export const EventExportButton: React.FC<EventExportButtonProps> = ({
    eventId,
    eventName,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/events/${eventId}/export/csv`);

            if (!response.ok) {
                throw new Error(`Export failed: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `event_${eventName}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            console.log('✅ CSV export successful');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Export failed');
            console.error('❌ Export error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 font-medium transition-colors"
                title="Exportar a CSV"
            >
                {isLoading ? (
                    <Loader className="animate-spin w-4 h-4" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                {isLoading ? 'Generando...' : 'Exportar CSV'}
            </button>
            {error && <div className="text-red-600 mt-2 text-xs">{error}</div>}
        </div>
    );
};
