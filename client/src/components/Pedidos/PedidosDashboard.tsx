import React, { useState } from 'react';
import PedidosList from './PedidosList';
import PedidoForm from './PedidoForm';

type PedidosView = 'list' | 'new' | 'edit' | 'detail';

export default function PedidosDashboard() {
    const [view, setView] = useState<PedidosView>('list');
    const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);

    const handleCreateNew = () => {
        setSelectedPedidoId(null);
        setView('new');
    };

    const handleEdit = (id: string) => {
        setSelectedPedidoId(id);
        setView('edit');
    };

    const handleBackToList = () => {
        setSelectedPedidoId(null);
        setView('list');
    };

    return (
        <div className="w-full h-full animate-fade-in-up">
            {view === 'list' && (
                <PedidosList
                    onCreateNew={handleCreateNew}
                    onEdit={handleEdit}
                />
            )}

            {(view === 'new' || view === 'edit') && (
                <PedidoForm
                    pedidoId={selectedPedidoId}
                    onClose={handleBackToList}
                    onSave={handleBackToList}
                />
            )}
        </div>
    );
}
