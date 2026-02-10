export const normalizeLandQuery = (query = {}) => ({
    /* ================= PAGINATION ================= */
    page: Math.max(Number(query.page) || 1, 1),
    size: Math.min(Number(query.size) || 10, 50),

    /* ================= LOCATION ================= */
    province: query.province || undefined,
    district: query.district || undefined,
    ward: query.ward || undefined,

    /* ================= BASIC FILTER ================= */
    land_type: query.land_type || undefined,          // CSV
    price_level: query.price_level || undefined,      // a,b,c
    acreage_level: query.acreage_level || undefined,  // a,b,c

    /* ================= NEW FILTER ================= */

    // số phòng
    bedrooms:
        query.bedrooms !== undefined && query.bedrooms !== ''
            ? Number(query.bedrooms)
            : undefined,

    toilets:
        query.toilets !== undefined && query.toilets !== ''
            ? Number(query.toilets)
            : undefined,

    // tiện ích (multi)
    amenities: query.amenities || undefined,          // CSV

    // enum đơn
    legal_status: query.legal_status || undefined,
    furniture_status: query.furniture_status || undefined,
    house_direction: query.house_direction || undefined,

    /* ================= SEARCH ================= */
    key_search: query.key_search || undefined,

    /* ================= DEFAULT ================= */
    active: query.active !== 'false',
});
