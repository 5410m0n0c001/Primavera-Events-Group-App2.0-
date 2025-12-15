export interface ElementCategory {
    id: string;
    name: string;
    emoji: string;
    elements: FloorplanElement[];
}

export interface FloorplanElement {
    id: string;
    name: string;
    category: string;
    width?: number; // Optional, defaults to generic size if missing
    height?: number;
    icon?: string; // Optional icon for future use
}

export const FLOORPLAN_CATEGORIES: ElementCategory[] = [
    {
        id: 'acceso',
        name: 'ACCESO Y RECEPCIÓN',
        emoji: '🚪',
        elements: [
            { id: 'acceso-principal', name: 'Acceso principal invitados', category: 'acceso', width: 100, height: 50 },
            { id: 'acceso-proveedores', name: 'Acceso proveedores', category: 'acceso', width: 80, height: 50 },
            { id: 'acceso-staff', name: 'Acceso staff', category: 'acceso', width: 80, height: 50 },
            { id: 'recepcion', name: 'Recepción', category: 'acceso', width: 120, height: 80 },
            { id: 'mesa-bienvenida', name: 'Mesa de bienvenida', category: 'acceso', width: 100, height: 60 },
            { id: 'mesa-registro', name: 'Mesa de registro', category: 'acceso', width: 100, height: 60 },
            { id: 'area-pulseras', name: 'Área de pulseras / boletos', category: 'acceso', width: 90, height: 60 },
            { id: 'tornafiesta', name: 'Tornafiesta / torniquetes', category: 'acceso', width: 60, height: 60 },
            { id: 'area-hostess', name: 'Área de hostess', category: 'acceso', width: 80, height: 60 },
            { id: 'control-invitados', name: 'Área de control de invitados', category: 'acceso', width: 100, height: 70 },
            { id: 'punto-info', name: 'Punto de información', category: 'acceso', width: 70, height: 70 },
            { id: 'senaletica', name: 'Señalética general', category: 'acceso', width: 40, height: 40 }
        ]
    },
    {
        id: 'estacionamiento',
        name: 'ESTACIONAMIENTO Y MOVILIDAD',
        emoji: '🚗',
        elements: [
            { id: 'estacionamiento-gral', name: 'Estacionamiento general', category: 'estacionamiento', width: 200, height: 150 },
            { id: 'estacionamiento-vip', name: 'Estacionamiento VIP', category: 'estacionamiento', width: 150, height: 100 },
            { id: 'estacionamiento-prov', name: 'Estacionamiento proveedores', category: 'estacionamiento', width: 120, height: 100 },
            { id: 'estacionamiento-staff', name: 'Estacionamiento staff', category: 'estacionamiento', width: 100, height: 80 },
            { id: 'valet-parking', name: 'Área de valet parking', category: 'estacionamiento', width: 80, height: 60 },
            { id: 'ascenso-descenso', name: 'Zona de ascenso y descenso', category: 'estacionamiento', width: 100, height: 50 },
            { id: 'circulacion', name: 'Circulación vehicular', category: 'estacionamiento', width: 150, height: 40 },
            { id: 'area-buses', name: 'Área de autobuses / vans', category: 'estacionamiento', width: 150, height: 100 },
            { id: 'rampas', name: 'Rampas para discapacidad', category: 'estacionamiento', width: 60, height: 80 },
            { id: 'iluminacion-est', name: 'Iluminación de estacionamiento', category: 'estacionamiento', width: 30, height: 30 }
        ]
    },
    {
        id: 'coctel',
        name: 'ÁREA DE CÓCTEL / BIENVENIDA',
        emoji: '🍸',
        elements: [
            { id: 'area-coctel', name: 'Área de cóctel', category: 'coctel', width: 150, height: 150 },
            { id: 'mesas-cocteleras', name: 'Mesas cocteleras', category: 'coctel', width: 60, height: 60 },
            { id: 'periqueras', name: 'Periqueras', category: 'coctel', width: 40, height: 40 },
            { id: 'sillones-lounge', name: 'Sillones lounge', category: 'coctel', width: 100, height: 80 },
            { id: 'barra-bienvenida', name: 'Barra de bienvenida', category: 'coctel', width: 120, height: 60 },
            { id: 'barra-mixologia', name: 'Barra de mixología', category: 'coctel', width: 150, height: 70 },
            { id: 'barra-sin-alcohol', name: 'Barra de bebidas sin alcohol', category: 'coctel', width: 100, height: 60 },
            { id: 'estacion-aguas', name: 'Estación de aguas frescas', category: 'coctel', width: 80, height: 50 },
            { id: 'estacion-botanas', name: 'Estación de botanas', category: 'coctel', width: 80, height: 50 }
        ]
    },
    {
        id: 'jardines',
        name: 'ÁREA DE JARDINES / EXTERIORES',
        emoji: '🌳',
        elements: [
            { id: 'jardines-principales', name: 'Jardines principales', category: 'jardines', width: 250, height: 200 },
            { id: 'jardines-secundarios', name: 'Jardines secundarios', category: 'jardines', width: 150, height: 120 },
            { id: 'areas-verdes', name: 'Áreas verdes delimitadas', category: 'jardines', width: 120, height: 100 },
            { id: 'caminos', name: 'Caminos peatonales', category: 'jardines', width: 200, height: 40 },
            { id: 'pergolas', name: 'Pérgolas', category: 'jardines', width: 100, height: 100 },
            { id: 'sombrillas', name: 'Sombrillas', category: 'jardines', width: 50, height: 50 },
            { id: 'iluminacion-ext', name: 'Iluminación exterior', category: 'jardines', width: 30, height: 30 },
            { id: 'area-descanso', name: 'Área de descanso', category: 'jardines', width: 100, height: 80 },
            { id: 'zona-fumadores', name: 'Zona de fumadores', category: 'jardines', width: 60, height: 60 }
        ]
    },
    {
        id: 'invitados',
        name: 'ÁREA DE INVITADOS',
        emoji: '🪑',
        elements: [
            { id: 'mesas-redondas', name: 'Mesas redondas', category: 'invitados', width: 80, height: 80 },
            { id: 'mesas-rectangulares', name: 'Mesas rectangulares', category: 'invitados', width: 120, height: 60 },
            { id: 'mesas-imperiales', name: 'Mesas imperiales', category: 'invitados', width: 200, height: 80 },
            { id: 'sillas', name: 'Sillas', category: 'invitados', width: 30, height: 30 },
            { id: 'mesa-novios', name: 'Mesa de novios', category: 'invitados', width: 150, height: 80 },
            { id: 'mesa-honor', name: 'Mesa de honor', category: 'invitados', width: 180, height: 80 },
            { id: 'mesa-familia', name: 'Mesa de familia', category: 'invitados', width: 100, height: 80 },
            { id: 'area-infantil', name: 'Área infantil', category: 'invitados', width: 120, height: 120 },
            { id: 'area-adultos', name: 'Área adultos mayores', category: 'invitados', width: 100, height: 100 }
        ]
    },
    {
        id: 'buffet',
        name: 'ÁREA DE ALIMENTOS - BUFFET',
        emoji: '🍽️',
        elements: [
            { id: 'buffet-caliente', name: 'Barra de buffet caliente', category: 'buffet', width: 150, height: 60 },
            { id: 'buffet-frio', name: 'Barra de buffet frío', category: 'buffet', width: 150, height: 60 },
            { id: 'barra-ensaladas', name: 'Barra de ensaladas', category: 'buffet', width: 120, height: 60 },
            { id: 'barra-sopas', name: 'Barra de sopas', category: 'buffet', width: 100, height: 60 },
            { id: 'barra-guarniciones', name: 'Barra de guarniciones', category: 'buffet', width: 100, height: 60 },
            { id: 'barra-postres', name: 'Barra de postres', category: 'buffet', width: 120, height: 60 },
            { id: 'barra-pan', name: 'Barra de pan', category: 'buffet', width: 80, height: 50 },
            { id: 'estacion-salsas', name: 'Estación de salsas', category: 'buffet', width: 60, height: 40 },
            { id: 'area-platos', name: 'Área de platos y cubiertos', category: 'buffet', width: 80, height: 60 },
            { id: 'estacion-tacos', name: 'Estación de tacos', category: 'buffet', width: 100, height: 60 },
            { id: 'estacion-antojitos', name: 'Estación de antojitos mexicanos', category: 'buffet', width: 100, height: 60 },
            { id: 'estacion-parrilla', name: 'Estación de parrilla', category: 'buffet', width: 120, height: 70 },
            { id: 'estacion-mariscos', name: 'Estación de mariscos', category: 'buffet', width: 120, height: 70 },
            { id: 'estacion-pasta', name: 'Estación de pasta', category: 'buffet', width: 100, height: 60 },
            { id: 'comida-infantil', name: 'Estación de comida infantil', category: 'buffet', width: 80, height: 60 }
        ]
    },
    {
        id: 'cocinas',
        name: 'COCINAS Y OPERACIÓN',
        emoji: '👨‍🍳',
        elements: [
            { id: 'cocina-caliente', name: 'Cocina caliente', category: 'cocinas', width: 150, height: 120 },
            { id: 'cocina-fria', name: 'Cocina fría', category: 'cocinas', width: 120, height: 100 },
            { id: 'area-preparacion', name: 'Área de preparación', category: 'cocinas', width: 140, height: 100 },
            { id: 'area-emplatado', name: 'Área de emplatado', category: 'cocinas', width: 120, height: 80 },
            { id: 'area-lavado', name: 'Área de lavado', category: 'cocinas', width: 100, height: 80 },
            { id: 'area-basura', name: 'Área de basura', category: 'cocinas', width: 60, height: 60 },
            { id: 'area-reciclaje', name: 'Área de reciclaje', category: 'cocinas', width: 60, height: 60 },
            { id: 'almacen-seco', name: 'Almacén seco', category: 'cocinas', width: 100, height: 100 },
            { id: 'camara-refrigeracion', name: 'Cámara de refrigeración', category: 'cocinas', width: 80, height: 100 },
            { id: 'area-gas', name: 'Área de gas', category: 'cocinas', width: 60, height: 60 },
            { id: 'area-electrica', name: 'Área eléctrica', category: 'cocinas', width: 60, height: 60 },
            { id: 'carpa-cocina', name: 'Carpa de cocina', category: 'cocinas', width: 200, height: 150 }
        ]
    },
    {
        id: 'barras',
        name: 'BARRAS DE BEBIDAS',
        emoji: '🍹',
        elements: [
            { id: 'barra-principal', name: 'Barra principal', category: 'barras', width: 150, height: 70 },
            { id: 'barras-secundarias', name: 'Barras secundarias', category: 'barras', width: 120, height: 60 },
            { id: 'barra-vip', name: 'Barra VIP', category: 'barras', width: 130, height: 70 },
            { id: 'barra-vinos', name: 'Barra de vinos', category: 'barras', width: 100, height: 60 },
            { id: 'barra-cerveza', name: 'Barra de cerveza', category: 'barras', width: 120, height: 60 },
            { id: 'barra-tequila', name: 'Barra de tequila / mezcal', category: 'barras', width: 110, height: 60 },
            { id: 'barra-cafe', name: 'Barra de café', category: 'barras', width: 90, height: 60 },
            { id: 'barra-refrescos', name: 'Barra de refrescos', category: 'barras', width: 100, height: 60 },
            { id: 'hieleras', name: 'Hieleras', category: 'barras', width: 50, height: 50 },
            { id: 'area-cristaleria', name: 'Área de cristalería', category: 'barras', width: 80, height: 60 }
        ]
    },
    {
        id: 'escenario',
        name: 'ESCENARIO, AUDIO Y SHOW',
        emoji: '🎤',
        elements: [
            { id: 'escenario', name: 'Escenario / stage', category: 'escenario', width: 200, height: 150 },
            { id: 'tarima-dj', name: 'Tarima DJ', category: 'escenario', width: 120, height: 100 },
            { id: 'backdrop', name: 'Backdrop', category: 'escenario', width: 150, height: 120 },
            { id: 'cabina-dj', name: 'Cabina DJ', category: 'escenario', width: 80, height: 80 },
            { id: 'area-grupo', name: 'Área grupo musical', category: 'escenario', width: 150, height: 120 },
            { id: 'area-mariachi', name: 'Área mariachi', category: 'escenario', width: 120, height: 100 },
            { id: 'area-norteno', name: 'Área norteño', category: 'escenario', width: 120, height: 100 },
            { id: 'pantallas-led', name: 'Pantallas LED', category: 'escenario', width: 100, height: 80 },
            { id: 'proyector', name: 'Proyector', category: 'escenario', width: 60, height: 60 },
            { id: 'torres-audio', name: 'Torres de audio', category: 'escenario', width: 40, height: 100 },
            { id: 'cabina-control', name: 'Cabina de control', category: 'escenario', width: 80, height: 80 },
            { id: 'fuegos-frios', name: 'Área de fuegos fríos', category: 'escenario', width: 60, height: 60 }
        ]
    },
    {
        id: 'pista',
        name: 'PISTA DE BAILE Y ENTRETENIMIENTO',
        emoji: '💃',
        elements: [
            { id: 'pista-baile', name: 'Pista de baile', category: 'pista', width: 200, height: 200 },
            { id: 'area-animadores', name: 'Área de animadores', category: 'pista', width: 100, height: 80 },
            { id: 'photo-booth', name: 'Photo booth', category: 'pista', width: 80, height: 80 },
            { id: 'cabina-360', name: 'Cabina 360', category: 'pista', width: 100, height: 100 },
            { id: 'area-recuerdos', name: 'Área de recuerdos', category: 'pista', width: 80, height: 60 },
            { id: 'area-sorpresas', name: 'Área de sorpresas', category: 'pista', width: 80, height: 60 },
            { id: 'juegos-inflables', name: 'Juegos inflables', category: 'pista', width: 150, height: 150 },
            { id: 'inflables-infantiles', name: 'Inflables infantiles', category: 'pista', width: 120, height: 120 },
            { id: 'inflables-mecanicos', name: 'Inflables mecánicos', category: 'pista', width: 100, height: 100 },
            { id: 'toros-mecanicos', name: 'Toros mecánicos', category: 'pista', width: 120, height: 120 }
        ]
    },
    {
        id: 'carpas',
        name: 'CARPAS Y ESTRUCTURAS',
        emoji: '⛺',
        elements: [
            { id: 'carpa-principal', name: 'Carpa principal', category: 'carpas', width: 300, height: 250 },
            { id: 'carpa-ceremonia', name: 'Carpa ceremonia', category: 'carpas', width: 200, height: 180 },
            { id: 'carpa-coctel', name: 'Carpa cóctel', category: 'carpas', width: 180, height: 150 },
            { id: 'carpa-buffet', name: 'Carpa buffet', category: 'carpas', width: 180, height: 150 },
            { id: 'carpa-barras', name: 'Carpa barras', category: 'carpas', width: 150, height: 120 },
            { id: 'carpa-inflables', name: 'Carpa inflables', category: 'carpas', width: 150, height: 150 },
            { id: 'carpa-staff', name: 'Carpa staff', category: 'carpas', width: 120, height: 100 },
            { id: 'carpa-proveedores', name: 'Carpa proveedores', category: 'carpas', width: 120, height: 100 },
            { id: 'carpa-primeros-auxilios', name: 'Carpa primeros auxilios', category: 'carpas', width: 80, height: 80 }
        ]
    },
    {
        id: 'ceremonia',
        name: 'CEREMONIA',
        emoji: '💒',
        elements: [
            { id: 'altar', name: 'Altar', category: 'ceremonia', width: 100, height: 80 },
            { id: 'arco', name: 'Arco', category: 'ceremonia', width: 120, height: 150 },
            { id: 'pasillo', name: 'Pasillo', category: 'ceremonia', width: 200, height: 50 },
            { id: 'sillas-ceremonia', name: 'Sillas ceremonia', category: 'ceremonia', width: 30, height: 30 },
            { id: 'mesa-ritual', name: 'Mesa ritual', category: 'ceremonia', width: 80, height: 60 },
            { id: 'area-oficiante', name: 'Área oficiante', category: 'ceremonia', width: 60, height: 60 },
            { id: 'area-musicos', name: 'Área músicos', category: 'ceremonia', width: 100, height: 80 }
        ]
    },
    {
        id: 'regalos',
        name: 'REGALOS Y EXPERIENCIAS',
        emoji: '🎁',
        elements: [
            { id: 'mesa-regalos', name: 'Mesa de regalos', category: 'regalos', width: 100, height: 60 },
            { id: 'area-sobres', name: 'Área de sobres', category: 'regalos', width: 80, height: 60 },
            { id: 'area-regalos-fisicos', name: 'Área de regalos físicos', category: 'regalos', width: 120, height: 80 },
            { id: 'area-resguardo', name: 'Área de resguardo', category: 'regalos', width: 100, height: 100 },
            { id: 'caja-seguridad', name: 'Caja de seguridad', category: 'regalos', width: 60, height: 60 }
        ]
    },
    {
        id: 'banos',
        name: 'BAÑOS Y SERVICIOS',
        emoji: '🚻',
        elements: [
            { id: 'banos-fijos', name: 'Baños fijos', category: 'banos', width: 100, height: 120 },
            { id: 'banos-moviles', name: 'Baños móviles', category: 'banos', width: 80, height: 100 },
            { id: 'banos-vip', name: 'Baños VIP', category: 'banos', width: 120, height: 100 },
            { id: 'banos-staff', name: 'Baños staff', category: 'banos', width: 80, height: 80 },
            { id: 'lavamanos', name: 'Lavamanos', category: 'banos', width: 60, height: 40 },
            { id: 'area-limpieza', name: 'Área de limpieza', category: 'banos', width: 60, height: 60 }
        ]
    },
    {
        id: 'staff',
        name: 'STAFF Y PROVEEDORES',
        emoji: '👔',
        elements: [
            { id: 'area-staff', name: 'Área staff', category: 'staff', width: 120, height: 100 },
            { id: 'vestidores', name: 'Vestidores', category: 'staff', width: 100, height: 80 },
            { id: 'area-descanso-staff', name: 'Área descanso', category: 'staff', width: 100, height: 80 },
            { id: 'area-coordinacion', name: 'Área de coordinación', category: 'staff', width: 80, height: 80 },
            { id: 'area-proveedores', name: 'Área de proveedores', category: 'staff', width: 100, height: 100 },
            { id: 'area-carga', name: 'Área de carga y descarga', category: 'staff', width: 150, height: 100 }
        ]
    },
    {
        id: 'seguridad',
        name: 'SEGURIDAD Y EMERGENCIAS',
        emoji: '🚨',
        elements: [
            { id: 'seguridad-privada', name: 'Seguridad privada', category: 'seguridad', width: 60, height: 60 },
            { id: 'primeros-auxilios', name: 'Punto de primeros auxilios', category: 'seguridad', width: 80, height: 80 },
            { id: 'ambulancia', name: 'Ambulancia', category: 'seguridad', width: 100, height: 60 },
            { id: 'punto-reunion', name: 'Punto de reunión', category: 'seguridad', width: 100, height: 100 },
            { id: 'extintores', name: 'Extintores', category: 'seguridad', width: 30, height: 40 },
            { id: 'rutas-evacuacion', name: 'Rutas de evacuación', category: 'seguridad', width: 200, height: 40 },
            { id: 'salidas-emergencia', name: 'Salidas de emergencia', category: 'seguridad', width: 80, height: 50 },
            { id: 'cctv', name: 'CCTV', category: 'seguridad', width: 40, height: 40 }
        ]
    },
    {
        id: 'iluminacion',
        name: 'ILUMINACIÓN Y ENERGÍA',
        emoji: '⚡',
        elements: [
            { id: 'planta-luz', name: 'Planta de luz', category: 'iluminacion', width: 100, height: 80 },
            { id: 'tablero-electrico', name: 'Tablero eléctrico', category: 'iluminacion', width: 60, height: 80 },
            { id: 'cableado', name: 'Cableado', category: 'iluminacion', width: 150, height: 20 },
            { id: 'torres-iluminacion', name: 'Torres de iluminación', category: 'iluminacion', width: 40, height: 120 },
            { id: 'iluminacion-ambiental', name: 'Iluminación ambiental', category: 'iluminacion', width: 50, height: 50 },
            { id: 'iluminacion-arquitectonica', name: 'Iluminación arquitectónica', category: 'iluminacion', width: 60, height: 60 }
        ]
    }
];
