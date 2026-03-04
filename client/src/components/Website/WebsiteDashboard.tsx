import React, { useState } from 'react';
import { websiteUrls, type WebsiteCategory, type WebsiteLink } from '../../data/websiteUrls';

const WebsiteDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedLink, setCopiedLink] = useState<string | null>(null);

    // Filter logic
    const filteredCategories = websiteUrls.map(category => ({
        ...category,
        links: category.links.filter(link =>
            link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            link.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.links.length > 0);

    const handleCopyLink = async (url: string, title: string, category: string) => {
        let mensajePrefijo = "Conoce";
        let nombreLimpio = title;

        if (category.includes("BANQUETES")) {
            mensajePrefijo = title.toLowerCase().includes("menú") || title.toLowerCase().includes("postres")
                ? "Prueba "
                : "Conoce el servicio de ";
            nombreLimpio = title.toLowerCase().includes("nuestros") ? title.replace("Nuestros ", "los ").replace("Nuestras ", "las ") : title;
        } else if (category.includes("VENUES")) {
            mensajePrefijo = "Celebra tu evento en ";
        } else if (category.includes("PAQUETES")) {
            mensajePrefijo = "Descubre lo que incluye el ";
        } else if (category.includes("PERSONALES")) {
            mensajePrefijo = "Conoce el trabajo de ";
        }

        const textoCompartir = `¡Hola! ${mensajePrefijo} ${nombreLimpio} de Primavera Events Group aquí:`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: textoCompartir,
                    url: url
                });
                return; // Exito
            } catch (err) {
                console.log("No se pudo usar navigator.share o cancelado:", err);
            }
        }

        const mensajeCopiar = `${textoCompartir}\n${url}`;
        navigator.clipboard.writeText(mensajeCopiar).then(() => {
            setCopiedLink(url);
            setTimeout(() => setCopiedLink(null), 2000);
        }).catch(err => {
            console.error("Failed to copy", err);
            prompt("Copia el siguiente texto:", mensajeCopiar);
        });
    };

    const handleOpenLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-black font-sans overflow-hidden">
            {/* HEADER */}
            <div className="bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-white/10 px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-sm z-10 transition-colors duration-300">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="text-4xl">🌐</span> Panel del Sitio Web
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Navega, abre y comparte rápidamente cualquier página oficial de Primavera Events.
                    </p>
                </div>

                {/* Search Bar and Link */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={() => window.open('https://5410m0n0c001.github.io/banquetes-primavera-project/', '_blank')}
                        className="divi-btn-share text-sm px-6 py-2.5 whitespace-nowrap"
                    >
                        Dashboard digital integral
                    </button>

                    <div className="w-full md:w-80 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">🔍</span>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primavera-gold focus:border-primavera-gold sm:text-sm transition-colors duration-300 shadow-sm"
                            placeholder="Buscar por nombre o URL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-auto custom-scrollbar p-6 md:p-8 space-y-10">
                {filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in-up">
                        <span className="text-6xl mb-4 opacity-50">🧭</span>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No se encontraron enlaces</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta intentar con otros términos de búsqueda.</p>
                    </div>
                ) : (
                    filteredCategories.map((category, idx) => (
                        <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
                                <span className="text-2xl">{category.icon}</span>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight uppercase">
                                    {category.category.replace(/🏠|💍|🍽|🏛|📦|👤|⚖️|⚙️/g, '').trim()}
                                </h2>
                                <span className="ml-auto bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                                    {category.links.length}
                                </span>
                            </div>

                            {/* URL Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {category.links.map((link, lIdx) => (
                                    <div
                                        key={lIdx}
                                        className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 hover:border-primavera-gold/50 transition-all duration-300 flex flex-col overflow-hidden group"
                                    >
                                        {/* Card Content */}
                                        <div className="p-5 flex-1 flex flex-col justify-center">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primavera-gold transition-colors line-clamp-2">
                                                {link.title}
                                            </h3>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors truncate"
                                                title={link.url}
                                            >
                                                {link.url.replace('https://primaveraeventsgroup.com', '')}
                                            </a>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="p-5 pt-0 mt-auto flex flex-col gap-3">
                                            <button
                                                onClick={() => handleCopyLink(link.url, link.title, category.category)}
                                                className="divi-btn-share w-full text-center flex items-center justify-center gap-2"
                                            >
                                                {copiedLink === link.url ? '✔️ Copiado' : 'Compartir'}
                                            </button>
                                            <button
                                                onClick={() => handleOpenLink(link.url)}
                                                className="py-2 text-sm font-bold flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                            >
                                                <span>Ir al sitio</span> ↗
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WebsiteDashboard;
