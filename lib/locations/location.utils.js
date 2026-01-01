import { getLocationsCached } from './location.service';

/* ===== PROVINCES ===== */
export const getProvinceOptions = async () => {
    const locations = await getLocationsCached();

    return locations.map(p => ({
        id: String(p.Id),
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
        id: String(d.Id),
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

    return district.Wards.map(w => ({
        id: String(w.Id),
        label: w.Name,
    }));
};
