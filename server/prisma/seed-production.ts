import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productionData = [
    {
        category: "Mobiliario",
        emoji: "🪑",
        elements: [
            { name: "Mesa redonda (8-12 pax)", icon: "⭕", width: 120, height: 120 },
            { name: "Tablón", icon: "⬛", width: 244, height: 76 },
            { name: "Mesa cuadrada de madera (4 pax)", icon: "⬛", width: 90, height: 90 },
            { name: "Mesa rectangular tipo mármol", icon: "⬛", width: 200, height: 100 },
            { name: "Mesa rectangular de madera color miel", icon: "⬛", width: 200, height: 100 },
            { name: "Mesa rectangular de madera color nogal clásico", icon: "⬛", width: 200, height: 100 },
            { name: "Mesa plegable cuadrada", icon: "⬛", width: 90, height: 90 },
            { name: "Mesa infantil", icon: "⬛", width: 150, height: 60 },
            { name: "Mesa de madera blanca ceremonia", icon: "⬛", width: 180, height: 80 },
            { name: "Mesa de centro", icon: "⬛", width: 100, height: 60 },
            { name: "Mesa redonda 10 personas", icon: "⭕", width: 180, height: 180 },
            { name: "Mesa redonda 12 personas", icon: "⭕", width: 210, height: 210 },
            { name: "Mesa imperial (varios tablones)", icon: "⬛", width: 480, height: 120 },
            { name: "Mesa de cóctel alta (periquera)", icon: "⭕", width: 60, height: 60 },
            { name: "Mesa de honor / principales", icon: "⭐", width: 300, height: 100 },
            { name: "Mesa de novios / festejado", icon: "💍", width: 200, height: 90 },
            { name: "Base de madera plegable para mesa", icon: "🪵", width: 60, height: 60 },
            { name: "Cubo metálico base", icon: "⬛", width: 50, height: 50 },
            { name: "Base metálica alta (centro de mesa)", icon: "⬛", width: 40, height: 40 },
            { name: "Descanso metálico", icon: "⬛", width: 30, height: 30 },
            { name: "Descanso de madera", icon: "🪵", width: 30, height: 30 },
            { name: "Base metálica para mesa", icon: "⬛", width: 60, height: 60 },
            { name: "Rueda de madera para mesa de cóctel", icon: "⭕", width: 60, height: 60 },
            { name: "Rueda metálica con repisas de madera", icon: "⭕", width: 60, height: 60 },
            { name: "Silla negra plegable", icon: "🪑", width: 45, height: 45 },
            { name: "Silla Tiffany blanca", icon: "🪑", width: 40, height: 40 },
            { name: "Silla Tiffany chocolate", icon: "🪑", width: 40, height: 40 },
            { name: "Silla Tiffany blanca infantil", icon: "🪑", width: 30, height: 30 },
            { name: "Silla Cross Back madera tono nogal", icon: "🪑", width: 45, height: 45 },
            { name: "Silla Cross Back madera tono miel", icon: "🪑", width: 45, height: 45 },
            { name: "Silla metálica Boss", icon: "🪑", width: 45, height: 45 },
            { name: "Silla metálica Lotus", icon: "🪑", width: 45, height: 45 },
            { name: "Sillón principal gris Oxford", icon: "🛋️", width: 180, height: 80 },
            { name: "Sillón principal palo de rosa (alita)", icon: "🛋️", width: 90, height: 80 },
            { name: "Sillón principal beige", icon: "🛋️", width: 180, height: 80 },
            { name: "Sala lounge madera (Set)", icon: "🛋️", width: 300, height: 200 },
            { name: "Banca larga sin respaldo", icon: "⬛", width: 200, height: 40 },
            { name: "Banca larga con respaldo", icon: "⬛", width: 200, height: 50 },
            { name: "Banco individual puff", icon: "⭕", width: 40, height: 40 },
            { name: "Banco metálico alto", icon: "⬛", width: 40, height: 40 },
            { name: "Banco de madera alto", icon: "🪵", width: 40, height: 40 },
            { name: "Banco alto tejido plástico negro", icon: "⬛", width: 40, height: 40 },
            { name: "Banca para novios", icon: "💍", width: 150, height: 60 },
            { name: "Periquera alta madera", icon: "🪵", width: 60, height: 60 },
            { name: "Periquera alta metal", icon: "⬛", width: 60, height: 60 }
        ]
    },
    {
        category: "Estructuras y Decoración",
        emoji: "🏛️",
        elements: [
            { name: "Carpa tipo pagoda", icon: "🏕️", width: 600, height: 600 },
            { name: "Carpa estructura (stretch)", icon: "⛺", width: 1000, height: 1000 },
            { name: "Carpa dosel / cenador", icon: "🕌", width: 300, height: 300 },
            { name: "Carpa blackout", icon: "🏗️", width: 1000, height: 1000 },
            { name: "Carpa transparente", icon: "🔲", width: 1000, height: 1000 },
            { name: "Carpa marquesina", icon: "🎪", width: 300, height: 600 },
            { name: "Toldo corredizo", icon: "━", width: 300, height: 600 },
            { name: "Carpa beduina", icon: "🕌", width: 1000, height: 1000 },
            { name: "Pérgola", icon: "🌿", width: 400, height: 400 },
            { name: "Pieza de templete de madera", icon: "🪵", width: 122, height: 122 },
            { name: "Sombrilla", icon: "☂️", width: 200, height: 200 },
            { name: "Back redondo metálico", icon: "⭕", width: 200, height: 200 },
            { name: "Portería metálica negra", icon: "⬛", width: 300, height: 50 },
            { name: "Portería metálica dorada", icon: "⬛", width: 300, height: 50 },
            { name: "Alfombra roja", icon: "⬛", width: 150, height: 500 },
            { name: "Caballete de madera", icon: "🖼️", width: 60, height: 60 },
            { name: "Atril de madera", icon: "🎤", width: 60, height: 60 },
            { name: "Reclinatorio", icon: "🙏", width: 80, height: 50 },
            { name: "Cruz de madera para ceremonia", icon: "✝️", width: 100, height: 50 },
            { name: "Unifila de madera", icon: "⬛", width: 200, height: 30 },
            { name: "Tarima / escenario modular", icon: "🎭", width: 244, height: 122 },
            { name: "Piso flotante de madera", icon: "🪵", width: 200, height: 100 },
            { name: "Pasarela / runway", icon: "➡️", width: 122, height: 488 },
            { name: "Arco de bienvenida floral", icon: "🌸", width: 300, height: 50 },
            { name: "Altar / arco de ceremonia", icon: "💒", width: 300, height: 100 },
            { name: "Letra gigante XV 1.10 mt", icon: "🔤", width: 80, height: 30 },
            { name: "Letra gigante XV 1.80 mt", icon: "🔤", width: 100, height: 40 },
            { name: "Letra gigante L", icon: "🔤", width: 60, height: 30 },
            { name: "Letra gigante O", icon: "🔤", width: 60, height: 30 },
            { name: "Letra gigante V", icon: "🔤", width: 60, height: 30 },
            { name: "Letra gigante E", icon: "🔤", width: 60, height: 30 },
            { name: "Corazón gigante", icon: "❤️", width: 100, height: 40 },
            { name: "Letra gigante personalizada", icon: "🔤", width: 80, height: 30 },
            { name: "Número gigante", icon: "🔢", width: 80, height: 30 },
            { name: "Cuadro Virgen María", icon: "🖼️", width: 60, height: 10 },
            { name: "Mesa para firma de actas", icon: "✍️", width: 120, height: 60 },
            { name: "Dosel para altar", icon: "🕌", width: 200, height: 200 },
            { name: "Rack metálico para platos", icon: "📦", width: 60, height: 60 },
            { name: "Carrito de snacks", icon: "🛒", width: 120, height: 60 },
            { name: "Tapa de carrito (shots)", icon: "🥃", width: 120, height: 60 },
            { name: "Tapa de carrito (esquites)", icon: "🌽", width: 120, height: 60 },
            { name: "Mesa de servicio (waiter station)", icon: "🍽️", width: 120, height: 60 },
            { name: "Carro de transporte de alimentos", icon: "🛒", width: 80, height: 50 },
            { name: "Muro / pared perimetral", icon: "▬", width: 500, height: 20 },
            { name: "Barda temporal (panel)", icon: "▬", width: 200, height: 20 },
            { name: "Valla metálica de seguridad", icon: "🚧", width: 250, height: 40 },
            { name: "Cuerda de terciopelo", icon: "〰️", width: 200, height: 20 },
            { name: "Mampara divisoria", icon: "▬", width: 122, height: 20 },
            { name: "Biombo decorativo", icon: "▬", width: 150, height: 30 },
            { name: "Cerca decorativa (setos)", icon: "🌿", width: 200, height: 40 }
        ]
    },
    {
        category: "Barra y Bebidas",
        emoji: "🍹",
        elements: [
            { name: "Barra principal de bar", icon: "🍹", width: 300, height: 60 },
            { name: "Barra de coctelería", icon: "🍸", width: 200, height: 60 },
            { name: "Barra de vinos", icon: "🍷", width: 200, height: 60 },
            { name: "Barra de cervezas", icon: "🍺", width: 200, height: 60 },
            { name: "Barra de destilados", icon: "🥃", width: 200, height: 60 },
            { name: "Barra de agua / hidratación", icon: "💧", width: 120, height: 60 },
            { name: "Barra de café espresso", icon: "☕", width: 150, height: 60 },
            { name: "Barra móvil", icon: "🛒", width: 100, height: 50 },
            { name: "Barra de bebidas sin alcohol", icon: "🧃", width: 200, height: 60 },
            { name: "Taquilla de bebidas (caja)", icon: "💰", width: 100, height: 60 },
            { name: "Hielera / tina de hielo", icon: "🧊", width: 80, height: 60 },
            { name: "Vitroleros / aguas frescas", icon: "🫙", width: 60, height: 60 },
            { name: "Garrafón de agua", icon: "💧", width: 40, height: 40 },
            { name: "Charola bar", icon: "⬛", width: 60, height: 40 },
            { name: "Exprimidor de limón", icon: "🍋", width: 20, height: 20 },
            { name: "Licuadora", icon: "🍹", width: 30, height: 30 }
        ]
    },
    {
        category: "Entretenimiento y Producción",
        emoji: "🎵",
        elements: [
            { name: "Cabina de DJ", icon: "🎧", width: 200, height: 100 },
            { name: "Área de banda en vivo", icon: "🎸", width: 600, height: 400 },
            { name: "Área de mariachi", icon: "🎺", width: 300, height: 300 },
            { name: "Piano", icon: "🎹", width: 150, height: 150 },
            { name: "Área de sonido (técnico)", icon: "🔊", width: 200, height: 100 },
            { name: "Torres de sonido (bocinas)", icon: "🔊", width: 50, height: 50 },
            { name: "Subwoofer", icon: "🔊", width: 60, height: 60 },
            { name: "Área de iluminación (técnico)", icon: "💡", width: 200, height: 100 },
            { name: "Pista de baile principal", icon: "💃", width: 600, height: 600 },
            { name: "Pista de baile LED", icon: "💡", width: 600, height: 600 },
            { name: "Pista de madera elevada", icon: "🪵", width: 600, height: 600 },
            { name: "Pista de espejo", icon: "🪞", width: 600, height: 600 },
            { name: "Escenario principal", icon: "🎭", width: 600, height: 400 },
            { name: "Back de escenario", icon: "🖼️", width: 600, height: 30 },
            { name: "Pantalla LED / proyección", icon: "📺", width: 400, height: 30 },
            { name: "Proyector", icon: "📽️", width: 40, height: 40 },
            { name: "Área de fotógrafo", icon: "📷", width: 150, height: 150 },
            { name: "Área de videógrafo", icon: "🎥", width: 150, height: 150 },
            { name: "Cabina de transmisión (Streaming)", icon: "📡", width: 200, height: 200 },
            { name: "Área de MC", icon: "🎤", width: 100, height: 100 },
            { name: "Área de photobooth", icon: "📸", width: 300, height: 300 },
            { name: "Stand de fotos 360°", icon: "🔄", width: 300, height: 300 },
            { name: "Área de juegos / ludoteca", icon: "🎮", width: 400, height: 400 },
            { name: "Área de brincolines", icon: "🎪", width: 500, height: 500 },
            { name: "Área de shows / performance", icon: "🎭", width: 400, height: 400 },
            { name: "Área de casino night", icon: "🃏", width: 400, height: 400 },
            { name: "Área de karaoke", icon: "🎤", width: 300, height: 300 },
            { name: "Área de pintacaritas", icon: "🎨", width: 200, height: 200 },
            { name: "Área de caricaturista", icon: "✏️", width: 200, height: 200 }
        ]
    },
    {
        category: "Zonas Especiales",
        emoji: "🌿",
        elements: [
            { name: "Pasillo de ceremonia", icon: "➡️", width: 150, height: 800 },
            { name: "Sillas de ceremonia (filas)", icon: "🪑", width: 300, height: 100 },
            { name: "Área de músicos (ceremonia)", icon: "🎻", width: 200, height: 200 },
            { name: "Zona de niños pajes / damas", icon: "👧", width: 150, height: 150 },
            { name: "Mesa de recepción / registro", icon: "📋", width: 180, height: 60 },
            { name: "Mesa de regalo / urna", icon: "🎁", width: 120, height: 60 },
            { name: "Mesa de libro de firmas", icon: "✍️", width: 80, height: 50 },
            { name: "Mesa de seating chart", icon: "🗺️", width: 120, height: 60 },
            { name: "Área de cóctel de bienvenida", icon: "🥂", width: 500, height: 500 },
            { name: "Área de espera / lounge", icon: "🛋️", width: 400, height: 400 },
            { name: "Mesa de souvenirs", icon: "🎀", width: 150, height: 60 },
            { name: "Área de guardarropa", icon: "🧥", width: 200, height: 200 },
            { name: "Caballete con seating chart", icon: "🖼️", width: 60, height: 60 },
            { name: "Área VIP general", icon: "⭐", width: 600, height: 600 },
            { name: "Sala lounge VIP", icon: "🛋️", width: 300, height: 200 },
            { name: "Mesa VIP", icon: "⭐", width: 180, height: 180 },
            { name: "Barra privada VIP", icon: "🍸", width: 200, height: 60 },
            { name: "Área de festejado / novios", icon: "💍", width: 300, height: 300 },
            { name: "Área de niños", icon: "👶", width: 400, height: 400 },
            { name: "Zona de niñera / cuidador", icon: "👩", width: 200, height: 200 }
        ]
    },
    {
        category: "Estaciones de Alimentos",
        emoji: "🍳",
        elements: [
            { name: "Estación de carnes / taquiza", icon: "🌮", width: 200, height: 100 },
            { name: "Estación de mariscos", icon: "🦐", width: 200, height: 100 },
            { name: "Estación de pasta", icon: "🍝", width: 200, height: 100 },
            { name: "Estación de pizza", icon: "🍕", width: 200, height: 100 },
            { name: "Estación de ensaladas", icon: "🥗", width: 200, height: 100 },
            { name: "Estación de sushi", icon: "🍱", width: 200, height: 100 },
            { name: "Estación de waffles / crepas", icon: "🧇", width: 200, height: 100 },
            { name: "Estación de postres / dulces", icon: "🍮", width: 200, height: 100 },
            { name: "Mesa de dulces / candy bar", icon: "🍬", width: 300, height: 100 },
            { name: "Estación de esquites", icon: "🌽", width: 120, height: 60 },
            { name: "Estación de shots", icon: "🥃", width: 120, height: 60 },
            { name: "Estación de hot dogs", icon: "🌭", width: 150, height: 80 },
            { name: "Estación de hamburguesas", icon: "🍔", width: 200, height: 100 },
            { name: "Estación de quesos y charcutería", icon: "🧀", width: 250, height: 100 },
            { name: "Estación de fruta", icon: "🍉", width: 200, height: 100 },
            { name: "Estación de café / té", icon: "☕", width: 150, height: 80 },
            { name: "Estación de jugos / aguas frescas", icon: "🥤", width: 150, height: 80 },
            { name: "Barra de cochinita / carnitas", icon: "🐷", width: 200, height: 100 },
            { name: "Food truck", icon: "🚚", width: 600, height: 250 },
            { name: "Tablas de pan", icon: "🍞", width: 60, height: 40 },
            { name: "Tortillero / salsero", icon: "🌶️", width: 30, height: 30 }
        ]
    },
    {
        category: "Accesos y Circulación",
        emoji: "🚪",
        elements: [
            { name: "Entrada principal", icon: "🚪", width: 200, height: 50 },
            { name: "Entrada secundaria", icon: "🚪", width: 150, height: 50 },
            { name: "Entrada VIP", icon: "⭐", width: 150, height: 50 },
            { name: "Entrada para proveedores", icon: "🚛", width: 300, height: 50 },
            { name: "Entrada para personal / staff", icon: "👷", width: 100, height: 50 },
            { name: "Acceso vehicular", icon: "🚗", width: 400, height: 50 },
            { name: "Portón principal", icon: "🏛️", width: 350, height: 60 },
            { name: "Salida general", icon: "🟢", width: 200, height: 50 },
            { name: "Salida de emergencia", icon: "🆘", width: 150, height: 50 },
            { name: "Salida vehicular", icon: "🚗", width: 400, height: 50 },
            { name: "Salida de servicio", icon: "🔧", width: 150, height: 50 },
            { name: "Pasillo principal", icon: "➡️", width: 200, height: 500 },
            { name: "Pasillo secundario", icon: "➡️", width: 120, height: 500 },
            { name: "Pasillo VIP", icon: "⭐", width: 150, height: 500 },
            { name: "Zona buffer de circulación", icon: "░", width: 300, height: 300 },
            { name: "Escaleras", icon: "🔼", width: 200, height: 300 },
            { name: "Rampa accesible", icon: "♿", width: 150, height: 400 }
        ]
    },
    {
        category: "Servicios Sanitarios",
        emoji: "🚻",
        elements: [
            { name: "Baño de hombres", icon: "🚹", width: 300, height: 300 },
            { name: "Baño de mujeres", icon: "🚺", width: 300, height: 300 },
            { name: "Baño mixto", icon: "🚻", width: 250, height: 250 },
            { name: "Baño para discapacitados", icon: "♿", width: 200, height: 200 },
            { name: "Baño de staff / personal", icon: "👷", width: 200, height: 200 },
            { name: "Sanitarios portátiles", icon: "🚽", width: 150, height: 150 },
            { name: "Remolque de baños de lujo", icon: "🚿", width: 600, height: 250 },
            { name: "Área de lactancia / cambiador", icon: "🍼", width: 200, height: 200 }
        ]
    },
    {
        category: "Estacionamiento y Valet",
        emoji: "🚗",
        elements: [
            { name: "Estacionamiento general", icon: "🅿️", width: 1000, height: 1000 },
            { name: "Cajón de estacionamiento", icon: "🚗", width: 250, height: 500 },
            { name: "Estacionamiento VIP", icon: "⭐", width: 300, height: 600 },
            { name: "Estacionamiento discapacitados", icon: "♿", width: 350, height: 500 },
            { name: "Estacionamiento de proveedores", icon: "🚛", width: 400, height: 800 },
            { name: "Área de motos", icon: "🏍️", width: 200, height: 200 },
            { name: "Área de entrega Valet", icon: "🔑", width: 300, height: 300 },
            { name: "Área de acopio Valet (llaves)", icon: "🔑", width: 200, height: 200 },
            { name: "Carriles de Valet", icon: "➡️", width: 300, height: 800 },
            { name: "Área de espera Valet (salida)", icon: "🕐", width: 300, height: 300 }
        ]
    },
    {
        category: "Seguridad y Apoyo",
        emoji: "🔒",
        elements: [
            { name: "Caseta de seguridad", icon: "🛡️", width: 150, height: 150 },
            { name: "Puesto de seguridad interior", icon: "👮", width: 100, height: 100 },
            { name: "Puesto de seguridad exterior", icon: "👮", width: 100, height: 100 },
            { name: "Detector de metales", icon: "🔍", width: 90, height: 30 },
            { name: "Cámara de seguridad (CCTV)", icon: "📹", width: 30, height: 30 },
            { name: "Área de primeros auxilios", icon: "🏥", width: 300, height: 300 },
            { name: "Desfibrilador (DEA)", icon: "❤️🩹", width: 40, height: 40 },
            { name: "Extintor", icon: "🧯", width: 40, height: 40 },
            { name: "Punto de encuentro (emergencia)", icon: "⚠️", width: 400, height: 400 },
            { name: "Ruta de evacuación", icon: "➡️", width: 150, height: 500 },
            { name: "Área médica / paramédicos", icon: "🚑", width: 300, height: 300 },
            { name: "Área de fumadores", icon: "🚬", width: 300, height: 300 },
            { name: "Área de oración / capilla", icon: "🙏", width: 300, height: 300 },
            { name: "Punto de información", icon: "ℹ️", width: 150, height: 150 },
            { name: "ATM / cajero automático", icon: "🏧", width: 80, height: 80 },
            { name: "Zona de carga de celulares", icon: "🔋", width: 100, height: 50 },
            { name: "Área de mascotas", icon: "🐾", width: 300, height: 300 }
        ]
    },
    {
        category: "Jardín y Exteriores",
        emoji: "🌳",
        elements: [
            { name: "Jardín principal", icon: "🌿", width: 1000, height: 1000 },
            { name: "Jardín de ceremonia", icon: "💒", width: 800, height: 800 },
            { name: "Área de descanso exterior", icon: "🌳", width: 500, height: 500 },
            { name: "Fuente ornamental", icon: "⛲", width: 300, height: 300 },
            { name: "Alberca / piscina", icon: "💦", width: 800, height: 400 },
            { name: "Lago / estanque", icon: "💧", width: 1000, height: 600 },
            { name: "Área de fogata / bonfire", icon: "🔥", width: 300, height: 300 },
            { name: "Macetones decorativos", icon: "🪴", width: 60, height: 60 },
            { name: "Farol decorativo", icon: "🏮", width: 40, height: 40 },
            { name: "Reflector exterior", icon: "🔦", width: 50, height: 50 }
        ]
    },
    {
        category: "Cocina y Logística",
        emoji: "🍳",
        elements: [
            { name: "Cocina principal", icon: "🍳", width: 800, height: 600 },
            { name: "Cocina de campo / exterior", icon: "🔥", width: 600, height: 400 },
            { name: "Área de parrilla / asador", icon: "🔥", width: 300, height: 200 },
            { name: "Área de lavado de loza", icon: "🫧", width: 300, height: 200 },
            { name: "Área de almacenamiento temporal", icon: "📦", width: 400, height: 400 },
            { name: "Área de preparación fría", icon: "❄️", width: 300, height: 200 },
            { name: "Área de preparación caliente", icon: "🔥", width: 300, height: 200 },
            { name: "Refrigerador / cámara fría", icon: "❄️", width: 250, height: 250 },
            { name: "Generador eléctrico", icon: "⚡", width: 200, height: 150 },
            { name: "Área de descanso personal", icon: "👷", width: 400, height: 300 },
            { name: "Oficina de coordinación", icon: "📋", width: 300, height: 300 },
            { name: "Bodega general", icon: "📦", width: 600, height: 600 },
            { name: "Bodega de bebidas", icon: "🍾", width: 300, height: 300 },
            { name: "Área de carga y descarga", icon: "🚛", width: 500, height: 500 },
            { name: "Tablero eléctrico principal", icon: "⚡", width: 80, height: 30 },
            { name: "Toma de corriente / contacto", icon: "🔌", width: 30, height: 30 },
            { name: "Router / access point WiFi", icon: "📶", width: 40, height: 40 },
            { name: "Caja de conexiones A/V", icon: "🎛️", width: 60, height: 40 },
            { name: "Canaleta / cableado", icon: "〰️", width: 300, height: 20 },
            { name: "Toma de agua", icon: "💧", width: 40, height: 40 },
            { name: "Tinaco / cisterna temporal", icon: "💧", width: 150, height: 150 }
        ]
    },
    {
        category: "Decoración y Señalización",
        emoji: "🎨",
        elements: [
            { name: "Araña / chandelier", icon: "🕯️", width: 100, height: 100 },
            { name: "Lámpara colgante", icon: "💡", width: 60, height: 60 },
            { name: "Cortinas de luces", icon: "〰️", width: 300, height: 20 },
            { name: "Uplighting (luz de piso)", icon: "💡", width: 30, height: 30 },
            { name: "Luz de efecto gobo", icon: "🔦", width: 40, height: 40 },
            { name: "Cabeza móvil", icon: "🔦", width: 50, height: 50 },
            { name: "Láser", icon: "〰️", width: 40, height: 40 },
            { name: "Luz negra UV", icon: "💜", width: 50, height: 50 },
            { name: "Neón decorativo", icon: "💡", width: 150, height: 30 },
            { name: "Pared de flores", icon: "🌸", width: 300, height: 30 },
            { name: "Pared de globos", icon: "🎈", width: 300, height: 30 },
            { name: "Escultura de hielo", icon: "🧊", width: 100, height: 100 },
            { name: "Globos gigantes", icon: "🎈", width: 80, height: 80 },
            { name: "Números para mesa en madera", icon: "🪵", width: 20, height: 20 },
            { name: "Números de mesa acrílico", icon: "🔢", width: 20, height: 20 },
            { name: "Base metálica para numeración", icon: "⬛", width: 20, height: 20 },
            { name: "Señal de zona / área", icon: "🏷️", width: 80, height: 20 },
            { name: "Señalización de emergencia", icon: "⚠️", width: 60, height: 20 },
            { name: "Señalización de accesibilidad", icon: "♿", width: 60, height: 20 }
        ]
    }
];

async function main() {
    console.log('Iniciando carga de elementos de producción...');
    let totalAdded = 0;

    for (const catData of productionData) {
        let category = await prisma.productionCategory.findFirst({
            where: { name: catData.category }
        });

        if (!category) {
            category = await prisma.productionCategory.create({
                data: { name: catData.category, emoji: catData.emoji }
            });
            console.log(`Creada categoría de producción: ${category.name}`);
        }

        for (const elemData of catData.elements) {
            let element = await prisma.productionElement.findFirst({
                where: { name: elemData.name, categoryId: category.id }
            });

            if (!element) {
                await prisma.productionElement.create({
                    data: {
                        name: elemData.name,
                        categoryId: category.id,
                        width: elemData.width,
                        height: elemData.height,
                        icon: elemData.icon
                    }
                });
                totalAdded++;
            }
        }
    }

    console.log(`Carga completa! Se agregaron ${totalAdded} elementos de producción visuales nuevos.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
