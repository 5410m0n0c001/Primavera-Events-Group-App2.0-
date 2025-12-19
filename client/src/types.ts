export interface CatalogItem {
    id: string;
    name: string;
    subCategoryId?: string;
    price: number;
    unit: string;
    options: string | null;
    description?: string; // Added for UI
    category?: string;    // Added for UI
}

export interface CatalogSubCategory {
    id: string;
    name: string;
    items: CatalogItem[];
}

export interface CatalogCategory {
    id: string;
    name: string;
    description: string | null;
    subCategories: CatalogSubCategory[];
}

export interface QuoteItem {
    id?: string; // Added for internal tracking
    serviceItemId: string;
    quantity: number;
    notes?: string;

    // Enriched for UI
    item?: CatalogItem;
    unitPrice?: number; // Snapshot price
    cost?: number;      // Calculated total
}

export interface QuoteDraft {
    eventId?: string;
    eventName: string;
    guestCount: number;
    date: string;

    selectedItems: QuoteItem[];

    // Financial Settings
    downPaymentPercentage?: number;
    paymentLimitDate?: string;
    discount?: number;     // Fixed amount
}
