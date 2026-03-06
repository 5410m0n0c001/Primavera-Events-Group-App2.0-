import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

// Pricing reference provided by the user (hardcoded per requirements)
const pricingReference: Record<string, { min: number, max: number, maxGuests: number, url?: string }> = {
    gobernador: { min: 749, max: 899, maxGuests: 500, url: 'https://primaveraeventsgroup.com/paquete-gobernador/' },
    presidencial: { min: 749, max: 849, maxGuests: 500, url: 'https://primaveraeventsgroup.com/paquete-presidente/' },
    yolomecatl: { min: 749, max: 899, maxGuests: 400, url: 'https://primaveraeventsgroup.com/paquete-destino-yolomecatl/' },
    esenciaFloral: { min: 899, max: 999, maxGuests: 200, url: 'https://primaveraeventsgroup.com/paquete-esencia-floral/' },
    imperialEcuestre: { min: 699, max: 749, maxGuests: 300, url: 'https://primaveraeventsgroup.com/paquete-imperial-ecuestre/' },
    linajePuraSangre: { min: 749, max: 899, maxGuests: 500, url: 'https://primaveraeventsgroup.com/paquete-linaje-pura-sangre/' },
    armoniaZarabanda: { min: 1450, max: 1700, maxGuests: 250, url: 'https://primaveraeventsgroup.com/paquete-armonia/' },
    vueloEsmeralda: { min: 1999, max: 2199, maxGuests: 250, url: 'https://primaveraeventsgroup.com/paquete-vuelo-esmeralda/' },
    naturesMajesty: { min: 1299, max: 1399, maxGuests: 250 },
};

const simulationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests, please try again later.' }
});

router.post('/', simulationLimiter, (req, res) => {
    try {
        const { eventType, guests, venue } = req.body;

        if (!guests || typeof guests !== 'number' || guests <= 0) {
            return res.status(400).json({ error: 'Valid number of guests is required' });
        }

        // Extremely simple heuristic to pick a package:
        // Match by venue explicitly if provided, otherwise filter by guests capacity
        let suggestedPackageKey = 'gobernador'; // default fallback

        if (venue) {
            const normalizedVenue = venue.toLowerCase();
            if (normalizedVenue.includes('yolomecatl')) suggestedPackageKey = 'yolomecatl';
            else if (normalizedVenue.includes('flor')) suggestedPackageKey = 'esenciaFloral';
            else if (normalizedVenue.includes('potrillos') || normalizedVenue.includes('ecuestre')) suggestedPackageKey = 'imperialEcuestre';
            else if (normalizedVenue.includes('caballos') || normalizedVenue.includes('sangre')) suggestedPackageKey = 'linajePuraSangre';
            else if (normalizedVenue.includes('zarabanda')) suggestedPackageKey = 'armoniaZarabanda';
            else if (normalizedVenue.includes('esmeralda') || normalizedVenue.includes('tsu')) suggestedPackageKey = 'vueloEsmeralda';
            // Default assumes Presidente/Gobernador
        } else {
            // Pick based on guests/type heuristic 
            // Simple logic: if very expensive looking or just random matching
            const availablePackages = Object.entries(pricingReference).filter(([_, data]) => data.maxGuests >= guests);
            if (availablePackages.length > 0) {
                suggestedPackageKey = availablePackages[0][0]; // Grab cheapest valid or just first valid
            }
        }

        // Final sanity check, ensure it actually exists in reference
        const packageData = pricingReference[suggestedPackageKey] || pricingReference['gobernador'];

        // Total Estimate Math
        const minTotal = packageData.min * guests;
        const maxTotal = packageData.max * guests;

        res.json({
            minPrice: minTotal,
            maxPrice: maxTotal,
            suggestedPackage: suggestedPackageKey,
            venueUrl: packageData.url || 'https://primaveraeventsgroup.com/venues/'
        });

    } catch (error) {
        console.error('Error in quote simulation:', error);
        res.status(500).json({ error: 'Failed to calculate quote simulation' });
    }
});

export default router;
