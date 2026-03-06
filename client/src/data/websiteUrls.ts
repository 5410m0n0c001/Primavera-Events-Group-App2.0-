export interface WebsiteLink {
    title: string;
    url: string;
}

export interface WebsiteCategory {
    category: string;
    icon: string;
    links: WebsiteLink[];
}

export const websiteUrls: WebsiteCategory[] = [
    {
        category: "🏠 PÁGINAS PRINCIPALES",
        icon: "🏠",
        links: [
            { title: "Home", url: "https://primaveraeventsgroup.com/" },
            { title: "About", url: "https://primaveraeventsgroup.com/about/" },
            { title: "Blog", url: "https://primaveraeventsgroup.com/blog/" },
            { title: "Contact", url: "https://primaveraeventsgroup.com/987509816-2/" },
            { title: "Gallery", url: "https://primaveraeventsgroup.com/987509809-2/" },
            { title: "Services", url: "https://primaveraeventsgroup.com/services/" },
            { title: "Paquetes Primavera (Hub)", url: "https://primaveraeventsgroup.com/paquetes-primavera/" },
            { title: "Venues (Index)", url: "https://primaveraeventsgroup.com/venues/" },
            { title: "Wedding & Event Planning", url: "https://primaveraeventsgroup.com/wedding-event-planning/" },
            { title: "Banquetes Primavera", url: "https://primaveraeventsgroup.com/banquetes-primavera/" }
        ]
    },
    {
        category: "💍 WEDDING & EVENT PLANNING",
        icon: "💍",
        links: [
            { title: "Bodas", url: "https://primaveraeventsgroup.com/bodas/" },
            { title: "Quinceañeras Primavera", url: "https://primaveraeventsgroup.com/quinceaneras-primavera/" },
            { title: "Graduaciones Primavera", url: "https://primaveraeventsgroup.com/graduaciones-primavera/" },
            { title: "Cásate en Morelos", url: "https://primaveraeventsgroup.com/casate-en-morelos/" }
        ]
    },
    {
        category: "🍽 BANQUETES PRIMAVERA",
        icon: "🍽",
        links: [
            { title: "Nuestros Menús", url: "https://primaveraeventsgroup.com/nuestros-menus/" },
            { title: "Nuestros Postres", url: "https://primaveraeventsgroup.com/nuestros-postres/" },
            { title: "Staffing", url: "https://primaveraeventsgroup.com/staffing/" },
            { title: "Transportación", url: "https://primaveraeventsgroup.com/transportacion/" },
            { title: "Montajes y Mobiliario", url: "https://primaveraeventsgroup.com/montajes-y-mobiliario/" },
            { title: "Fotografía y Video", url: "https://primaveraeventsgroup.com/fotografia-y-video/" },
            { title: "Paquetes de Fotografía y Video", url: "https://primaveraeventsgroup.com/paquetes-de-fotografia-y-video/" },
            { title: "Clientes Felices", url: "https://primaveraeventsgroup.com/clientes-felices/" }
        ]
    },
    {
        category: "🏛 VENUES",
        icon: "🏛",
        links: [
            { title: "Centro de Convenciones Presidente", url: "https://primaveraeventsgroup.com/centro-de-convenciones-presidente/" },
            { title: "Jardín La Flor", url: "https://primaveraeventsgroup.com/jardin-la-flor/" },
            { title: "Salón Jardín Yolomecatl", url: "https://primaveraeventsgroup.com/salon-jardin-yolomecatl/" },
            { title: "Salón Los Potrillos", url: "https://primaveraeventsgroup.com/salon-los-potrillos/" },
            { title: "Salón Los Caballos", url: "https://primaveraeventsgroup.com/salon-los-caballos/" },
            { title: "Quinta San Francisco", url: "https://primaveraeventsgroup.com/quinta-san-francisco/" },
            { title: "Jardín Tsu Nuum", url: "https://primaveraeventsgroup.com/jardin-tsu-nuum/" }
        ]
    },
    {
        category: "📦 PAQUETES PRIMAVERA",
        icon: "📦",
        links: [
            { title: "Paquete Armonía", url: "https://primaveraeventsgroup.com/paquete-armonia/" },
            { title: "Paquete Memoria Clásica", url: "https://primaveraeventsgroup.com/paquete-memoria-clasica/" },
            { title: "Paquete Experiencia Deluxe", url: "https://primaveraeventsgroup.com/paquete-experiencia-deluxe/" },
            { title: "Paquete Cinematic Prestige", url: "https://primaveraeventsgroup.com/paquete-cinematic-prestige/" },
            { title: "Paquete Eternal Promise", url: "https://primaveraeventsgroup.com/paquete-eternal-promise/" },
            { title: "Paquete Royal Cinematic", url: "https://primaveraeventsgroup.com/paquete-royal-cinematic/" },
            { title: "Paquete Presidente", url: "https://primaveraeventsgroup.com/paquete-presidente/" },
            { title: "Paquete Gobernador", url: "https://primaveraeventsgroup.com/paquete-gobernador/" },
            { title: "Paquete Imperial Ecuestre", url: "https://primaveraeventsgroup.com/paquete-imperial-ecuestre/" },
            { title: "Paquete Destino Yolomecatl", url: "https://primaveraeventsgroup.com/paquete-destino-yolomecatl/" },
            { title: "Paquete Linaje Pura Sangre", url: "https://primaveraeventsgroup.com/paquete-linaje-pura-sangre/" },
            { title: "Paquete Esencia Floral", url: "https://primaveraeventsgroup.com/paquete-esencia-floral/" },
            { title: "Paquete Glow Graduation Elite", url: "https://primaveraeventsgroup.com/paquete-glow-graduation-elite/" },
            { title: "Paquete Vuelo Esmeralda", url: "https://primaveraeventsgroup.com/paquete-vuelo-esmeralda/" }
        ]
    },
    {
        category: "👤 PÁGINAS PERSONALES",
        icon: "👤",
        links: [
            { title: "Jessy", url: "https://primaveraeventsgroup.com/jessy/" },
            { title: "Richard Hernández", url: "https://primaveraeventsgroup.com/richard-hernandez/" }
        ]
    },
    {
        category: "⚖️ LEGALES",
        icon: "⚖️",
        links: [
            { title: "Términos y Condiciones", url: "https://primaveraeventsgroup.com/terminos-y-condiciones/" },
            { title: "Aviso de Privacidad", url: "https://primaveraeventsgroup.com/aviso-de-privacidad/" }
        ]
    },
    {
        category: "⚙️ INTERNAS / OPERATIVAS",
        icon: "⚙️",
        links: [
            { title: "Dashboard de Proyecto Corporativo", url: "https://primaveraeventsgroup.com/dashboard-de-proyecto-corporativo/" },
            { title: "Cotización Demo", url: "https://primaveraeventsgroup.com/cotizacion-demo/" },
            { title: "Módulo de Pedidos de Renta", url: "#" }
        ]
    }
];
