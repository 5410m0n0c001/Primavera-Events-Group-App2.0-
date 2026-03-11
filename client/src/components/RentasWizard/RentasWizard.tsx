import React from 'react';
import { useRentasWizard } from './RentasContext';
import Paso1Cliente from './Paso1Cliente';
import Paso2Seleccion from './Paso2Seleccion';
import Paso3Confirmacion from './Paso3Confirmacion';
import Paso4Devolucion from './Paso4Devolucion';

const steps = [
    { id: 1, name: 'Datos del cliente' },
    { id: 2, name: 'Selección de mobiliario' },
    { id: 3, name: 'Confirmación' },
    { id: 4, name: 'Recepción' }
];

const RentasWizard: React.FC = () => {
    const { stepActual } = useRentasWizard();

    const renderStep = () => {
        switch (stepActual) {
            case 1:
                return <Paso1Cliente />;
            case 2:
                return <Paso2Seleccion />;
            case 3:
                return <Paso3Confirmacion />;
            case 4:
                return <Paso4Devolucion />;
            default:
                return <Paso1Cliente />;
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb Progress */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10 w-full mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Nueva Renta de Mobiliario</h1>

                    <nav aria-label="Progress" className="hidden sm:block">
                        <ol role="list" className="flex space-x-8 items-center">
                            {steps.map((step) => (
                                <li key={step.name} className="relative">
                                    <div className="flex items-center">
                                        <span
                                            className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-200 
                        ${stepActual > step.id ? 'bg-indigo-600 text-white' :
                                                    stepActual === step.id ? 'bg-indigo-100 border-2 border-indigo-600 text-indigo-600' :
                                                        'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}
                                        >
                                            {stepActual > step.id ? (
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                step.id
                                            )}
                                        </span>
                                        <span
                                            className={`ml-4 text-sm font-medium transition-colors duration-200
                        ${stepActual >= step.id ? 'text-gray-900' : 'text-gray-400'}`}
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                    {step.id !== steps.length && (
                                        <div className="hidden sm:block absolute top-4 left-full -ml-px w-full max-w-full">
                                            <div className={`h-0.5 w-8 ${stepActual > step.id ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-y-auto">
                {renderStep()}
            </main>
        </div>
    );
};

export default RentasWizard;
