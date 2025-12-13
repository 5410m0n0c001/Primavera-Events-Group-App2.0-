export interface VenueFeature {
    id?: string;
    name: string;
    type: string; // Service, Restriction, Furniture
    value?: string;
}

export interface VenueImage {
    id?: string;
    url: string;
    caption?: string;
}

export interface Venue {
    id: string;
    name: string;
    description?: string;
    address?: string;
    capacity: number;
    priceRent?: number;
    pricePerHour?: number;
    features: VenueFeature[];
    images: VenueImage[];
}
