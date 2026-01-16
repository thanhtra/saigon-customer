/* =====================================================
 * ROOM / LAND FILTER CONSTANTS (JS)
 * ===================================================== */

/* ===================== RENTAL TYPE ===================== */

export const PriceLevelLabels = {
    a: '< 2',
    b: '2 - 3',
    c: '3 - 5',
    d: '5 - 7',
    e: '7 - 10',
    f: '10 - 15',
    g: '15 - 25',
    h: '> 25'
};

export const PriceLevelOptions = Object.entries(PriceLevelLabels).map(
    ([value, label]) => ({ value, label })
);


export const AcreageLevelLabels = {
    a: '< 20',
    b: '20 - 30',
    c: '30 - 50',
    d: '50 - 70',
    e: '70 - 90',
    f: '90 - 120',
    g: '> 120'
};

export const AcreageLevelOptions = Object.entries(AcreageLevelLabels).map(
    ([value, label]) => ({ value, label })
);

/* ===================== CUSTOMER TYPE ===================== */

export const CustomerType = {
    OWNER: 'owner',
    BROKER: 'broker',
    TENANT: 'tenant',
};

export const CustomerTypeLabels = {
    [CustomerType.OWNER]: 'Chủ nhà',
    [CustomerType.BROKER]: 'Môi giới',
    [CustomerType.TENANT]: 'Người thuê',
};

export const CustomerTypeOptions = Object.entries(CustomerTypeLabels).map(
    ([value, label]) => ({ value, label })
);

/* ===================== LAND STATUS ===================== */

export const LandStatus = {
    NEW: 'new',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
};

export const LandStatusLabels = {
    new: 'Chờ xác nhận',
    pending: 'Cần cập nhật',
    confirmed: 'Đang bán',
};

/* ===================== INIT FILTER ===================== */

export const INIT_ROOM_FILTER = {
    province: '',
    district: '',
    ward: '',
    rental_type: '',    // multi: boarding_house,apartment
    price_level: '',    // single: A
    acreage_level: '',  // single: C
    amenities: '',
    keyword: '',
};


/* ===================== UTILS ===================== */

export const isSameRoomFilter = (a = {}, b = {}) =>
    Object.keys(INIT_ROOM_FILTER).every(
        key => String(a[key] || '') === String(b[key] || '')
    );
