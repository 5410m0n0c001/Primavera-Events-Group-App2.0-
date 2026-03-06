import React, { useState, useMemo } from 'react';
import type { QuoteDraft } from '../../types';

import SmartCategory from './SmartCategory';
import ManualItemForm from './ManualItemForm';
import QuoteBreakdown from './QuoteBreakdown';

// Mock Data for MVP - Replace with API calls
const DATA_CATEGORIES = [
    {
        id: 'cat_packages', title: 'Paquetes de Eventos Oficiales', items: [
            { id: 'pkg_gob', name: 'Paquete Gobernador', price: 900, unit: 'persona', description: 'Venue: Convenciones Presidente. 3 tiempos, Coctel, DJ 8 hrs', category: 'Paquetes' },
            { id: 'pkg_pres', name: 'Paquete Presidente', price: 1100, unit: 'persona', description: 'Venue: Convenciones Presidente. 4 tiempos, Capitán, Grupo Musical', category: 'Paquetes' },
            { id: 'pkg_yolo', name: 'Destino Yolomecatl', price: 850, unit: 'persona', description: 'Venue: Jardín Yolomecatl. Paquete base con locación incluida', category: 'Paquetes' },
            { id: 'pkg_flor', name: 'Esencia Floral', price: 950, unit: 'persona', description: 'Venue: Villa San Gaspar. Boda íntima (Max 200px), Back Fotográfico', category: 'Paquetes' },
            { id: 'pkg_ecues', name: 'Imperial Ecuestre', price: 800, unit: 'persona', description: 'Venue: Jardín Los Caballos. 4 tiempos, DJ Residente, Letras 1.10m', category: 'Paquetes' },
            { id: 'pkg_pura', name: 'Linaje Pura Sangre', price: 1050, unit: 'persona', description: 'Venue: Rancho Los Potrillos. Bodas Charras. Toro Mecánico incluido', category: 'Paquetes' },
            { id: 'pkg_zara', name: 'Armonía Zarabanda', price: 1250, unit: 'persona', description: 'Venue: Quinta Zarabanda. Suite VIP', category: 'Paquetes' },
            { id: 'pkg_vuelo', name: 'Vuelo Esmeralda', price: 1350, unit: 'persona', description: 'Venue: Jardín Tsu Nuum. Hotel 60px', category: 'Paquetes' },
            { id: 'pkg_natur', name: 'Nature\'s Majesty', price: 1150, unit: 'persona', description: 'Venue: Finca Los Isabeles. Hospedaje 14px', category: 'Paquetes' }
        ]
    },
    {
        id: 'cat_photo', title: 'Fotografía y Video', items: [
            { id: 'pho_1', name: 'Bodas: Eternal Promise', price: 9900, unit: 'paquete', description: 'Fotos ilimitadas, álbum 200 fotos, sesión previa', category: 'Foto/Video' },
            { id: 'pho_2', name: 'Bodas: Royal Cinematic', price: 13900, unit: 'paquete', description: '2 cámaras, drone 4K, photobook 100 fotos', category: 'Foto/Video' },
            { id: 'pho_3', name: 'XV: Memoria Clásica', price: 9350, unit: 'paquete', description: '7 hrs continuas, álbum, 100 fotos impresas', category: 'Foto/Video' },
            { id: 'pho_4', name: 'XV: Experiencia Deluxe', price: 10900, unit: 'paquete', description: 'Sesión previa exterior + videoclip', category: 'Foto/Video' },
            { id: 'pho_5', name: 'XV: Cinematic Prestige', price: 13900, unit: 'paquete', description: 'Grabación a 2 cámaras + Drone 4K', category: 'Foto/Video' }
        ]
    },
    {
        id: 'cat_furniture', title: 'Mobiliario Individual', items: [
            { id: 'fur_mre', name: 'Mesa redonda (10 personas)', price: 80, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mtb', name: 'Tablón', price: 70, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mcm', name: 'Mesa cuadrada de madera', price: 90, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mrm', name: 'Mesa rectangular tipo marmol', price: 120, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mrmi', name: 'mesa rectangular de madera color miel', price: 100, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mrno', name: 'mesa rectangular de madera color nogal clasico', price: 100, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mpc', name: 'mesa plegable cuadrada', price: 60, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_minf', name: 'mesa infantil', price: 50, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_mcer', name: 'mesa madera blanca ceremonia', price: 90, unit: 'pz', description: 'Mesas', category: 'Mesas' },
            { id: 'fur_smi', name: 'silla cross back miel', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_snog', name: 'silla cross back', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_scb', name: 'silla cross back negra', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sdn', name: 'silla diana negra', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sdb', name: 'Silla diana blanca', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sdm', name: 'silla diana madera', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svd', name: 'silla versalles dorada', price: 40, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svp', name: 'silla versalles plata', price: 40, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svb', name: 'silla versalles blanca', price: 40, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svc', name: 'silla versalles caoba', price: 40, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svt', name: 'silla versalles transparente', price: 45, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sro', name: 'silla romana', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_scb2', name: 'silla chavari Blanca', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_scdo', name: 'silla chavari dorada', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_stlb', name: 'silla tiffany laqueada blanca', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_stdo', name: 'silla tiffany dorada', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_stch', name: 'silla tiffany chocolate', price: 35, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sagb', name: 'silla avant gaard blanca', price: 30, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_sprg', name: 'silla praga', price: 50, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_smed', name: 'silla medallon', price: 50, unit: 'pz', description: 'Sillas', category: 'Sillas' },
            { id: 'fur_svba', name: 'silla Versalle baby', price: 20, unit: 'pz', description: 'Sillas Infantiles', category: 'Sillas' },
            { id: 'fur_stba', name: 'silla tiffany baby', price: 20, unit: 'pz', description: 'Sillas Infantiles', category: 'Sillas' },
            { id: 'fur_sagbaby', name: 'silla Avant garde baby', price: 20, unit: 'pz', description: 'Sillas Infantiles', category: 'Sillas' }
        ]
    },
    {
        id: 'cat_lounge', title: 'Salas Lounge y Periqueras', items: [
            { id: 'lou_pam', name: 'periquera alta madera', price: 80, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_pame', name: 'Periquera alta metal', price: 80, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_slm', name: 'Sala lounge madera', price: 150, unit: 'set', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_mdc', name: 'mesa de centro', price: 70, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_blsr', name: 'banca larga sin respaldo', price: 60, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_blcr', name: 'banca larga con respaldo', price: 80, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' },
            { id: 'lou_bicr', name: 'banco individual con respaldo', price: 45, unit: 'pz', description: 'Lounge', category: 'Salas Lounge' }
        ]
    },
    {
        id: 'cat_glassware', title: 'Cristalería, Loza y Cuchillería', items: [
            { id: 'gls_pcd', name: 'plato base concha dorado', price: 18, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pbt', name: 'plato base talavera', price: 18, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pbcod', name: 'plato base cristal con OrIlla dorada', price: 20, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pbgr', name: 'plato base gotico rojo', price: 20, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pbra', name: 'plato base ratan', price: 15, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pbgn', name: 'plato base gotico negro', price: 20, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ptb', name: 'plato trinche blanco', price: 10, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ptc', name: 'plato trinche cuadrado', price: 12, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ptt', name: 'plato trinche tinto', price: 12, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ptcp', name: 'plato trinche color pastel', price: 12, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ptnm', name: 'plato trinche negro mate', price: 12, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pps', name: 'plato pozolero /sopera', price: 10, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_ppcb', name: 'plato postre cuadradoblanco', price: 8, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pprb', name: 'plato postro redondoblanco', price: 8, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_tpc', name: 'tazon para crema', price: 8, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_tpc2', name: 'taza para cafe', price: 8, unit: 'pz', description: 'Loza', category: 'Loza' },
            { id: 'gls_pac', name: 'platones al centro', price: 25, unit: 'pz', description: 'Loza', category: 'Loza' },

            { id: 'cuc_cd', name: 'cubierto dorado', price: 15, unit: 'pz', description: 'Cuchillería', category: 'Cuchillería' },
            { id: 'cuc_cs', name: 'cubierto silver', price: 10, unit: 'pz', description: 'Cuchillería', category: 'Cuchillería' },
            { id: 'cuc_pc', name: 'pinzas /cucharon', price: 10, unit: 'pz', description: 'Cuchillería', category: 'Cuchillería' },

            { id: 'cri_vj', name: 'vaso jaibolero/ agua', price: 8, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cf', name: 'copa flauta', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cg', name: 'copa globo', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cvt', name: 'copa vino tinto', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cvca', name: 'copa vino color ambar', price: 15, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cvcu', name: 'copa vino color uva', price: 15, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cvtca', name: 'copa vino tinto color azul', price: 15, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cm', name: 'copa martinera', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cco', name: 'copa coñaquera', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_cmar', name: 'copa margarita', price: 12, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_caba', name: 'caballitos', price: 6, unit: 'pz', description: 'Cristalería', category: 'Cristalería' },
            { id: 'cri_jc', name: 'jarra cristalina', price: 25, unit: 'pz', description: 'Cristalería', category: 'Cristalería' }
        ]
    },
    {
        id: 'cat_mantels', title: 'Mantelería y Caminos', items: [
            { id: 'mtl_mbr', name: 'mantel blanco redondo', price: 40, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_tmmr', name: 'tablero de madera y mantel rojo', price: 60, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_mve', name: 'mantel vintage encaje', price: 50, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_fb', name: 'faldón / bamabalina', price: 35, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_ff', name: 'funda francesa', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_co', name: 'cubre organza', price: 25, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_bm', name: 'banda / moño', price: 10, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_st', name: 'servilleta tela', price: 8, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'mtl_sl', name: 'servilleta de lino', price: 12, unit: 'pz', description: 'Mantelería', category: 'Mantelería' },
            { id: 'cam_cc', name: 'camino de color ( preguntar disponibilidad de color)', price: 15, unit: 'pz', description: 'Mantelería', category: 'Mantelería' }
        ]
    },
    {
        id: 'cat_structures', title: 'Decoración y Estructuras', items: [
            { id: 'dec_bmpm', name: 'base de madera plegable para mesa', price: 30, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'dec_cmb', name: 'cubo metálico base', price: 40, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'dec_bma', name: 'base metálica alta (centro de mesa)', price: 50, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'dec_dm', name: 'descanso metálico', price: 25, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'dec_ddm', name: 'descansó de madera', price: 35, unit: 'pz', description: 'Estructuras', category: 'Estructuras' },
            { id: 'dec_lg1', name: 'Letras gigantes 1.20 metros Iluminadas', price: 600, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_lg8', name: 'Letras gigantes 1.80 metros iluinadas', price: 900, unit: 'set', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'dec_cgi', name: 'corazon gigante Iluminado (back fotos)', price: 700, unit: 'pz', description: 'Decoración Iluminada', category: 'Decoración Iluminada' },
            { id: 'str_por', name: 'porterias 3x3 perimetrales (1 tramo )', price: 1500, unit: 'pz', description: 'Estructuras Gigantes', category: 'Estructuras Gigantes' },
            { id: 'str_som', name: 'sombrilla 3 metros', price: 300, unit: 'pz', description: 'Carpas', category: 'Carpas' },
            { id: 'str_dom', name: 'domo de 10x10 a 6 metros de atura', price: 4500, unit: 'pz', description: 'Carpas', category: 'Carpas' },
            { id: 'dec_spl', name: 'sillas principe O princesa (sillón)', price: 350, unit: 'pz', description: 'Decoración', category: 'Decoración Base' },
            { id: 'dec_cbl', name: 'cabildo de ceremonia de madera', price: 400, unit: 'pz', description: 'Decoración', category: 'Decoración Base' },
            { id: 'pis_pci', name: 'Pista cristal (iluminada) (1.20x1.20)', price: 250, unit: 'm2', description: 'Pistas', category: 'Pistas' },
            { id: 'pis_ppm', name: 'pista pintada a Mano (1.20 x 1.20)', price: 200, unit: 'm2', description: 'Pistas', category: 'Pistas' },
            { id: 'pis_pil', name: 'pista iluminada led pixel (1.20 x1.220)', price: 300, unit: 'm2', description: 'Pistas', category: 'Pistas' },
            { id: 'pis_tba', name: 'Tarima basica de 10 / 15 y 30 cms alto (1.20*1.20)', price: 150, unit: 'm2', description: 'Pistas', category: 'Pistas' },
            { id: 'pis_cha', name: 'Charolados (negro O Blanco) (1.20x1.20)', price: 180, unit: 'm2', description: 'Pistas', category: 'Pistas' },
            { id: 'dec_tps', name: 'tapete pasto sintentico ( 2 x 10 metros)', price: 400, unit: 'pz', description: 'Decoración', category: 'Decoración' }
        ]
    },
    {
        id: 'cat_extras', title: 'Extras y Accesorios', items: [
            { id: 'ext_hm', name: 'hielera de mesa', price: 100, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_hp', name: 'hielera de pizo', price: 120, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_hg', name: 'hielera grande (cielo)', price: 150, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_sc', name: 'samover chico', price: 80, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_sm', name: 'samover mediano', price: 100, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_sg', name: 'samover grande', price: 150, unit: 'pz', description: 'Equipo y Accesorios', category: 'Equipo' },
            { id: 'ext_sca', name: 'saleros / ceniceros', price: 5, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_cma', name: 'charola mesero antideslizante redonda', price: 30, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_tp', name: 'tortillero de peltre', price: 15, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_tpa', name: 'tortillero de palma', price: 10, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_pdt', name: 'panera de teka', price: 25, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_tpas', name: 'tabla pastel', price: 50, unit: 'pz', description: 'Accesorios', category: 'Accesorios' },
            { id: 'ext_tdq', name: 'tabla de Quesos', price: 40, unit: 'pz', description: 'Accesorios', category: 'Accesorios' }
        ]
    }
];

import { useQuoteCalculations } from '../../hooks/useQuoteCalculations';

const QuoteWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<QuoteDraft>({
        eventName: '',
        guestCount: 100,
        date: '',
        selectedItems: [], // { item: any, quantity: number }
        discount: 0,
        downPaymentPercentage: 30, // Default 30%
        paymentLimitDate: ''
    });
    const [budget, setBudget] = useState(0);
    const [showManualForm, setShowManualForm] = useState(false);

    // Use the centralized calculation hook
    const totals = useQuoteCalculations(draft);

    // Leads Management
    const [showLeads, setShowLeads] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);

    React.useEffect(() => {
        if (showLeads) fetchLeads();
    }, [showLeads]);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/clients');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.filter((c: any) => c.type === 'LEAD'));
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('¿Eliminar este lead?')) return;
        try {
            const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
            }
        } catch (e) { console.error(e); }
    };

    const handleResumeLead = (lead: any) => {
        setDraft(prev => ({
            ...prev,
            eventName: `${lead.firstName} ${lead.lastName}`,
            guestCount: 100 // Default or if captured in lead
        }));
        setShowLeads(false);
        alert(`Lead ${lead.firstName} cargado. Puedes comenzar a cotizar.`);
    };

    const handleEditLead = async (lead: any) => {
        const newName = prompt('Editar Nombre:', lead.firstName);
        if (newName && newName !== lead.firstName) {
            try {
                // Simple update for MVP
                const res = await fetch(`/api/clients/${lead.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...lead, firstName: newName })
                });
                if (res.ok) fetchLeads();
            } catch (e) { console.error(e); }
        }
    };


    // Dynamic Quantity Scaling when guestCount changes
    // This solves the bug: "los datos no son dinámicos al cambiar el número de invitados"
    React.useEffect(() => {
        // Only run if there are selected items to update
        if (draft.selectedItems.length === 0) return;

        setDraft(prev => {
            let hasChanges = false;
            const updatedItems = prev.selectedItems.map(si => {
                const isPerPerson = si.item?.unit?.toLowerCase() === 'persona' || si.item?.unit?.toLowerCase() === 'pax';
                if (!isPerPerson && !si.item?.name?.toLowerCase().includes('mesero') && !si.item?.name?.toLowerCase().includes('mesa')) {
                    return si; // Keep same quantity if it doesn't auto-scale
                }

                // Re-apply smart quantity rule
                let suggestedQty = si.quantity;
                if (isPerPerson) suggestedQty = prev.guestCount;
                if (si.item?.name?.toLowerCase().includes('mesero')) suggestedQty = Math.ceil(prev.guestCount / 15);
                if (si.item?.name?.toLowerCase().includes('mesa') && !si.item?.name?.toLowerCase().includes('principal')) suggestedQty = Math.ceil(prev.guestCount / 10);

                if (suggestedQty !== si.quantity) {
                    hasChanges = true;
                }

                return {
                    ...si,
                    quantity: suggestedQty,
                    cost: suggestedQty * si.unitPrice
                };
            });
            // Prevent infinite loop by returning exact same reference if nothing actually changed
            return hasChanges ? { ...prev, selectedItems: updatedItems } : prev;
        });
    }, [draft.guestCount]); // Solo debe reaccionar al cambio del contador de invitados

    // Capacity Validation checks absolute max venue size.
    const locationCapacity = 800; // Max venue capacity for C.C Presidente
    const isOverCapacity = draft.guestCount > locationCapacity;

    const handleToggleItem = (item: any, quantity: number) => {
        setDraft(prev => {
            const existing = prev.selectedItems.find(i => i.item?.id === item.id);
            if (quantity <= 0) {
                return { ...prev, selectedItems: prev.selectedItems.filter(i => i.item?.id !== item.id) };
            }
            if (existing) {
                return { ...prev, selectedItems: prev.selectedItems.map(i => i.item?.id === item.id ? { ...i, quantity } : i) };
            }
            // Ensure strictly typed and structured QuoteItem
            const newItem = {
                item,
                quantity,
                id: `qi_${Date.now()}_${item.id}`,
                quoteId: 'temp',
                serviceItemId: item.id || 'manual',
                serviceItem: item,
                unitPrice: Number(item.price) || 0,
                cost: (Number(item.price) || 0) * quantity
            };
            return { ...prev, selectedItems: [...prev.selectedItems, newItem as any] };
        });
    };

    const handleAddManualItem = (newItem: any) => {
        handleToggleItem(newItem, 1);
    };

    const handleRemoveItem = (itemId: string) => {
        setDraft(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.filter(i => i.item?.id !== itemId)
        }));
    };

    const handleSaveDraft = async (status: 'DRAFT' | 'ACCEPTED' = 'DRAFT') => {
        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: draft.eventName,
                    guestCount: draft.guestCount,
                    date: draft.date,
                    items: draft.selectedItems,
                    totals,
                    status, // Dynamic status
                    discount: draft.discount,
                    downPaymentPercentage: draft.downPaymentPercentage,
                    paymentLimitDate: draft.paymentLimitDate
                })
            });

            if (response.ok) {
                const action = status === 'ACCEPTED' ? 'aprobada y registrada' : 'guardada';
                alert(`Cotización ${action} exitosamente.`);
                resetForm();
            } else {
                const err = await response.json();
                alert('Error al guardar: ' + (err.error || 'Error desconocido'));
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión con el servidor.');
        }
    };

    const resetForm = () => {
        setDraft({
            eventName: '',
            guestCount: 100,
            date: '',
            selectedItems: [],
            discount: 0,
            downPaymentPercentage: 30,
            paymentLimitDate: ''
        });
        setStep(1);
        setBudget(0);
    };

    const handleNextStep = async () => {
        // Validation Step 1
        if (!draft.eventName.trim()) {
            alert('Por favor agrega un Nombre del Evento.');
            return;
        }
        if (!draft.date) {
            alert('Por favor selecciona una Fecha.');
            return;
        }
        if (draft.guestCount <= 0) {
            alert('El número de invitados debe ser mayor a 0.');
            return;
        }

        // Hybrid Validation: Validate with backend before showing final summary -> MOVED TO FINALIZE
        // But we can do basic check here.
        setStep(2);
    };

    const handleFinalize = async () => {
        try {
            // Hybrid Validation: Validate with backend before showing final summary
            const response = await fetch('/api/quotes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: draft.selectedItems,
                    guestCount: draft.guestCount
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.valid && data.items) {
                    // Update draft with validated items (source of truth)
                    // This updates unitPrices if backend applies rules/corrections
                    setDraft(prev => ({ ...prev, selectedItems: data.items }));
                }
            }
        } catch (e) {
            console.error("Validation warning:", e);
        }
        setStep(3);
    };

    const handleGeneratePDF = async () => {
        const payload = {
            eventName: draft.eventName,
            guestCount: draft.guestCount,
            date: draft.date,
            items: draft.selectedItems.map(i => ({
                name: i.item?.name || 'Item',
                quantity: i.quantity,
                price: Number(i.unitPrice || i.item?.price || 0),
                unit: i.item?.unit || 'pz'
            })),
            totals // Include calculated totals
        };
        try {
            const response = await fetch('/api/quotes/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Cotizacion-${draft.eventName}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 relative">

            {/* Main Content */}
            <div className="flex-1 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif text-primavera-gold font-bold mb-2 break-words">
                        Nueva Cotización Inteligente
                    </h1>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-500">Diseña el evento perfecto con cálculos automáticos.</p>
                        <button
                            onClick={() => setShowLeads(true)}
                            className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold hover:bg-purple-200 transition flex items-center gap-1"
                        >
                            📋 Leads Pendientes
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex gap-4 mb-8 text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-4 overflow-x-auto">
                    <span className={step === 1 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>1. Evento</span>
                    <span className={step === 2 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>2. Servicios</span>
                    <span className={step === 3 ? 'text-black whitespace-nowrap' : 'whitespace-nowrap'}>3. Finalizar</span>
                </div>

                {step === 1 && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">Detalles del Evento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Nombre del Evento</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-primavera-gold focus:border-transparent outline-none transition"
                                    placeholder="e.j. Boda Juan y Maria"
                                    value={draft.eventName}
                                    onChange={e => setDraft({ ...draft, eventName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Tentativa</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    value={draft.date}
                                    onChange={e => setDraft({ ...draft, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Número de Invitados</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border font-bold text-lg"
                                    value={draft.guestCount}
                                    onChange={e => setDraft({ ...draft, guestCount: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-600">Presupuesto Objetivo (Opcional)</label>
                                <input
                                    type="number"
                                    className="w-full border-gray-300 rounded-lg p-3 border"
                                    placeholder="$0.00"
                                    value={budget}
                                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            {/* Financial Settings */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Descuento ($)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="0.00"
                                        value={draft.discount || ''}
                                        onChange={e => setDraft({ ...draft, discount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Anticipo Mínimo (%)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        placeholder="30"
                                        value={draft.downPaymentPercentage || ''}
                                        onChange={e => setDraft({ ...draft, downPaymentPercentage: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-600">Fecha Límite de Pago</label>
                                    <input
                                        type="date"
                                        className="w-full border-gray-300 rounded-lg p-3 border"
                                        value={draft.paymentLimitDate || ''}
                                        onChange={e => setDraft({ ...draft, paymentLimitDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={handleNextStep} className="w-full md:w-auto bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Siguiente: Seleccionar Servicios →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowManualForm(true)}
                                className="w-full md:w-auto bg-white border border-primavera-gold text-primavera-gold px-4 py-2 rounded-lg font-bold hover:bg-yellow-50 transition flex items-center justify-center gap-2"
                            >
                                + Agregar Elemento Manual
                            </button>
                        </div>

                        {DATA_CATEGORIES.map(cat => (
                            <SmartCategory
                                key={cat.id}
                                title={cat.title}
                                items={cat.items}
                                selectedItems={draft.selectedItems}
                                onToggleItem={handleToggleItem}
                                guestCount={draft.guestCount}
                            />
                        ))}
                        <div className="flex flex-col-reverse md:flex-row justify-between pt-6 gap-4">
                            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium py-2">
                                ← Volver
                            </button>
                            <button onClick={handleFinalize} className="bg-primavera-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                                Ver Resumen Final →
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="mb-6">
                            <span className="text-6xl">🎉</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">¡Cotización Lista!</h2>
                        <p className="text-gray-600 mb-8">Has configurado un evento para {draft.guestCount} personas.</p>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <button onClick={handleGeneratePDF} className="bg-primavera-gold text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition flex items-center justify-center gap-2">
                                <span>📄</span> Descargar PDF
                            </button>
                            <button onClick={() => handleSaveDraft('DRAFT')} className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">
                                Guardar como Borrador
                            </button>
                            <button onClick={() => handleSaveDraft('ACCEPTED')} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg flex items-center gap-2">
                                <span>✅</span> Aprobar y Registrar Evento
                            </button>
                        </div>
                        <button onClick={() => setStep(2)} className="mt-6 text-gray-500 underline text-sm">
                            Volver a editar
                        </button>
                    </div>
                )}

            </div>

            {/* Sidebar Calculator - Replaced by Breakdown Panel */}
            <div className="w-full md:w-96 flex-shrink-0 relative order-first md:order-last">
                <div className="sticky top-6">
                    <QuoteBreakdown
                        draft={draft}
                        onRemove={handleRemoveItem}
                    />

                    {isOverCapacity && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <strong>Capacidad Excedida</strong>
                                <p>Tus recintos soportan un máximo operativo regular de {locationCapacity} personas, pero tienes configurado {draft.guestCount} invitados. Confirme logística.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showManualForm && (
                <ManualItemForm
                    categories={DATA_CATEGORIES.map(c => c.title)}
                    onSave={handleAddManualItem}
                    onClose={() => setShowManualForm(false)}
                />
            )}

            {/* Leads Drawer */}
            {showLeads && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Leads Pendientes</h2>
                            <button onClick={() => setShowLeads(false)} className="text-gray-500 text-2xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            {leads.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay leads pendientes.</p>
                            ) : leads.map(lead => (
                                <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{lead.firstName} {lead.lastName}</h3>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                            <p className="text-xs text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pendiente</span>
                                    </div>

                                    <div className="flex gap-2 mt-4 border-t pt-3">
                                        <button
                                            onClick={() => handleResumeLead(lead)}
                                            className="flex-1 bg-primavera-gold text-white px-2 py-1 rounded text-sm font-bold hover:brightness-105"
                                        >
                                            Cotizar
                                        </button>
                                        <button
                                            onClick={() => handleEditLead(lead)}
                                            className="px-3 py-1 border rounded text-sm hover:bg-white"
                                            title="Modificar Nombre"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLead(lead.id)}
                                            className="px-3 py-1 border border-red-200 text-red-500 rounded text-sm hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
};

export default QuoteWizard;
