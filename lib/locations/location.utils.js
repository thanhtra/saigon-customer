import { getLocationsCached } from './location.service';

let LOCATIONS_CACHE = null;

export const getLocationsSync = async () => {
    if (!LOCATIONS_CACHE) {
        LOCATIONS_CACHE = await getLocationsCached();
    }
    return LOCATIONS_CACHE;
};

/* ===== PROVINCES ===== */
export const getProvinceOptions = async () => {
    const locations = await getLocationsCached();

    return locations.map(p => ({
        value: String(p.Id),   // ✅ BẮT BUỘC
        label: p.Name,
    }));
};

/* ===== DISTRICTS ===== */
export const getDistrictOptions = async (provinceId) => {
    const locations = await getLocationsCached();

    const province = locations.find(
        p => String(p.Id) === String(provinceId)
    );
    if (!province) return [];

    return province.Districts.map(d => ({
        value: String(d.Id),   // ✅
        label: d.Name,
    }));
};

/* ===== WARDS ===== */
export const getWardOptions = async (provinceId, districtId) => {
    const locations = await getLocationsCached();

    const province = locations.find(
        p => String(p.Id) === String(provinceId)
    );
    if (!province) return [];

    const district = province.Districts.find(
        d => String(d.Id) === String(districtId)
    );
    if (!district) return [];

    const res = district.Wards.map(w => ({
        value: String(w.Id),
        label: w.Name,
    }));

    return res;
};

/* ===== BUILD ADDRESS ===== */
export const buildAddressDetail = ({
    provinceId,
    districtId,
    wardId,
    street,
    houseNumber,
}) => {
    if (!provinceId || !LOCATIONS_CACHE) return '';

    const province = LOCATIONS_CACHE.find(
        p => String(p.Id) === String(provinceId)
    );
    if (!province) return '';

    const district = districtId
        ? province.Districts?.find(
            d => String(d.Id) === String(districtId)
        )
        : null;

    const ward = wardId && district
        ? district.Wards?.find(
            w => String(w.Id) === String(wardId)
        )
        : null;

    const parts = [
        houseNumber,
        street,
        ward?.Name,
        district?.Name,
        province?.Name,
    ].filter(Boolean);

    return parts.join(', ');
};
