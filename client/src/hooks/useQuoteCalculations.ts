import { useMemo } from 'react';
import type { QuoteDraft } from '../types';

export const useQuoteCalculations = (draft: QuoteDraft) => {
    return useMemo(() => {
        let subtotal = 0;

        // Filter items by category/logic to match user's requested domain logic
        const items = draft.selectedItems || [];

        // Sum all items
        items.forEach(item => {
            // Enforce number type safety
            const unitPrice = Number(item.unitPrice) || Number(item.item?.price) || 0;
            const quantity = Number(item.quantity) || 0;

            // Strict calc
            subtotal += unitPrice * quantity;
        });

        const discount = Number(draft.discount) || 0;
        const subtotalAfterDiscount = Math.max(0, subtotal - discount);
        const iva = Number((subtotalAfterDiscount * 0.16).toFixed(2));
        const total = Number((subtotalAfterDiscount + iva).toFixed(2));

        const downPaymentPercentage = Number(draft.downPaymentPercentage) || 0;
        const downPaymentAmount = Number((total * (downPaymentPercentage / 100)).toFixed(2));

        const costPerPerson = (draft.guestCount > 0 && total > 0)
            ? total / draft.guestCount
            : 0;

        return {
            subtotal,
            discount,
            subtotalAfterDiscount,
            iva,
            tax: iva, // Backward compatibility alias
            total,
            downPaymentPercentage,
            downPaymentAmount,
            costPerPerson
        };
    }, [
        draft.selectedItems,
        draft.guestCount,
        draft.discount,
        draft.downPaymentPercentage
    ]);
};
