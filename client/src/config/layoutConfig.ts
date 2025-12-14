export interface LayoutItemConfig {
    type: string;
    label: string;
    width: number;
    height: number;
    shape: 'rect' | 'circle' | 'rounded';
    colorClass: string;
    icon?: string;
}

export interface LayoutCategory {
    id: string;
    title: string;
    items: LayoutItemConfig[];
}

export const LAYOUT_CATEGORIES: LayoutCategory[] = [
    {
        id: 'access',
        title: '1. Accesos y Recepción',
        items: [
            { type: 'access-guest', label: 'Acceso Invitados', width: 40, height: 40, shape: 'rect', colorClass: 'bg-green-500' },
            { type: 'access-provider', label: 'Acceso Proveedores', width: 40, height: 40, shape: 'rect', colorClass: 'bg-gray-500' },
            { type: 'welcome-table', label: 'Mesa Bienvenida', width: 60, height: 30, shape: 'rounded', colorClass: 'bg-blue-300' },
            { type: 'registration', label: 'Registro', width: 60, height: 30, shape: 'rect', colorClass: 'bg-blue-400' },
            { type: 'hostess', label: 'Hostess', width: 30, height: 30, shape: 'circle', colorClass: 'bg-pink-300' },
            { type: 'info-point', label: 'Información', width: 30, height: 30, shape: 'circle', colorClass: 'bg-blue-200' },
        ]
    },
    {
        id: 'parking',
        title: '2. Estacionamiento',
        items: [
            { type: 'parking-general', label: 'Est. General', width: 100, height: 60, shape: 'rect', colorClass: 'bg-gray-200 border-dashed' },
            { type: 'parking-vip', label: 'Est. VIP', width: 80, height: 50, shape: 'rect', colorClass: 'bg-yellow-100 border-dashed' },
            { type: 'valet', label: 'Valet Parking', width: 40, height: 40, shape: 'rect', colorClass: 'bg-red-400' },
            { type: 'bus-area', label: 'Area Autobuses', width: 120, height: 60, shape: 'rect', colorClass: 'bg-gray-300' },
        ]
    },
    {
        id: 'cocktail',
        title: '3. Cóctel y Bienvenida',
        items: [
            { type: 'cocktail-table', label: 'Periquera', width: 30, height: 30, shape: 'circle', colorClass: 'bg-orange-200' },
            { type: 'lounge', label: 'Sala Lounge', width: 80, height: 40, shape: 'rounded', colorClass: 'bg-purple-200' },
            { type: 'bar-welcome', label: 'Barra Bienvenida', width: 80, height: 30, shape: 'rect', colorClass: 'bg-amber-700 text-white' },
            { type: 'snack-station', label: 'Estación Botanas', width: 60, height: 30, shape: 'rect', colorClass: 'bg-orange-300' },
        ]
    },
    {
        id: 'outdoors',
        title: '4. Jardines y Exteriores',
        items: [
            { type: 'garden-main', label: 'Jardín Principal', width: 200, height: 200, shape: 'rounded', colorClass: 'bg-green-100 opacity-50' },
            { type: 'pathway', label: 'Camino', width: 100, height: 20, shape: 'rect', colorClass: 'bg-stone-200' },
            { type: 'pergola', label: 'Pérgola', width: 80, height: 80, shape: 'rect', colorClass: 'border-4 border-stone-600' },
            { type: 'umbrella', label: 'Sombrilla', width: 40, height: 40, shape: 'circle', colorClass: 'bg-yellow-100 border-yellow-400' },
            { type: 'smoking-area', label: 'Zona Fumadores', width: 50, height: 50, shape: 'rect', colorClass: 'bg-gray-400 opacity-50' },
        ]
    },
    {
        id: 'guests',
        title: '5. Área Invitados',
        items: [
            { type: 'table-round', label: 'Mesa Redonda', width: 60, height: 60, shape: 'circle', colorClass: 'bg-blue-100 border-blue-400' },
            { type: 'table-rect', label: 'Mesa Rectangular', width: 80, height: 40, shape: 'rect', colorClass: 'bg-blue-100 border-blue-400' },
            { type: 'table-imperial', label: 'Mesa Imperial', width: 120, height: 40, shape: 'rect', colorClass: 'bg-blue-200 border-blue-500' },
            { type: 'chair', label: 'Silla', width: 20, height: 20, shape: 'rect', colorClass: 'bg-red-100' },
            { type: 'table-wedding', label: 'Mesa Novios', width: 100, height: 50, shape: 'rounded', colorClass: 'bg-yellow-100 border-yellow-500' },
            { type: 'kids-area', label: 'Área Infantil', width: 100, height: 100, shape: 'rounded', colorClass: 'bg-pink-100 border-dashed' },
        ]
    },
    {
        id: 'food',
        title: '6. Alimentos / Buffet',
        items: [
            { type: 'buffet-hot', label: 'Buffet Caliente', width: 100, height: 30, shape: 'rect', colorClass: 'bg-red-200' },
            { type: 'buffet-cold', label: 'Buffet Frío', width: 100, height: 30, shape: 'rect', colorClass: 'bg-blue-200' },
            { type: 'salad-bar', label: 'Barra Ensaladas', width: 80, height: 30, shape: 'rect', colorClass: 'bg-green-200' },
            { type: 'dessert-bar', label: 'Barra Postres', width: 80, height: 30, shape: 'rect', colorClass: 'bg-pink-200' },
            { type: 'taco-station', label: 'Est. Tacos', width: 60, height: 40, shape: 'rect', colorClass: 'bg-orange-200' },
        ]
    },
    {
        id: 'kitchen',
        title: '7. Cocinas y Operación',
        items: [
            { type: 'kitchen-hot', label: 'Cocina Caliente', width: 80, height: 80, shape: 'rect', colorClass: 'bg-red-100 border-red-500' },
            { type: 'kitchen-cold', label: 'Cocina Fría', width: 80, height: 80, shape: 'rect', colorClass: 'bg-blue-100 border-blue-500' },
            { type: 'prep-area', label: 'Preparación', width: 60, height: 60, shape: 'rect', colorClass: 'bg-gray-200' },
            { type: 'trash-area', label: 'Basura', width: 40, height: 40, shape: 'rect', colorClass: 'bg-gray-600 text-white' },
            { type: 'gas-area', label: 'Gas', width: 30, height: 30, shape: 'rect', colorClass: 'bg-red-600 text-white' },
        ]
    },
    {
        id: 'bars',
        title: '8. Barras de Bebidas',
        items: [
            { type: 'bar-main', label: 'Barra Principal', width: 120, height: 40, shape: 'rect', colorClass: 'bg-amber-800 text-white' },
            { type: 'bar-vip', label: 'Barra VIP', width: 80, height: 40, shape: 'rect', colorClass: 'bg-amber-600 text-white' },
            { type: 'bar-beer', label: 'Cerveza', width: 60, height: 30, shape: 'rect', colorClass: 'bg-yellow-500' },
            { type: 'coffee-station', label: 'Café', width: 50, height: 30, shape: 'rect', colorClass: 'bg-brown-600 text-white' },
        ]
    },
    {
        id: 'stage',
        title: '9. Escenario y Audio',
        items: [
            { type: 'stage-main', label: 'Escenario', width: 150, height: 80, shape: 'rect', colorClass: 'bg-gray-800 text-white' },
            { type: 'dj-booth', label: 'DJ Booth', width: 50, height: 30, shape: 'rect', colorClass: 'bg-black text-white' },
            { type: 'dance-floor', label: 'Pista Baile', width: 120, height: 120, shape: 'rect', colorClass: 'bg-gray-300 border-2 border-gray-500' },
            { type: 'screen-led', label: 'Pantalla LED', width: 80, height: 10, shape: 'rect', colorClass: 'bg-blue-900' },
            { type: 'speaker', label: 'Bocina', width: 20, height: 20, shape: 'rect', colorClass: 'bg-black' },
        ]
    },
    {
        id: 'entertainment',
        title: '10. Entretenimiento',
        items: [
            { type: 'photo-booth', label: 'Photo Booth', width: 50, height: 50, shape: 'rect', colorClass: 'bg-pink-400 text-white' },
            { type: 'camera-360', label: 'Cabina 360', width: 40, height: 40, shape: 'circle', colorClass: 'bg-purple-500 text-white' },
            { type: 'kids-inflatable', label: 'Inflable', width: 100, height: 100, shape: 'rounded', colorClass: 'bg-yellow-300' },
            { type: 'mech-bull', label: 'Toro Mecánico', width: 80, height: 80, shape: 'circle', colorClass: 'bg-red-400' },
        ]
    },
    {
        id: 'tents',
        title: '11. Carpas',
        items: [
            { type: 'tent-main', label: 'Carpa Principal', width: 300, height: 200, shape: 'rect', colorClass: 'border-2 border-gray-400 bg-white opacity-80' },
            { type: 'tent-ceremony', label: 'Carpa Ceremonia', width: 150, height: 100, shape: 'rect', colorClass: 'border-2 border-gray-400 bg-white opacity-80' },
            { type: 'tent-staff', label: 'Carpa Staff', width: 80, height: 60, shape: 'rect', colorClass: 'bg-gray-200' },
        ]
    },
    {
        id: 'ceremony',
        title: '12. Ceremonia',
        items: [
            { type: 'altar', label: 'Altar', width: 60, height: 30, shape: 'rect', colorClass: 'bg-yellow-200' },
            { type: 'arch', label: 'Arco Floral', width: 60, height: 10, shape: 'rounded', colorClass: 'bg-green-400' },
            { type: 'aisle', label: 'Pasillo', width: 200, height: 40, shape: 'rect', colorClass: 'bg-red-100' },
        ]
    },
    {
        id: 'gifts',
        title: '13. Regalos',
        items: [
            { type: 'gift-table', label: 'Mesa Regalos', width: 60, height: 30, shape: 'rect', colorClass: 'bg-pink-100' },
            { type: 'safe-box', label: 'Caja Sobres', width: 20, height: 20, shape: 'rect', colorClass: 'bg-gray-600 text-white' },
        ]
    },
    {
        id: 'restrooms',
        title: '14. Baños',
        items: [
            { type: 'wc-women', label: 'Baños M', width: 60, height: 60, shape: 'rect', colorClass: 'bg-pink-200' },
            { type: 'wc-men', label: 'Baños H', width: 60, height: 60, shape: 'rect', colorClass: 'bg-blue-200' },
            { type: 'hand-wash', label: 'Lavamanos', width: 40, height: 20, shape: 'rect', colorClass: 'bg-cyan-100' },
        ]
    },
    {
        id: 'staff',
        title: '15. Staff y Proveedores',
        items: [
            { type: 'staff-area', label: 'Área Staff', width: 80, height: 80, shape: 'rect', colorClass: 'bg-gray-400' },
            { type: 'provider-area', label: 'Prov.', width: 80, height: 80, shape: 'rect', colorClass: 'bg-gray-500' },
        ]
    },
    {
        id: 'security',
        title: '16. Seguridad',
        items: [
            { type: 'security-guard', label: 'Seguridad', width: 20, height: 20, shape: 'circle', colorClass: 'bg-black text-white' },
            { type: 'first-aid', label: 'Primeros Auxilios', width: 40, height: 40, shape: 'rect', colorClass: 'bg-white border-2 border-red-500' },
            { type: 'extinguisher', label: 'Extintor', width: 20, height: 20, shape: 'rect', colorClass: 'bg-red-600' },
            { type: 'meeting-point', label: 'Punto Reunión', width: 40, height: 40, shape: 'circle', colorClass: 'bg-green-500 text-white' },
        ]
    },
    {
        id: 'lighting',
        title: '17. Iluminación y Energía',
        items: [
            { type: 'generator', label: 'Planta Luz', width: 50, height: 40, shape: 'rect', colorClass: 'bg-yellow-600' },
            { type: 'light-tower', label: 'Torre Luz', width: 20, height: 20, shape: 'rect', colorClass: 'bg-yellow-400' },
        ]
    }
];
