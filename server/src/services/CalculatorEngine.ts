export interface CalculationRule {
    type: 'RATIO' | 'FIXED' | 'RANGE';
    target?: 'GUESTS' | 'TABLES';
    ratio?: number; // e.g., 1 per 10 guests
    value?: number; // Fixed value
    min?: number;
    max?: number;
}

export class CalculatorEngine {

    /**
     * Calculates the required quantity of an item based on event details and rules.
     */
    static calculateQuantity(rule: CalculationRule | null, guestCount: number): number {
        if (!rule) return 1; // Default

        switch (rule.type) {
            case 'RATIO':
                if (rule.target === 'GUESTS' && rule.ratio) {
                    return Math.ceil(guestCount / rule.ratio);
                }
                // Future: Handle 'TABLES' target if we implement table layout logic
                return 1;

            case 'FIXED':
                return rule.value || 1;

            case 'RANGE':
                // Simple logic: if guests within range (implying this item applies), return 1 or fixed value
                // For now, minimal implementation
                if (guestCount >= (rule.min || 0) && guestCount <= (rule.max || 99999)) {
                    return rule.value || 1;
                }
                return 0; // Item not needed if out of range

            default:
                return 1;
        }
    }

    /**
     * Calculates the total price for a line item.
     */
    static calculateTotal(quantity: number, unitPrice: number): number {
        return quantity * unitPrice;
    }

    /**
     * Calculates the final quote totals including tax.
     */
    static calculateQuoteTotals(items: { total: number }[]) {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.16;
        return {
            subtotal,
            tax,
            total: subtotal + tax
        };
    }
}
