import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup';

import {
    getDistrictOptions,
    getProvinceOptions,
    getWardOptions,
} from 'lib/locations/location.utils';

import {
    POPUP_FILTER_HIDE,
} from 'lib/store/type/common-type';

import {
    AcreageLevelOptions,
    INIT_LAND_FILTER,
    isSameLandFilter,
    PriceLevelOptions,
} from 'lib/constants/landFilters';

import { LandTypeOptions, LegalStatusOptions, FurnitureStatusOptions, HouseDirectionOptions, LandAmenityOptions } from 'lib/constants/data';

import { DEFAULT_PROVINCE_ID } from 'lib/locations/const';

const RESET_FILTER_WITH_DEFAULT_PROVINCE = {
    ...INIT_LAND_FILTER,
    province: String(DEFAULT_PROVINCE_ID)
};


const LandFilter = ({ searchLands, query }) => {
    const dispatch = useDispatch();

    const isPopupFilterOpen = useSelector(
        state => state.commons.isPopupFilterOpen
    );

    const [filters, setFilters] = useState(INIT_LAND_FILTER);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);


    useEffect(() => {
        const initProvince = async () => {
            const provinceOptions = await getProvinceOptions();
            setProvinces(provinceOptions);

            const provinceId = String(DEFAULT_PROVINCE_ID);

            setFilters(prev => ({
                ...prev,
                province: prev.province || provinceId,
            }));

            const districts = await getDistrictOptions(provinceId);
            setDistricts(districts);
        };

        initProvince();
    }, []);

    useEffect(() => {
        const applyQuery = async () => {
            if (!query) return;

            const provinceId = String(query?.province || DEFAULT_PROVINCE_ID);

            const next = {
                ...INIT_LAND_FILTER,
                ...query,
                province: provinceId,
            };

            setFilters(prev => (isSameLandFilter(prev, next) ? prev : next));

            const ds = await getDistrictOptions(provinceId);
            setDistricts(ds);

            if (query?.district) {
                const ws = await getWardOptions(provinceId, query.district);
                setWards(ws);
            } else {
                setWards([]);
            }
        };

        applyQuery();
    }, [query]);

    useEffect(() => {
        const initDefaultWhenOpenPopup = async () => {
            if (!isPopupFilterOpen) return;

            if (!provinces.length) {
                const provinceOptions = await getProvinceOptions();
                setProvinces(provinceOptions);
            }

            const provinceId = filters.province || String(DEFAULT_PROVINCE_ID);

            if (!filters.province) {
                setFilters(prev => ({
                    ...prev,
                    province: provinceId,
                    district: '',
                    ward: '',
                }));
            }

            if (!districts.length) {
                const ds = await getDistrictOptions(provinceId);
                setDistricts(ds);
            }
        };

        initDefaultWhenOpenPopup();
    }, [isPopupFilterOpen]);

    const toggleMultiValue = useCallback((key, value) => {
        setFilters(prev => {
            const current = prev[key].split(',').filter(Boolean);
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

            return { ...prev, [key]: next.join(',') };
        });
    }, []);

    const selectSingleValue = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key] === value ? '' : value,
        }));
    }, []);

    const selectDistrict = async e => {
        const districtId = e.target.value;
        const provinceId = String(filters.province || DEFAULT_PROVINCE_ID);

        setFilters(prev => ({
            ...prev,
            district: districtId,
            ward: '',
        }));

        const ws = districtId
            ? await getWardOptions(provinceId, districtId)
            : [];

        setWards(ws);
    };


    const selectWard = e => {
        setFilters(prev => ({
            ...prev,
            ward: e.target.value,
        }));
    };

    const resetFilter = async () => {
        const nextFilters = {
            ...RESET_FILTER_WITH_DEFAULT_PROVINCE,
        };

        // set state
        setFilters(nextFilters);

        // reload districts của HCM
        const districts = await getDistrictOptions(DEFAULT_PROVINCE_ID);
        setDistricts(districts);
        setWards([]);

        // 🔥 GỌI API NGAY
        searchLands(nextFilters);
    };

    const applyFilter = () => {
        searchLands(filters);
        dispatch({ type: POPUP_FILTER_HIDE });
    };


    return (<>
        <div className="filter-desktop">

            <div className="filter-desktop-header">
                <button
                    className="btn-reset-desktop"
                    onClick={resetFilter}
                >
                    Xóa lọc
                </button>

                <button
                    className="btn-apply-desktop"
                    onClick={applyFilter}
                >
                    Áp dụng lọc
                </button>
            </div>

            <div className="filter-desktop-body">
                <div className="filter-block">
                    <p className="filter-title">Tìm kiếm</p>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Nhập từ khóa..."
                        value={filters.key_search || ''}
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                key_search: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="filter-block">
                    <p className="filter-title">Khu vực</p>

                    <select
                        value={filters.province}
                        disabled
                        className="filter-select"
                    >
                        <option key={"999"} value="">Tỉnh / Thành</option>
                        {provinces.map(p => (
                            <option key={`province-${p.value}`} value={String(p.value)}>
                                {p.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.district}
                        onChange={selectDistrict}
                        disabled={!filters.province}
                        className="filter-select"
                    >
                        <option value="">Quận / Huyện</option>
                        {districts.map(d => (
                            <option key={`district-${d.value}`} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.ward}
                        onChange={selectWard}
                        disabled={!filters.district}
                        className="filter-select"
                    >
                        <option value="">Phường / Xã</option>
                        {wards.map(w => (
                            <option key={w.id} value={w.id}>
                                {w.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Loại nhà</p>
                    <div className="filter-list">
                        {LandTypeOptions.map(item => {
                            const active = filters.land_type
                                .split(',')
                                .includes(item.value);

                            return (
                                <div
                                    key={item.value}
                                    className={`filter-item ${active ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('land_type', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Mức giá (tỷ)</p>
                    <div className="filter-list">
                        {PriceLevelOptions.map(p => (
                            <div
                                key={p.value}
                                className={`filter-item ${filters.price_level === p.value ? 'active' : ''
                                    }`}
                                onClick={() =>
                                    selectSingleValue('price_level', p.value)
                                }
                            >
                                {p.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Diện tích (m²)</p>
                    <div className="filter-list">
                        {AcreageLevelOptions.map(a => (
                            <div
                                key={a.value}
                                className={`filter-item ${filters.acreage_level === a.value ? 'active' : ''
                                    }`}
                                onClick={() =>
                                    selectSingleValue('acreage_level', a.value)
                                }
                            >
                                {a.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Phòng</p>

                    <div className="filter-row">
                        <select
                            className="filter-select"
                            value={filters.bedrooms}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, bedrooms: e.target.value }))
                            }
                        >
                            <option value="">Phòng ngủ</option>
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                <option key={n} value={n}>{`${n} PN`}</option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={filters.toilets}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, toilets: e.target.value }))
                            }
                        >
                            <option value="">Phòng WC</option>
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                <option key={n} value={n}>{`${n} WC`}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Pháp lý</p>
                    <div className="filter-list">
                        {LegalStatusOptions.map(item => (
                            <div
                                key={item.value}
                                className={`filter-item ${filters.legal_status === item.value ? 'active' : ''
                                    }`}
                                onClick={() =>
                                    selectSingleValue('legal_status', item.value)
                                }
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Tiện ích</p>
                    <div className="filter-list">
                        {LandAmenityOptions.map(item => {
                            const active = filters.amenities
                                .split(',')
                                .includes(item.value);

                            return (
                                <div
                                    key={item.value}
                                    className={`filter-item ${active ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('amenities', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Nội thất</p>
                    <div className="filter-list">
                        {FurnitureStatusOptions.map(item => (
                            <div
                                key={item.value}
                                className={`filter-item ${filters.furniture_status === item.value ? 'active' : ''
                                    }`}
                                onClick={() =>
                                    selectSingleValue('furniture_status', item.value)
                                }
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Hướng nhà</p>
                    <div className="filter-list">
                        {HouseDirectionOptions.map(item => {
                            const active = filters.house_direction
                                .split(',')
                                .includes(item.value);

                            return (
                                <div
                                    key={item.value}
                                    className={`filter-item ${active ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('house_direction', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>

        <Popup
            open={isPopupFilterOpen}
            onClose={() => dispatch({ type: POPUP_FILTER_HIDE })}
            className="popup-filter-lands"
        >
            <div className="filter-mobile">
                <div className="filter-header">
                    <span>Bộ lọc</span>
                    <i
                        className="icon-cancel"
                        onClick={() => dispatch({ type: POPUP_FILTER_HIDE })}
                    />
                </div>

                <div className="filter-body">

                    <div className="filter-card">
                        <input
                            type="text"
                            className="filter-search-input"
                            placeholder="Nhập từ khóa (đường, khu vực...)"
                            value={filters.key_search || ''}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, key_search: e.target.value }))
                            }
                        />
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">📍 Khu vực</p>

                        <div className="filter-select-wrap has-value">
                            <select value={filters.province} disabled className="filter-select">
                                {provinces.map(p => (
                                    <option key={`province-${p.value}`} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-select-wrap">
                            <select
                                value={filters.district}
                                onChange={selectDistrict}
                                className="filter-select"
                            >
                                <option value="">Chọn quận / huyện</option>
                                {districts.map(d => (
                                    <option key={`district-${d.value}`} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-select-wrap">
                            <select
                                value={filters.ward}
                                onChange={selectWard}
                                disabled={!filters.district}
                                className="filter-select"
                            >
                                <option value="">Chọn phường / xã</option>
                                {wards.map(w => (
                                    <option key={w.value} value={w.value}>
                                        {w.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">🏠 Loại nhà</p>
                        <div className="filter-pill-group">
                            {LandTypeOptions.map(item => {
                                const isActive = filters.land_type
                                    .split(',')
                                    .includes(item.value);

                                return (
                                    <div
                                        key={item.value}
                                        className={`pill ${isActive ? 'active' : ''}`}
                                        onClick={() =>
                                            toggleMultiValue('land_type', item.value)
                                        }
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">💰 Mức giá (tỷ)</p>
                        <div className="filter-pill-group grid-3">
                            {PriceLevelOptions.map(p => (
                                <div
                                    key={p.value}
                                    className={`pill ${filters.price_level === p.value ? 'active' : ''}`}
                                    onClick={() =>
                                        selectSingleValue('price_level', p.value)
                                    }
                                >
                                    {p.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">📐 Diện tích (m²)</p>

                        <div className="filter-pill-group grid-2">
                            {AcreageLevelOptions.map(a => (
                                <div
                                    key={a.value}
                                    className={`pill ${filters.acreage_level === a.value ? 'active' : ''}`}
                                    onClick={() => selectSingleValue('acreage_level', a.value)}
                                >
                                    {a.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">🚪 Phòng</p>

                        <div className="filter-row">
                            <select
                                className="filter-select"
                                value={filters.bedrooms}
                                onChange={e =>
                                    setFilters(prev => ({ ...prev, bedrooms: e.target.value }))
                                }
                            >
                                <option value="">Phòng ngủ</option>
                                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                    <option key={n} value={n}>{`${n} PN`}</option>
                                ))}
                            </select>

                            <select
                                className="filter-select"
                                value={filters.toilets}
                                onChange={e =>
                                    setFilters(prev => ({ ...prev, toilets: e.target.value }))
                                }
                            >
                                <option value="">Phòng WC</option>
                                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                    <option key={n} value={n}>{`${n} WC`}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">📄 Pháp lý</p>
                        <div className="filter-pill-group grid-2">
                            {LegalStatusOptions.map(item => (
                                <div
                                    key={item.value}
                                    className={`pill ${filters.legal_status === item.value ? 'active' : ''}`}
                                    onClick={() =>
                                        selectSingleValue('legal_status', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">✨ Tiện ích</p>
                        <div className="filter-pill-group grid-2">
                            {LandAmenityOptions.map(item => {
                                const active = filters.amenities
                                    .split(',')
                                    .includes(item.value);

                                return (
                                    <div
                                        key={item.value}
                                        className={`pill ${active ? 'active' : ''}`}
                                        onClick={() =>
                                            toggleMultiValue('amenities', item.value)
                                        }
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">🛋️ Nội thất</p>
                        <div className="filter-pill-group grid-2">
                            {FurnitureStatusOptions.map(item => (
                                <div
                                    key={item.value}
                                    className={`pill ${filters.furniture_status === item.value ? 'active' : ''}`}
                                    onClick={() =>
                                        selectSingleValue('furniture_status', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-card">
                        <p className="filter-card-title">🧭 Hướng nhà</p>
                        <div className="filter-pill-group grid-3">
                            {HouseDirectionOptions.map(item => {
                                const active = filters.house_direction
                                    .split(',')
                                    .includes(item.value);

                                return (
                                    <div
                                        key={item.value}
                                        className={`pill ${active ? 'active' : ''}`}
                                        onClick={() =>
                                            toggleMultiValue('house_direction', item.value)
                                        }
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                <div className="filter-footer">
                    <button className="btn-reset" onClick={resetFilter}>
                        Xóa lọc
                    </button>
                    <button className="btn-apply" onClick={applyFilter}>
                        Áp dụng
                    </button>
                </div>

            </div>
        </Popup>



    </>
    );
};

export default LandFilter;