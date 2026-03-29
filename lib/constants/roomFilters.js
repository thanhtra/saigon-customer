/* =====================================================
 * ROOM / LAND FILTER CONSTANTS (JS)
 * ===================================================== */

/* ===================== RENTAL TYPE ===================== */

export const PriceLevelLabels = {
    a: '< 3',
    b: '3 - 4',
    c: '4 - 5',
    d: '5 - 6',
    e: '6 - 7',
    f: '7 - 8',
    g: '8 - 9',
    h: '9 - 10',
    i: '10 - 15',
    j: '15 - 20',
    k: '20 - 25',
    l: '25 - 35',
    m: '35 - 50',
    n: '> 50',
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
