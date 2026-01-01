export const normalizeRoomQuery = (query = {}) => ({
    /* ================= PAGINATION ================= */
    page: Math.max(Number(query.page) || 1, 1),
    size: Math.min(Number(query.size) || 10, 50),

    /* ================= LOCATION ================= */
    province: query.province || undefined,
    district: query.district || undefined,
    ward: query.ward || undefined,

    /* ================= FILTER ================= */
    rental_type: query.rental_type || undefined, // CSV string
    price_level: query.price_level || undefined, // a,b,c,d,e
    acreage_level: query.acreage_level || undefined, // a,b,c...

    amenities: query.amenities
        ? query.amenities.split(',').filter(Boolean)
        : undefined,

    keyword: query.keyword || undefined,

    /* ================= DEFAULT ================= */
    active: query.active !== 'false',
});
