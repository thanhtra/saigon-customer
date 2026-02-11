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
    INIT_ROOM_FILTER,
    isSameRoomFilter,
    PriceLevelOptions,
} from 'lib/constants/roomFilters';

import { RentalTypeOptions } from 'lib/constants/data';

import { RentalAmenityOptions } from 'lib/constants/data';
import { DEFAULT_PROVINCE_ID } from 'lib/locations/const';

const RESET_FILTER_WITH_DEFAULT_PROVINCE = {
    ...INIT_ROOM_FILTER,
    province: String(DEFAULT_PROVINCE_ID)
};


const RoomFilter = ({ searchRooms, query }) => {
    const dispatch = useDispatch();

    const isPopupFilterOpen = useSelector(
        state => state.commons.isPopupFilterOpen
    );

    const [filters, setFilters] = useState(INIT_ROOM_FILTER);
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
                ...INIT_ROOM_FILTER,
                ...query,
                province: provinceId,
            };

            setFilters(prev => (isSameRoomFilter(prev, next) ? prev : next));

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

    const selectProvince = async e => {
        const provinceId = String(e.target.value);

        setFilters(prev => ({
            ...prev,
            province: provinceId,
            district: '',
            ward: '',
        }));

        setWards([]);
        const ds = provinceId ? await getDistrictOptions(provinceId) : [];
        setDistricts(ds);
    };


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
        searchRooms(nextFilters);
    };

    const applyFilter = () => {
        searchRooms(filters);
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
                        value={filters.keyword || ''}
                        onChange={e =>
                            setFilters(prev => ({
                                ...prev,
                                keyword: e.target.value,
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
                        {RentalTypeOptions.map(item => {
                            const active = filters.rental_type
                                .split(',')
                                .includes(item.value);

                            return (
                                <div
                                    key={item.value}
                                    className={`filter-item ${active ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('rental_type', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="filter-block">
                    <p className="filter-title">Mức giá (triệu)</p>
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
                    <p className="filter-title">Tiện ích</p>

                    <div className="filter-list filter-list-2col">
                        {Object.entries(RentalAmenityOptions).map(([value, label]) => {
                            const active = filters.amenities
                                ?.split(',')
                                .includes(value);

                            return (
                                <div
                                    key={value}
                                    className={`filter-item ${active ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('amenities', value)
                                    }
                                >
                                    {label}
                                </div>
                            );
                        })}
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
            </div>
        </div>

        <Popup
            open={isPopupFilterOpen}
            onClose={() => dispatch({ type: POPUP_FILTER_HIDE })}
            className="popup-filter-rooms"
        >
            <div className="filter-mobile">

                {/* ===== HEADER ===== */}
                <div className="filter-header">
                    <span>Bộ lọc</span>
                    <i
                        className="icon-cancel"
                        onClick={() => dispatch({ type: POPUP_FILTER_HIDE })}
                    />
                </div>

                {/* ===== CONTENT ===== */}
                <div className="filter-body">

                    {/* SEARCH */}
                    <div className="filter-card">
                        <input
                            type="text"
                            className="filter-search-input"
                            placeholder="Nhập từ khóa (đường, khu vực...)"
                            value={filters.keyword || ''}
                            onChange={e =>
                                setFilters(prev => ({ ...prev, keyword: e.target.value }))
                            }
                        />
                    </div>

                    {/* LOCATION */}
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

                    {/* RENTAL TYPE */}
                    <div className="filter-card">
                        <p className="filter-card-title">🏠 Loại nhà</p>
                        <div className="filter-pill-group">
                            {RentalTypeOptions.map(item => {
                                const isActive = filters.rental_type
                                    .split(',')
                                    .includes(item.value);

                                return (
                                    <div
                                        key={item.value}
                                        className={`pill ${isActive ? 'active' : ''}`}
                                        onClick={() =>
                                            toggleMultiValue('rental_type', item.value)
                                        }
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PRICE */}
                    <div className="filter-card">
                        <p className="filter-card-title">💰 Mức giá (triệu)</p>
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

                    {/* AMENITIES */}
                    <div className="filter-card">
                        <p className="filter-card-title">✨ Tiện ích</p>

                        <div className="amenities-grid">
                            {Object.entries(RentalAmenityOptions).map(([value, label]) => {
                                const isActive = (filters.amenities || '')
                                    .split(',')
                                    .filter(Boolean)
                                    .includes(value);

                                return (
                                    <div
                                        key={value}
                                        className={`amenity-item ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleMultiValue('amenities', value)}
                                    >
                                        <span className="amenity-check">
                                            <i className="icon-check" />
                                        </span>

                                        <span className="amenity-label">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ACREAGE */}
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

                </div>

                {/* ===== FOOTER ===== */}
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

export default RoomFilter;