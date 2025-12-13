export interface InventoryOptions {
    capacity?: string;
    location?: string;
    services?: string;
    // Add other dynamic fields here
    [key: string]: any;
}

export interface InventoryItem {
    id: string;
    name: string;
    unit: string;
    stock: number;
    price: number;
    subCategoryId?: string;
    options?: InventoryOptions; // Parsed object

    // Dynamic Availability Fields
    reserved?: number;
    available?: number;
    status?: 'AVAILABLE' | 'UNAVAILABLE' | 'LOW_STOCK';
}
