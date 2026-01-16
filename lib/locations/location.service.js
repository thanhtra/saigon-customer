
let cachedLocations = null;

export const getLocationsCached = async () => {
    if (!cachedLocations) {
        const res = await fetch('/locations/location.json');
        cachedLocations = await res.json();
    }
    return cachedLocations;
};
