import React from 'react';
import { RentasProvider } from './RentasContext';
import RentasWizard from './RentasWizard';

const RentasWizardWrapper: React.FC = () => {
    return (
        <RentasProvider>
            <RentasWizard />
        </RentasProvider>
    );
};

export default RentasWizardWrapper;
