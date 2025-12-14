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
    icon?: string;
}

export const FLOORPLAN_CATEGORIES: ElementCategory[] = [
    {
        id: 'acceso',
        name: 'ACCESO Y RECEPCIÓN',
        emoji: '🚪',
        elements: [
            { id: 'acceso-principal', name: 'Acceso principal invitados', category: 'acceso' },
            { id: 'acceso-proveedores', name: 'Acceso proveedores', category: 'acceso' },
            { id: 'acceso-staff', name: 'Acceso staff', category: 'acceso' },
            { id: 'recepcion', name: 'Recepción', category: 'acceso' },
            { id: 'mesa-bienvenida', name: 'Mesa de bienvenida', category: 'acceso' },
            { id: 'mesa-registro', name: 'Mesa de registro', category: 'acceso' },
            { id: 'area-pulseras', name: 'Área de pulseras / boletos', category: 'acceso' },
            { id: 'tornafiesta', name: 'Tornafiesta / torniquetes', category: 'acceso' },
            { id: 'area-hostess', name: 'Área de hostess', category: 'acceso' },
            { id: 'control-invitados', name: 'Área de control de invitados', category: 'acceso' },
            { id: 'punto-info', name: 'Punto de información', category: 'acceso' },
            { id: 'senaletica', name: 'Señalética general', category: 'acceso' }
        ]
    },
    {
        id: 'estacionamiento',
        name: 'ESTACIONAMIENTO Y MOVILIDAD',
        emoji: '🚗',
        elements: [
            { id: 'estacionamiento-gral', name: 'Estacionamiento general', category: 'estacionamiento' },
            { id: 'estacionamiento-vip', name: 'Estacionamiento VIP', category: 'estacionamiento' },
            { id: 'estacionamiento-prov', name: 'Estacionamiento proveedores', category: 'estacionamiento' },
            { id: 'estacionamiento-staff', name: 'Estacionamiento staff', category: 'estacionamiento' },
            { id: 'valet-parking', name: 'Área de valet parking', category: 'estacionamiento' },
            { id: 'ascenso-descenso', name: 'Zona de ascenso y descenso', category: 'estacionamiento' },
            { id: 'circulacion', name: 'Circulación vehicular', category: 'estacionamiento' },
            { id: 'area-buses', name: 'Área de autobuses / vans', category: 'estacionamiento' },
            { id: 'rampas', name: 'Rampas para discapacidad', category: 'estacionamiento' },
            { id: 'iluminacion-est', name: 'Iluminación de estacionamiento', category: 'estacionamiento' }
        ]
    },
    {
        id: 'coctel',
        name: 'ÁREA DE CÓCTEL / BIENVENIDA',
        emoji: '🍸',
        elements: [
            { id: 'area-coctel', name: 'Área de cóctel', category: 'coctel' },
            { id: 'mesas-cocteleras', name: 'Mesas cocteleras', category: 'coctel' },
            { id: 'periqueras', name: 'Periqueras', category: 'coctel' },
            { id: 'sillones-lounge', name: 'Sillones lounge', category: 'coctel' },
            { id: 'barra-bienvenida', name: 'Barra de bienvenida', category: 'coctel' },
            { id: 'barra-mixologia', name: 'Barra de mixología', category: 'coctel' },
            { id: 'barra-sin-alcohol', name: 'Barra de bebidas sin alcohol', category: 'coctel' },
            { id: 'estacion-aguas', name: 'Estación de aguas frescas', category: 'coctel' },
            { id: 'estacion-botanas', name: 'Estación de botanas', category: 'coctel' }
        ]
    },
    {
        id: 'jardines',
        name: 'ÁREA DE JARDINES / EXTERIORES',
        emoji: '🌳',
        elements: [
            { id: 'jardines-principales', name: 'Jardines principales', category: 'jardines' },
            { id: 'jardines-secundarios', name: 'Jardines secundarios', category: 'jardines' },
            { id: 'areas-verdes', name: 'Áreas verdes delimitadas', category: 'jardines' },
            { id: 'caminos', name: 'Caminos peatonales', category: 'jardines' },
            { id: 'pergolas', name: 'Pérgolas', category: 'jardines' },
            { id: 'sombrillas', name: 'Sombrillas', category: 'jardines' },
            { id: 'iluminacion-ext', name: 'Iluminación exterior', category: 'jardines' },
            { id: 'area-descanso', name: 'Área de descanso', category: 'jardines' },
            { id: 'zona-fumadores', name: 'Zona de fumadores', category: 'jardines' }
        ]
    },
    {
        id: 'invitados',
        name: 'ÁREA DE INVITADOS',
        emoji: '🪑',
        elements: [
            { id: 'mesas-redondas', name: 'Mesas redondas', category: 'invitados' },
            { id: 'mesas-rectangulares', name: 'Mesas rectangulares', category: 'invitados' },
            { id: 'mesas-imperiales', name: 'Mesas imperiales', category: 'invitados' },
            { id: 'sillas', name: 'Sillas', category: 'invitados' },
            { id: 'mesa-novios', name: 'Mesa de novios', category: 'invitados' },
            { id: 'mesa-honor', name: 'Mesa de honor', category: 'invitados' },
            { id: 'mesa-familia', name: 'Mesa de familia', category: 'invitados' },
            { id: 'area-infantil', name: 'Área infantil', category: 'invitados' },
            { id: 'area-adultos', name: 'Área adultos mayores', category: 'invitados' }
        ]
    },
    {
        id: 'buffet',
        name: 'ÁREA DE ALIMENTOS - BUFFET',
        emoji: '🍽️',
        elements: [
            { id: 'buffet-caliente', name: 'Barra de buffet caliente', category: 'buffet' },
            { id: 'buffet-frio', name: 'Barra de buffet frío', category: 'buffet' },
            { id: 'barra-ensaladas', name: 'Barra de ensaladas', category: 'buffet' },
            { id: 'barra-sopas', name: 'Barra de sopas', category: 'buffet' },
            { id: 'barra-guarniciones', name: 'Barra de guarniciones', category: 'buffet' },
            { id: 'barra-postres', name: 'Barra de postres', category: 'buffet' },
            { id: 'barra-pan', name: 'Barra de pan', category: 'buffet' },
            { id: 'estacion-salsas', name: 'Estación de salsas', category: 'buffet' },
            { id: 'area-platos', name: 'Área de platos y cubiertos', category: 'buffet' },
            { id: 'estacion-tacos', name: 'Estación de tacos', category: 'buffet' },
            { id: 'estacion-antojitos', name: 'Estación de antojitos mexicanos', category: 'buffet' },
            { id: 'estacion-parrilla', name: 'Estación de parrilla', category: 'buffet' },
            { id: 'estacion-mariscos', name: 'Estación de mariscos', category: 'buffet' },
            { id: 'estacion-pasta', name: 'Estación de pasta', category: 'buffet' },
            { id: 'comida-infantil', name: 'Estación de comida infantil', category: 'buffet' }
        ]
    },
    {
        id: 'cocinas',
        name: 'COCINAS Y OPERACIÓN',
        emoji: '👨‍🍳',
        elements: [
            { id: 'cocina-caliente', name: 'Cocina caliente', category: 'cocinas' },
            { id: 'cocina-fria', name: 'Cocina fría', category: 'cocinas' },
            { id: 'area-preparacion', name: 'Área de preparación', category: 'cocinas' },
            { id: 'area-emplatado', name: 'Área de emplatado', category: 'cocinas' },
            { id: 'area-lavado', name: 'Área de lavado', category: 'cocinas' },
            { id: 'area-basura', name: 'Área de basura', category: 'cocinas' },
            { id: 'area-reciclaje', name: 'Área de reciclaje', category: 'cocinas' },
            { id: 'almacen-seco', name: 'Almacén seco', category: 'cocinas' },
            { id: 'camara-refrigeracion', name: 'Cámara de refrigeración', category: 'cocinas' },
            { id: 'area-gas', name: 'Área de gas', category: 'cocinas' },
            { id: 'area-electrica', name: 'Área eléctrica', category: 'cocinas' },
            { id: 'carpa-cocina', name: 'Carpa de cocina', category: 'cocinas' }
        ]
    },
    {
        id: 'barras',
        name: 'BARRAS DE BEBIDAS',
        emoji: '🍹',
        elements: [
            { id: 'barra-principal', name: 'Barra principal', category: 'barras' },
            { id: 'barras-secundarias', name: 'Barras secundarias', category: 'barras' },
            { id: 'barra-vip', name: 'Barra VIP', category: 'barras' },
            { id: 'barra-vinos', name: 'Barra de vinos', category: 'barras' },
            { id: 'barra-cerveza', name: 'Barra de cerveza', category: 'barras' },
            { id: 'barra-tequila', name: 'Barra de tequila / mezcal', category: 'barras' },
            { id: 'barra-cafe', name: 'Barra de café', category: 'barras' },
            { id: 'barra-refrescos', name: 'Barra de refrescos', category: 'barras' },
            { id: 'hieleras', name: 'Hieleras', category: 'barras' },
            { id: 'area-cristaleria', name: 'Área de cristalería', category: 'barras' }
        ]
    },
    {
        id: 'escenario',
        name: 'ESCENARIO, AUDIO Y SHOW',
        emoji: '🎤',
        elements: [
            { id: 'escenario', name: 'Escenario / stage', category: 'escenario' },
            { id: 'tarima-dj', name: 'Tarima DJ', category: 'escenario' },
            { id: 'backdrop', name: 'Backdrop', category: 'escenario' },
            { id: 'cabina-dj', name: 'Cabina DJ', category: 'escenario' },
            { id: 'area-grupo', name: 'Área grupo musical', category: 'escenario' },
            { id: 'area-mariachi', name: 'Área mariachi', category: 'escenario' },
            { id: 'area-norteno', name: 'Área norteño', category: 'escenario' },
            { id: 'pantallas-led', name: 'Pantallas LED', category: 'escenario' },
            { id: 'proyector', name: 'Proyector', category: 'escenario' },
            { id: 'torres-audio', name: 'Torres de audio', category: 'escenario' },
            { id: 'cabina-control', name: 'Cabina de control', category: 'escenario' },
            { id: 'fuegos-frios', name: 'Área de fuegos fríos', category: 'escenario' }
        ]
    },
    {
        id: 'pista',
        name: 'PISTA DE BAILE Y ENTRETENIMIENTO',
        emoji: '💃',
        elements: [
            { id: 'pista-baile', name: 'Pista de baile', category: 'pista' },
            { id: 'area-animadores', name: 'Área de animadores', category: 'pista' },
            { id: 'photo-booth', name: 'Photo booth', category: 'pista' },
            { id: 'cabina-360', name: 'Cabina 360', category: 'pista' },
            { id: 'area-recuerdos', name: 'Área de recuerdos', category: 'pista' },
            { id: 'area-sorpresas', name: 'Área de sorpresas', category: 'pista' },
            { id: 'juegos-inflables', name: 'Juegos inflables', category: 'pista' },
            { id: 'inflables-infantiles', name: 'Inflables infantiles', category: 'pista' },
            { id: 'inflables-mecanicos', name: 'Inflables mecánicos', category: 'pista' },
            { id: 'toros-mecanicos', name: 'Toros mecánicos', category: 'pista' }
        ]
    },
    {
        id: 'carpas',
        name: 'CARPAS Y ESTRUCTURAS',
        emoji: '⛺',
        elements: [
            { id: 'carpa-principal', name: 'Carpa principal', category: 'carpas' },
            { id: 'carpa-ceremonia', name: 'Carpa ceremonia', category: 'carpas' },
            { id: 'carpa-coctel', name: 'Carpa cóctel', category: 'carpas' },
            { id: 'carpa-buffet', name: 'Carpa buffet', category: 'carpas' },
            { id: 'carpa-barras', name: 'Carpa barras', category: 'carpas' },
            { id: 'carpa-inflables', name: 'Carpa inflables', category: 'carpas' },
            { id: 'carpa-staff', name: 'Carpa staff', category: 'carpas' },
            { id: 'carpa-proveedores', name: 'Carpa proveedores', category: 'carpas' },
            { id: 'carpa-primeros-auxilios', name: 'Carpa primeros auxilios', category: 'carpas' }
        ]
    },
    {
        id: 'ceremonia',
        name: 'CEREMONIA',
        emoji: '💒',
        elements: [
            { id: 'altar', name: 'Altar', category: 'ceremonia' },
            { id: 'arco', name: 'Arco', category: 'ceremonia' },
            { id: 'pasillo', name: 'Pasillo', category: 'ceremonia' },
            { id: 'sillas-ceremonia', name: 'Sillas ceremonia', category: 'ceremonia' },
            { id: 'mesa-ritual', name: 'Mesa ritual', category: 'ceremonia' },
            { id: 'area-oficiante', name: 'Área oficiante', category: 'ceremonia' },
            { id: 'area-musicos', name: 'Área músicos', category: 'ceremonia' }
        ]
    },
    {
        id: 'regalos',
        name: 'REGALOS Y EXPERIENCIAS',
        emoji: '🎁',
        elements: [
            { id: 'mesa-regalos', name: 'Mesa de regalos', category: 'regalos' },
            { id: 'area-sobres', name: 'Área de sobres', category: 'regalos' },
            { id: 'area-regalos-fisicos', name: 'Área de regalos físicos', category: 'regalos' },
            { id: 'area-resguardo', name: 'Área de resguardo', category: 'regalos' },
            { id: 'caja-seguridad', name: 'Caja de seguridad', category: 'regalos' }
        ]
    },
    {
        id: 'banos',
        name: 'BAÑOS Y SERVICIOS',
        emoji: '🚻',
        elements: [
            { id: 'banos-fijos', name: 'Baños fijos', category: 'banos' },
            { id: 'banos-moviles', name: 'Baños móviles', category: 'banos' },
            { id: 'banos-vip', name: 'Baños VIP', category: 'banos' },
            { id: 'banos-staff', name: 'Baños staff', category: 'banos' },
            { id: 'lavamanos', name: 'Lavamanos', category: 'banos' },
            { id: 'area-limpieza', name: 'Área de limpieza', category: 'banos' }
        ]
    },
    {
        id: 'staff',
        name: 'STAFF Y PROVEEDORES',
        emoji: '👔',
        elements: [
            { id: 'area-staff', name: 'Área staff', category: 'staff' },
            { id: 'vestidores', name: 'Vestidores', category: 'staff' },
            { id: 'area-descanso-staff', name: 'Área descanso', category: 'staff' },
            { id: 'area-coordinacion', name: 'Área de coordinación', category: 'staff' },
            { id: 'area-proveedores', name: 'Área de proveedores', category: 'staff' },
            { id: 'area-carga', name: 'Área de carga y descarga', category: 'staff' }
        ]
    },
    {
        id: 'seguridad',
        name: 'SEGURIDAD Y EMERGENCIAS',
        emoji: '🚨',
        elements: [
            { id: 'seguridad-privada', name: 'Seguridad privada', category: 'seguridad' },
            { id: 'primeros-auxilios', name: 'Punto de primeros auxilios', category: 'seguridad' },
            { id: 'ambulancia', name: 'Ambulancia', category: 'seguridad' },
            { id: 'punto-reunion', name: 'Punto de reunión', category: 'seguridad' },
            { id: 'extintores', name: 'Extintores', category: 'seguridad' },
            { id: 'rutas-evacuacion', name: 'Rutas de evacuación', category: 'seguridad' },
            { id: 'salidas-emergencia', name: 'Salidas de emergencia', category: 'seguridad' },
            { id: 'cctv', name: 'CCTV', category: 'seguridad' }
        ]
    },
    {
        id: 'iluminacion',
        name: 'ILUMINACIÓN Y ENERGÍA',
        emoji: '⚡',
        elements: [
            { id: 'planta-luz', name: 'Planta de luz', category: 'iluminacion' },
            { id: 'tablero-electrico', name: 'Tablero eléctrico', category: 'iluminacion' },
            { id: 'cableado', name: 'Cableado', category: 'iluminacion' },
            { id: 'torres-iluminacion', name: 'Torres de iluminación', category: 'iluminacion' },
            { id: 'iluminacion-ambiental', name: 'Iluminación ambiental', category: 'iluminacion' },
            { id: 'iluminacion-arquitectonica', name: 'Iluminación arquitectónica', category: 'iluminacion' }
        ]
    }
];
