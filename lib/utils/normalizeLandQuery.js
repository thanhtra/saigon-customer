export const normalizeLandQuery = (query = {}) => ({
    /* ================= PAGINATION ================= */
    page: Math.max(Number(query.page) || 1, 1),
    size: Math.min(Number(query.size) || 10, 50),

    /* ================= LOCATION ================= */
    province: query.province || undefined,
    district: query.district || undefined,
    ward: query.ward || undefined,

    /* ================= FILTER ================= */
    land_type: query.land_type || undefined, // CSV string
    price_level: query.price_level || undefined, // a,b,c,d,e
    acreage_level: query.acreage_level || undefined, // a,b,c...

    key_search: query.keyword || undefined,

    /* ================= DEFAULT ================= */
    active: query.active !== 'false',
});
