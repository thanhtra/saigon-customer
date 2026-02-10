export const PriceLevelLabels = {
    a: '< 3',
    b: '3 - 6',
    c: '6 - 10',
    d: '10 - 20',
    e: '20 - 50',
    f: '> 50'
};

export const PriceLevelOptions = Object.entries(PriceLevelLabels).map(
    ([value, label]) => ({ value, label })
);

export const AcreageLevelLabels = {
    a: '< 30',
    b: '30 - 50',
    c: '50 - 80',
    d: '80 - 100',
    e: '100 - 150',
    f: '150 - 200',
    g: '200 - 250',
    h: '250 - 300',
    i: '300 - 500',
    j: '> 500'
};

export const AcreageLevelOptions = Object.entries(AcreageLevelLabels).map(
    ([value, label]) => ({ value, label })
);

export const INIT_LAND_FILTER = {
    province: '',
    district: '',
    ward: '',
    land_type: '',
    price_level: '',
    acreage_level: '',
    key_search: '',

    bedrooms: '',
    toilets: '',
    legal_status: '',
    furniture_status: '',
    house_direction: '',
    amenities: '',
};

export const isSameLandFilter = (a = {}, b = {}) =>
    Object.keys(INIT_LAND_FILTER).every(
        key => String(a[key] || '') === String(b[key] || '')
    );
