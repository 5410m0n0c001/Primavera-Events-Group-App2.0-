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
            { type: 'acc-main', label: 'Acceso principal invitados', width: 60, height: 40, shape: 'rect', colorClass: 'bg-green-600 text-white' },
            { type: 'acc-prov', label: 'Acceso proveedores', width: 50, height: 40, shape: 'rect', colorClass: 'bg-gray-600 text-white' },
            { type: 'acc-staff', label: 'Acceso staff', width: 50, height: 40, shape: 'rect', colorClass: 'bg-gray-500 text-white' },
            { type: 'reception', label: 'Recepción', width: 80, height: 30, shape: 'rect', colorClass: 'bg-blue-300' },
            { type: 'welcome-tbl', label: 'Mesa de bienvenida', width: 60, height: 30, shape: 'rounded', colorClass: 'bg-blue-200' },
            { type: 'reg-tbl', label: 'Mesa de registro', width: 60, height: 30, shape: 'rect', colorClass: 'bg-blue-400' },
            { type: 'tickets', label: 'Área de pulseras / boletos', width: 50, height: 30, shape: 'rect', colorClass: 'bg-purple-300' },
            { type: 'turnstiles', label: 'Tornafiesta / torniquetes', width: 40, height: 40, shape: 'rect', colorClass: 'bg-yellow-600' },
            { type: 'hostess', label: 'Área de hostess', width: 30, height: 30, shape: 'circle', colorClass: 'bg-pink-300' },
            { type: 'guest-ctrl', label: 'Área de control de invitados', width: 50, height: 30, shape: 'rect', colorClass: 'bg-red-300' },
            { type: 'info', label: 'Punto de información', width: 30, height: 30, shape: 'circle', colorClass: 'bg-blue-500 text-white' },
            { type: 'signs', label: 'Señalética general', width: 20, height: 20, shape: 'rect', colorClass: 'bg-yellow-400' },
        ]
    },
    {
        id: 'parking',
        title: '2. Estacionamiento y Movilidad',
        items: [
            { type: 'park-gen', label: 'Estacionamiento general', width: 100, height: 80, shape: 'rect', colorClass: 'bg-gray-300 border-dashed' },
            { type: 'park-vip', label: 'Estacionamiento VIP', width: 80, height: 60, shape: 'rect', colorClass: 'bg-yellow-100 border-dashed border-yellow-500' },
            { type: 'park-prov', label: 'Estacionamiento proveedores', width: 80, height: 60, shape: 'rect', colorClass: 'bg-gray-400 border-dashed' },
            { type: 'park-staff', label: 'Estacionamiento staff', width: 60, height: 40, shape: 'rect', colorClass: 'bg-gray-500 border-dashed' },
            { type: 'valet', label: 'Área de valet parking', width: 60, height: 40, shape: 'rect', colorClass: 'bg-red-500 text-white' },
            { type: 'drop-off', label: 'Zona de ascenso y descenso', width: 80, height: 30, shape: 'rect', colorClass: 'bg-green-200' },
            { type: 'road', label: 'Circulación vehicular', width: 100, height: 20, shape: 'rect', colorClass: 'bg-black text-white' },
            { type: 'bus', label: 'Área de autobuses / vans', width: 120, height: 60, shape: 'rect', colorClass: 'bg-blue-800 text-white' },
            { type: 'ramps', label: 'Rampas para discapacidad', width: 30, height: 30, shape: 'rect', colorClass: 'bg-blue-500 text-white' },
            { type: 'light-park', label: 'Iluminación de estacionamiento', width: 20, height: 20, shape: 'circle', colorClass: 'bg-yellow-300' },
        ]
    },
    {
        id: 'cocktail',
        title: '3. Área de Cóctel / Bienvenida',
        items: [
            { type: 'cocktail-area', label: 'Área de cóctel', width: 150, height: 100, shape: 'rounded', colorClass: 'bg-orange-100 opacity-50' },
            { type: 'high-table', label: 'Mesas cocteleras', width: 30, height: 30, shape: 'circle', colorClass: 'bg-orange-300' },
            { type: 'periquera', label: 'Periqueras', width: 25, height: 25, shape: 'circle', colorClass: 'bg-orange-400' },
            { type: 'lounge', label: 'Sillones lounge', width: 60, height: 30, shape: 'rounded', colorClass: 'bg-purple-300' },
            { type: 'bar-welcome', label: 'Barra de bienvenida', width: 80, height: 30, shape: 'rect', colorClass: 'bg-amber-700 text-white' },
            { type: 'bar-mixo', label: 'Barra de mixología', width: 60, height: 30, shape: 'rect', colorClass: 'bg-purple-800 text-white' },
            { type: 'bar-soft', label: 'Barra de bebidas sin alcohol', width: 60, height: 30, shape: 'rect', colorClass: 'bg-blue-300' },
            { type: 'water-stn', label: 'Estación de aguas frescas', width: 40, height: 30, shape: 'rect', colorClass: 'bg-cyan-200' },
            { type: 'snack-stn', label: 'Estación de botanas', width: 40, height: 30, shape: 'rect', colorClass: 'bg-yellow-600' },
        ]
    },
    {
        id: 'gardens',
        title: '4. Área de Jardines / Exteriores',
        items: [
            { type: 'garden-main', label: 'Jardines principales', width: 200, height: 200, shape: 'rounded', colorClass: 'bg-green-200 opacity-40' },
            { type: 'garden-sec', label: 'Jardines secundarios', width: 150, height: 150, shape: 'rounded', colorClass: 'bg-green-100 opacity-40' },
            { type: 'green-area', label: 'Áreas verdes delimitadas', width: 100, height: 100, shape: 'rect', colorClass: 'border-2 border-green-600' },
            { type: 'path', label: 'Caminos peatonales', width: 100, height: 15, shape: 'rect', colorClass: 'bg-stone-300' },
            { type: 'pergola', label: 'Pérgolas', width: 80, height: 80, shape: 'rect', colorClass: 'border-4 border-stone-700' },
            { type: 'umbrella', label: 'Sombrillas', width: 40, height: 40, shape: 'circle', colorClass: 'bg-white border-2 border-yellow-400' },
            { type: 'light-ext', label: 'Iluminación exterior', width: 15, height: 15, shape: 'circle', colorClass: 'bg-yellow-200' },
            { type: 'rest-area', label: 'Área de descanso', width: 80, height: 60, shape: 'rounded', colorClass: 'bg-stone-100' },
            { type: 'smoking', label: 'Zona de fumadores', width: 50, height: 50, shape: 'rect', colorClass: 'bg-gray-400' },
        ]
    },
    {
        id: 'guests',
        title: '5. Área de Invitados',
        items: [
            { type: 'round-tbl', label: 'Mesas redondas', width: 50, height: 50, shape: 'circle', colorClass: 'bg-blue-100 border-2 border-blue-300' },
            { type: 'rect-tbl', label: 'Mesas rectangulares', width: 70, height: 35, shape: 'rect', colorClass: 'bg-blue-100 border-2 border-blue-300' },
            { type: 'imp-tbl', label: 'Mesas imperiales', width: 100, height: 40, shape: 'rect', colorClass: 'bg-purple-100 border-2 border-purple-300' },
            { type: 'chair', label: 'Sillas', width: 15, height: 15, shape: 'rec', colorClass: 'bg-stone-300' },
            { type: 'novios-tbl', label: 'Mesa de novios', width: 80, height: 40, shape: 'rounded', colorClass: 'bg-yellow-100 border-2 border-yellow-500' },
            { type: 'honor-tbl', label: 'Mesa de honor', width: 90, height: 40, shape: 'rounded', colorClass: 'bg-red-100 border-2 border-red-500' },
            { type: 'family-tbl', label: 'Mesa de familia', width: 60, height: 60, shape: 'circle', colorClass: 'bg-pink-100 border-2 border-pink-500' },
            { type: 'kids-zone', label: 'Área infantil', width: 100, height: 80, shape: 'rounded', colorClass: 'bg-blue-50 border-dashed border-blue-400' },
            { type: 'seniors', label: 'Área adultos mayores', width: 80, height: 60, shape: 'rounded', colorClass: 'bg-yellow-50 border-dashed border-yellow-400' },
        ]
    },
    {
        id: 'food',
        title: '6. Alimentos – Buffet y Estaciones',
        items: [
            { type: 'buffet-main', label: 'Buffet', width: 120, height: 40, shape: 'rect', colorClass: 'bg-amber-100' },
            { type: 'buffet-hot', label: 'Barra de buffet caliente', width: 100, height: 30, shape: 'rect', colorClass: 'bg-red-200' },
            { type: 'buffet-cold', label: 'Barra de buffet frío', width: 100, height: 30, shape: 'rect', colorClass: 'bg-blue-200' },
            { type: 'salad-bar', label: 'Barra de ensaladas', width: 80, height: 30, shape: 'rect', colorClass: 'bg-green-200' },
            { type: 'soup-bar', label: 'Barra de sopas', width: 80, height: 30, shape: 'rect', colorClass: 'bg-orange-200' },
            { type: 'sides-bar', label: 'Barra de guarniciones', width: 80, height: 30, shape: 'rect', colorClass: 'bg-yellow-200' },
            { type: 'dessert-bar', label: 'Barra de postres', width: 80, height: 30, shape: 'rect', colorClass: 'bg-pink-200' },
            { type: 'bread-bar', label: 'Barra de pan', width: 50, height: 30, shape: 'rect', colorClass: 'bg-amber-300' },
            { type: 'sauce-stn', label: 'Estación de salsas', width: 40, height: 30, shape: 'rect', colorClass: 'bg-red-400' },
            { type: 'cutlery', label: 'Área de platos y cubiertos', width: 50, height: 30, shape: 'rect', colorClass: 'bg-gray-300' },
            { type: 'taco-stn', label: 'Estación de tacos', width: 60, height: 40, shape: 'rect', colorClass: 'bg-orange-400' },
            { type: 'mex-stn', label: 'Estación antojitos', width: 60, height: 40, shape: 'rect', colorClass: 'bg-green-500 text-white' },
            { type: 'grill-stn', label: 'Estación de parrilla', width: 80, height: 40, shape: 'rect', colorClass: 'bg-stone-700 text-white' },
            { type: 'seafood-stn', label: 'Estación de mariscos', width: 70, height: 40, shape: 'rect', colorClass: 'bg-cyan-500 text-white' },
            { type: 'pasta-stn', label: 'Estación de pasta', width: 70, height: 40, shape: 'rect', colorClass: 'bg-yellow-100 border-red-500' },
            { type: 'kids-food', label: 'Estación comida infantil', width: 60, height: 40, shape: 'rect', colorClass: 'bg-purple-200' },
        ]
    },
    {
        id: 'kitchen',
        title: '7. Cocinas y Operación',
        items: [
            { type: 'kitchen-hot', label: 'Cocina caliente', width: 80, height: 80, shape: 'rect', colorClass: 'bg-red-100 border-2 border-red-500' },
            { type: 'kitchen-cold', label: 'Cocina fría', width: 80, height: 80, shape: 'rect', colorClass: 'bg-blue-100 border-2 border-blue-500' },
            { type: 'prep-area', label: 'Área de preparación', width: 60, height: 60, shape: 'rect', colorClass: 'bg-gray-200' },
            { type: 'plating', label: 'Área de emplatado', width: 60, height: 40, shape: 'rect', colorClass: 'bg-white border text-center' },
            { type: 'wash-area', label: 'Área de lavado', width: 50, height: 50, shape: 'rect', colorClass: 'bg-blue-800 text-white' },
            { type: 'trash', label: 'Área de basura', width: 40, height: 40, shape: 'rect', colorClass: 'bg-black text-white' },
            { type: 'recycle', label: 'Área de reciclaje', width: 40, height: 40, shape: 'rect', colorClass: 'bg-green-700 text-white' },
            { type: 'dry-store', label: 'Almacén seco', width: 60, height: 60, shape: 'rect', colorClass: 'bg-amber-200' },
            { type: 'fridge', label: 'Cámara de refrigeración', width: 60, height: 60, shape: 'rect', colorClass: 'bg-cyan-100 border-2 border-cyan-500' },
            { type: 'gas', label: 'Área de gas', width: 30, height: 30, shape: 'rect', colorClass: 'bg-red-600 text-white' },
            { type: 'electric', label: 'Área eléctrica', width: 30, height: 30, shape: 'rect', colorClass: 'bg-yellow-500' },
            { type: 'kitchen-tent', label: 'Carpa de cocina', width: 100, height: 100, shape: 'rect', colorClass: 'bg-gray-100 opacity-80' },
        ]
    },
    {
        id: 'bars',
        title: '8. Barras de Bebidas',
        items: [
            { type: 'bar-main', label: 'Barra principal', width: 120, height: 40, shape: 'rect', colorClass: 'bg-amber-900 text-white' },
            { type: 'bar-sec', label: 'Barras secundarias', width: 80, height: 40, shape: 'rect', colorClass: 'bg-amber-700 text-white' },
            { type: 'bar-vip', label: 'Barra VIP', width: 80, height: 40, shape: 'rect', colorClass: 'bg-purple-900 text-white' },
            { type: 'wine-bar', label: 'Barra de vinos', width: 60, height: 30, shape: 'rect', colorClass: 'bg-red-900 text-white' },
            { type: 'beer-bar', label: 'Barra de cerveza', width: 60, height: 30, shape: 'rect', colorClass: 'bg-yellow-600 text-white' },
            { type: 'tequila-bar', label: 'Barra tequila/mezcal', width: 60, height: 30, shape: 'rect', colorClass: 'bg-green-700 text-white' },
            { type: 'coffee-bar', label: 'Barra de café', width: 50, height: 30, shape: 'rect', colorClass: 'bg-brown-500 text-white' },
            { type: 'soda-bar', label: 'Barra de refrescos', width: 60, height: 30, shape: 'rect', colorClass: 'bg-red-500 text-white' },
            { type: 'coolers', label: 'Hieleras', width: 30, height: 20, shape: 'rect', colorClass: 'bg-blue-300' },
            { type: 'glassware', label: 'Área de cristalería', width: 40, height: 40, shape: 'rect', colorClass: 'bg-gray-100 border' },
        ]
    },
    {
        id: 'stage',
        title: '9. Escenario, Audio y Show',
        items: [
            { type: 'stage', label: 'Escenario / stage', width: 150, height: 80, shape: 'rect', colorClass: 'bg-black text-white' },
            { type: 'dj-platform', label: 'Tarima DJ', width: 60, height: 40, shape: 'rect', colorClass: 'bg-gray-800 text-white' },
            { type: 'backdrop', label: 'Backdrop', width: 100, height: 10, shape: 'rect', colorClass: 'bg-pink-500' },
            { type: 'dj-booth', label: 'Cabina DJ', width: 60, height: 30, shape: 'rect', colorClass: 'bg-gray-900 text-white' },
            { type: 'band-area', label: 'Área grupo musical', width: 120, height: 80, shape: 'rect', colorClass: 'bg-gray-700 opacity-50' },
            { type: 'mariachi', label: 'Área mariachi', width: 80, height: 60, shape: 'circle', colorClass: 'bg-stone-800 text-white' },
            { type: 'norteno', label: 'Área norteño', width: 80, height: 60, shape: 'circle', colorClass: 'bg-stone-700 text-white' },
            { type: 'screens', label: 'Pantallas LED', width: 80, height: 5, shape: 'rect', colorClass: 'bg-blue-600' },
            { type: 'projector', label: 'Proyector', width: 20, height: 20, shape: 'rect', colorClass: 'bg-white border' },
            { type: 'audio-towers', label: 'Torres de audio', width: 20, height: 20, shape: 'rect', colorClass: 'bg-black' },
            { type: 'tech-booth', label: 'Cabina de control', width: 40, height: 30, shape: 'rect', colorClass: 'bg-gray-800 text-green-400' },
            { type: 'cold-fire', label: 'Área fuegos fríos', width: 30, height: 30, shape: 'circle', colorClass: 'bg-yellow-200' },
        ]
    },
    {
        id: 'dance',
        title: '10. Pista de Baile y Entretenimiento',
        items: [
            { type: 'dance-floor', label: 'Pista de baile', width: 150, height: 150, shape: 'rect', colorClass: 'bg-gray-200 border-2 border-gray-400' },
            { type: 'animators', label: 'Área de animadores', width: 60, height: 40, shape: 'rect', colorClass: 'bg-purple-200' },
            { type: 'photobooth', label: 'Photo booth', width: 50, height: 50, shape: 'rect', colorClass: 'bg-pink-200' },
            { type: 'camera-360', label: 'Cabina 360', width: 40, height: 40, shape: 'circle', colorClass: 'bg-purple-600 text-white' },
            { type: 'souvenirs', label: 'Área de recuerdos', width: 50, height: 30, shape: 'rect', colorClass: 'bg-amber-200' },
            { type: 'surprises', label: 'Área de sorpresas', width: 50, height: 50, shape: 'rect', colorClass: 'bg-cyan-200' },
            { type: 'inflatables', label: 'Juegos inflables', width: 100, height: 100, shape: 'rect', colorClass: 'bg-yellow-400' },
            { type: 'kids-infl', label: 'Inflables infantiles', width: 80, height: 80, shape: 'rect', colorClass: 'bg-green-400' },
            { type: 'mech-infl', label: 'Inflables mecánicos', width: 100, height: 100, shape: 'rect', colorClass: 'bg-red-400' },
            { type: 'bull', label: 'Toros mecánicos', width: 60, height: 60, shape: 'circle', colorClass: 'bg-brown-600 text-white' },
        ]
    },
    {
        id: 'tents',
        title: '11. Carpas',
        items: [
            { type: 'tent-main', label: 'Carpa principal', width: 300, height: 200, shape: 'rect', colorClass: 'border-2 border-stone-400 bg-white opacity-90' },
            { type: 'tent-ceremony', label: 'Carpa ceremonia', width: 150, height: 100, shape: 'rect', colorClass: 'border-2 border-stone-400 bg-white opacity-90' },
            { type: 'tent-cocktail', label: 'Carpa cóctel', width: 150, height: 100, shape: 'rect', colorClass: 'border-2 border-stone-400 bg-white opacity-80' },
            { type: 'tent-buffet', label: 'Carpa buffet', width: 120, height: 80, shape: 'rect', colorClass: 'border-2 border-stone-400 bg-gray-50 opacity-80' },
            { type: 'tent-bars', label: 'Carpa barras', width: 100, height: 60, shape: 'rect', colorClass: 'border-2 border-stone-400 bg-gray-50 opacity-80' },
            { type: 'tent-infl', label: 'Carpa inflables', width: 150, height: 150, shape: 'rect', colorClass: 'bg-yellow-100 opacity-50' },
            { type: 'tent-staff', label: 'Carpa staff', width: 80, height: 60, shape: 'rect', colorClass: 'bg-gray-200' },
            { type: 'tent-prov', label: 'Carpa proveedores', width: 80, height: 60, shape: 'rect', colorClass: 'bg-gray-300' },
            { type: 'tent-medical', label: 'Carpa primeros auxilios', width: 40, height: 40, shape: 'rect', colorClass: 'bg-white border-2 border-red-500' },
        ]
    },
    {
        id: 'ceremony',
        title: '12. Ceremonia',
        items: [
            { type: 'altar', label: 'Altar', width: 60, height: 30, shape: 'rect', colorClass: 'bg-yellow-100 border' },
            { type: 'arch', label: 'Arco', width: 60, height: 10, shape: 'rounded', colorClass: 'bg-green-500' },
            { type: 'aisle', label: 'Pasillo', width: 150, height: 30, shape: 'rect', colorClass: 'bg-red-50' },
            { type: 'ceremony-chair', label: 'Sillas ceremonia', width: 15, height: 15, shape: 'rect', colorClass: 'bg-white border' },
            { type: 'ritual-tbl', label: 'Mesa ritual', width: 40, height: 30, shape: 'rect', colorClass: 'bg-amber-200' },
            { type: 'officiant', label: 'Área oficiante', width: 30, height: 30, shape: 'circle', colorClass: 'bg-gray-200' },
            { type: 'musicians', label: 'Área músicos', width: 50, height: 40, shape: 'rect', colorClass: 'bg-gray-200' },
        ]
    },
    {
        id: 'gifts',
        title: '13. Regalos y Experiencias',
        items: [
            { type: 'gift-tbl', label: 'Mesa de regalos', width: 60, height: 30, shape: 'rect', colorClass: 'bg-pink-100' },
            { type: 'envelopes', label: 'Área de sobres', width: 30, height: 30, shape: 'rect', colorClass: 'bg-white border' },
            { type: 'gifts-phys', label: 'Área de regalos físicos', width: 50, height: 50, shape: 'rect', colorClass: 'bg-green-100' },
            { type: 'storage', label: 'Área de resguardo', width: 40, height: 40, shape: 'rect', colorClass: 'bg-gray-400' },
            { type: 'safe', label: 'Caja de seguridad', width: 20, height: 20, shape: 'rect', colorClass: 'bg-black text-white' },
        ]
    },
    {
        id: 'restrooms',
        title: '14. Baños y Servicios',
        items: [
            { type: 'wc-fixed', label: 'Baños fijos', width: 80, height: 60, shape: 'rect', colorClass: 'bg-blue-200' },
            { type: 'wc-mobile', label: 'Baños móviles', width: 60, height: 40, shape: 'rect', colorClass: 'bg-blue-100' },
            { type: 'wc-vip', label: 'Baños VIP', width: 60, height: 40, shape: 'rect', colorClass: 'bg-purple-200' },
            { type: 'wc-staff', label: 'Baños staff', width: 50, height: 40, shape: 'rect', colorClass: 'bg-gray-300' },
            { type: 'sinks', label: 'Lavamanos', width: 40, height: 20, shape: 'rect', colorClass: 'bg-cyan-100' },
            { type: 'clean', label: 'Área de limpieza', width: 30, height: 30, shape: 'rect', colorClass: 'bg-white border' },
        ]
    },
    {
        id: 'staff-log',
        title: '15. Staff y Proveedores',
        items: [
            { type: 'staff-zone', label: 'Área staff', width: 80, height: 80, shape: 'rect', colorClass: 'bg-gray-400' },
            { type: 'lockers', label: 'Vestidores', width: 60, height: 40, shape: 'rect', colorClass: 'bg-stone-300' },
            { type: 'rest-staff', label: 'Área descanso', width: 60, height: 40, shape: 'rect', colorClass: 'bg-stone-200' },
            { type: 'coord', label: 'Área de coordinación', width: 50, height: 40, shape: 'rect', colorClass: 'bg-blue-100' },
            { type: 'prov-zone', label: 'Área de proveedores', width: 80, height: 60, shape: 'rect', colorClass: 'bg-gray-500 text-white' },
            { type: 'load-unload', label: 'Carga y descarga', width: 100, height: 60, shape: 'rect', colorClass: 'border-2 border-yellow-500 border-dashed' },
        ]
    },
    {
        id: 'security',
        title: '16. Seguridad y Emergencias',
        items: [
            { type: 'private-sec', label: 'Seguridad privada', width: 20, height: 20, shape: 'circle', colorClass: 'bg-black text-white' },
            { type: 'first-aid', label: 'Punto primeros auxilios', width: 40, height: 40, shape: 'rect', colorClass: 'bg-white border-2 border-red-500' },
            { type: 'ambulance', label: 'Ambulancia', width: 60, height: 30, shape: 'rect', colorClass: 'bg-red-600 text-white' },
            { type: 'meeting', label: 'Punto de reunión', width: 40, height: 40, shape: 'circle', colorClass: 'bg-green-500 text-white' },
            { type: 'extinguisher', label: 'Extintores', width: 20, height: 20, shape: 'rect', colorClass: 'bg-red-600' },
            { type: 'evac-route', label: 'Rutas de evacuación', width: 80, height: 10, shape: 'rect', colorClass: 'bg-green-200' },
            { type: 'emerg-exit', label: 'Salidas de emergencia', width: 40, height: 20, shape: 'rect', colorClass: 'bg-green-500 text-white' },
            { type: 'cctv', label: 'CCTV', width: 20, height: 20, shape: 'rect', colorClass: 'bg-black border-2 border-white' },
        ]
    },
    {
        id: 'power',
        title: '17. Iluminación y Energía',
        items: [
            { type: 'gen-power', label: 'Planta de luz', width: 60, height: 40, shape: 'rect', colorClass: 'bg-yellow-600' },
            { type: 'electric-panel', label: 'Tablero eléctrico', width: 30, height: 30, shape: 'rect', colorClass: 'bg-gray-400' },
            { type: 'cabling', label: 'Cableado', width: 100, height: 5, shape: 'rect', colorClass: 'bg-black' },
            { type: 'light-tower', label: 'Torres de iluminación', width: 20, height: 20, shape: 'rect', colorClass: 'bg-yellow-400' },
            { type: 'ambient-light', label: 'Iluminación ambiental', width: 30, height: 30, shape: 'circle', colorClass: 'bg-purple-200 opacity-50' },
            { type: 'arch-light', label: 'Iluminación arquitectónica', width: 30, height: 30, shape: 'rect', colorClass: 'bg-blue-300 opacity-50' },
        ]
    }
];
