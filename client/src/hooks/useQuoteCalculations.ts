import { useMemo } from 'react';
import type { QuoteDraft } from '../types';

export const useQuoteCalculations = (draft: QuoteDraft) => {
    return useMemo(() => {
        let subtotal = 0;

        // Filter items by category/logic to match user's requested domain logic
        // ADAPTATION: Mapping current 'QuoteItem[]' to logic domains
        const items = draft.selectedItems || [];

        // Sum all items
        items.forEach(item => {
            // Enforce number type safety
            const unitPrice = Number(item.unitPrice) || Number(item.item?.price) || 0;
            const quantity = Number(item.quantity) || 0;

            // Strict calc
            subtotal += unitPrice * quantity;
        });

        const iva = Number((subtotal * 0.16).toFixed(2));
        const total = Number((subtotal + iva).toFixed(2));

        const costPerPerson = (draft.guestCount > 0 && total > 0)
            ? total / draft.guestCount
            : 0;

        return {
            subtotal,
            iva,
            tax: iva, // Backward compatibility alias
            total,
            costPerPerson
        };
    }, [
        draft.selectedItems,
        draft.guestCount
    ]);
};
