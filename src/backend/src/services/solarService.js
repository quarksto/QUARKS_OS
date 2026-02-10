const axios = require('axios');

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const SOLAR_URL = 'https://solar.googleapis.com/v1/buildingInsights:findClosest';

/**
 * Geocodifica endereço para lat/lng
 */
async function geocodeAddress(address, apiKey) {
    const { data } = await axios.get(GEOCODE_URL, {
        params: { address, key: apiKey }
    });
    if (data.status !== 'OK' || !data.results?.length) return null;
    const loc = data.results[0].geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

/**
 * Obtém insights solares via Google Solar API
 * Retorna { roofArea, yearlyEnergy, recommendedCapacity, savingsAnnual } ou null
 */
async function getSolarInsights(lat, lng, apiKey) {
    const url = `${SOLAR_URL}?location.latitude=${lat}&location.longitude=${lng}&key=${apiKey}`;
    const { data } = await axios.get(url, { timeout: 10000 });

    if (!data?.solarPotential) return null;

    const sp = data.solarPotential;
    const roofArea = sp.maxArrayAreaMeters2
        ? Math.round(sp.maxArrayAreaMeters2)
        : sp.wholeRoofStats?.areaMeters2
            ? Math.round(sp.wholeRoofStats.areaMeters2)
            : null;

    const yearlyEnergy = sp.solarPanelConfigs?.[0]?.yearlyEnergyDcKwh
        ? Math.round(sp.solarPanelConfigs[0].yearlyEnergyDcKwh)
        : sp.maxSunshineHoursPerYear && sp.panelCapacityWatts
            ? Math.round(sp.maxSunshineHoursPerYear * (sp.panelCapacityWatts / 1000))
            : null;

    const recommendedCapacity = sp.panelCapacityWatts && sp.maxArrayPanelsCount
        ? Math.round((sp.panelCapacityWatts * sp.maxArrayPanelsCount) / 1000 * 10) / 10
        : null;

    let savingsAnnual = null;
    const fa = sp.financialAnalyses?.[0];
    if (fa?.cashPurchaseSavings?.savingsOverTime?.savings) {
        const s = fa.cashPurchaseSavings.savingsOverTime.savings;
        const units = parseInt(s.units || 0, 10);
        const nanos = (s.nanos || 0) / 1e9;
        const totalSavings = units + nanos;
        savingsAnnual = totalSavings > 0
            ? Math.round(totalSavings / (sp.panelLifetimeYears || 25))
            : null;
    }

    return {
        roofArea,
        yearlyEnergy,
        recommendedCapacity,
        savingsAnnual
    };
}

/**
 * Fallback: estimativa baseada em consumo médio (regra prática Brasil ~4.5 kWh/kWp/mês)
 */
function estimateFromConsumption(consumptionKwh) {
    if (!consumptionKwh || consumptionKwh <= 0) return null;
    const kwp = Math.ceil((consumptionKwh * 1.2) / 4.5 / 12); // margem 20%, ~4.5 kWh/kWp/mês
    const yearlyEnergy = Math.round(kwp * 4.5 * 12);
    const roofArea = Math.round(kwp * 7); // ~7 m² por kWp
    return {
        roofArea,
        yearlyEnergy,
        recommendedCapacity: Math.max(1, kwp),
        savingsAnnual: null,
        _estimated: true
    };
}

/**
 * Busca insights solares para um lead.
 * Usa Google Solar API quando GOOGLE_MAPS_API_KEY está configurada e Solar API habilitada.
 * Caso contrário, retorna estimativa baseada em consumo (se disponível).
 */
async function getLeadSolarInsights(lead) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey && lead?.location) {
        try {
            const coords = await geocodeAddress(lead.location, apiKey);
            if (coords) {
                const insights = await getSolarInsights(coords.lat, coords.lng, apiKey);
                if (insights) return insights;
            }
        } catch (err) {
            console.warn('[Solar] API error, falling back to estimate:', err.message);
        }
    }

    return estimateFromConsumption(lead?.consumption);
}

module.exports = {
    geocodeAddress,
    getSolarInsights,
    estimateFromConsumption,
    getLeadSolarInsights
};
