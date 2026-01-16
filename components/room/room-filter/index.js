import { useCallback, useEffect, useMemo, useState } from 'react';
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';

import {
    getProvinceOptions,
    getDistrictOptions,
    getWardOptions,
} from 'lib/locations/location.utils';

import {
    COMMON_POPUP_FILTER_HIDE,
} from 'lib/store/type/common-type';

import {
    INIT_ROOM_FILTER,
    PriceLevelOptions,
    AcreageLevelOptions,
    isSameRoomFilter,
} from 'lib/constants/roomFilters';

import { RentalTypeOptions } from 'lib/constants/data';

import { DEFAULT_PROVINCE_ID } from 'lib/locations/const';
import { RentalAmenityOptions } from 'lib/constants/data';

const RESET_FILTER_WITH_DEFAULT_PROVINCE = {
    ...INIT_ROOM_FILTER,
    province: DEFAULT_PROVINCE_ID,
};


/* ===================== COMPONENT ===================== */

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

            // nếu chưa có province từ query
            if (!filters.province) {
                setFilters(prev => ({
                    ...prev,
                    province: DEFAULT_PROVINCE_ID,
                }));

                const districts = await getDistrictOptions(DEFAULT_PROVINCE_ID);
                setDistricts(districts);
            }
        };

        initProvince();
    }, []);


    /* ===================== SYNC QUERY → STATE ===================== */

    useEffect(() => {
        if (!query) return;

        const next = {
            ...INIT_ROOM_FILTER,
            ...query,
            province: query?.province || DEFAULT_PROVINCE_ID,
        };


        setFilters(prev =>
            isSameRoomFilter(prev, next) ? prev : next
        );
    }, [query]);

    /* ===================== HANDLERS ===================== */

    // multi select (rental_type)
    const toggleMultiValue = useCallback((key, value) => {
        setFilters(prev => {
            const current = prev[key].split(',').filter(Boolean);
            const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

            return { ...prev, [key]: next.join(',') };
        });
    }, []);

    // single select (price, acreage)
    const selectSingleValue = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key] === value ? '' : value,
        }));
    }, []);

    const selectProvince = async e => {
        const value = e.target.value;

        setFilters(prev => ({
            ...prev,
            province: value,
            district: '',
            ward: '',
        }));

        setWards([]);
        setDistricts(value ? await getDistrictOptions(value) : []);
    };

    const selectDistrict = async e => {
        const value = e.target.value;

        setFilters(prev => ({
            ...prev,
            district: value,
            ward: '',
        }));

        setWards(
            value ? await getWardOptions(filters.province, value) : []
        );
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
        dispatch({ type: COMMON_POPUP_FILTER_HIDE });
    };


    return (<>
        <div className="filter-desktop">

            {/* ===== HEADER ===== */}
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


            {/* ===== KEYWORD ===== */}
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

            {/* ===== LOCATION ===== */}
            <div className="filter-block">
                <p className="filter-title">Khu vực</p>

                <select
                    value={filters.province}
                    disabled
                    className="filter-select"
                >
                    <option value="">Tỉnh / Thành</option>
                    {provinces.map(p => (
                        <option key={p.id} value={p.id}>
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
                        <option key={d.id} value={d.id}>
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

            {/* ===== RENTAL TYPE ===== */}
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

            {/* ===== PRICE ===== */}
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

            {/* ===== AMENITIES ===== */}
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


            {/* ===== ACREAGE ===== */}
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

        <Popup
            open={isPopupFilterOpen}
            onClose={() => dispatch({ type: COMMON_POPUP_FILTER_HIDE })}
            className="popup-filter-rooms"
        >
            <div className="filter-mobile">
                <div className="filter-content">
                    {/* ===== ACTION ===== */}
                    <div className="filter-actions-row">
                        <input
                            type="text"
                            className="filter-search-input"
                            placeholder="Nhập từ khóa..."
                            value={filters.keyword || ''}
                            onChange={e =>
                                setFilters(prev => ({
                                    ...prev,
                                    keyword: e.target.value,
                                }))
                            }
                        />

                        <button
                            className="btn-filter btn-reset"
                            onClick={resetFilter}
                        >
                            Xóa lọc
                        </button>

                        <button
                            className="btn-filter btn-apply"
                            onClick={applyFilter}
                        >
                            Áp dụng
                        </button>
                    </div>


                    {/* ===== LOCATION ===== */}
                    <p className='filter-title'>Khu vực</p>
                    <div className="filter-list">
                        <div className={`filter-select-wrap ${filters.province ? 'has-value' : ''}`}>
                            <select
                                value={filters.province}
                                onChange={selectProvince}
                                className="filter-select"
                                disabled={true}
                            >
                                <option value="">Tỉnh / Thành</option>
                                {provinces.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                            <i className="icon-down-open" />
                        </div>

                        <div className={`filter-select-wrap ${filters.district ? 'has-value' : ''}`}>
                            <select
                                value={filters.district}
                                onChange={selectDistrict}
                                disabled={!filters.province}
                                className="filter-select"
                            >
                                <option value="">Quận / Huyện</option>
                                {districts.map(d => (
                                    <option key={d.id} value={d.id}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                            <i className="icon-down-open" />
                        </div>

                        <div className={`filter-select-wrap ${filters.ward ? 'has-value' : ''}`}>
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
                            <i className="icon-down-open" />
                        </div>
                    </div>



                    {/* ===== RENTAL TYPE (MULTI) ===== */}
                    <p className='filter-title'>Loại nhà</p>
                    <div className="filter-list filter-list-2col">
                        {RentalTypeOptions.map(item => {
                            const isActive = filters.rental_type
                                .split(',')
                                .includes(item.value);

                            return (
                                <div
                                    key={item.value}
                                    className={`filter-item ${isActive ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('rental_type', item.value)
                                    }
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>

                    {/* ===== PRICE (SINGLE) ===== */}
                    <p className='filter-title'>Mức giá (triệu)</p>
                    <div className="filter-list filter-list-3col">
                        {PriceLevelOptions.map(p => {
                            const isActive = filters.price_level === p.value;

                            return (
                                <div
                                    key={p.value}
                                    className={`filter-item ${isActive ? 'active' : ''}`}
                                    onClick={() =>
                                        selectSingleValue('price_level', p.value)
                                    }
                                >
                                    {p.label}
                                </div>
                            );
                        })}
                    </div>

                    {/* ===== AMENITIES (MULTI) ===== */}
                    <p className="filter-title">Tiện ích</p>
                    <div className="filter-list filter-list-2col">
                        {Object.entries(RentalAmenityOptions).map(([value, label]) => {
                            const isActive = filters.amenities
                                .split(',')
                                .includes(value);

                            return (
                                <div
                                    key={value}
                                    className={`filter-item ${isActive ? 'active' : ''}`}
                                    onClick={() =>
                                        toggleMultiValue('amenities', value)
                                    }
                                >
                                    {label}
                                </div>
                            );
                        })}
                    </div>


                    {/* ===== ACREAGE (SINGLE) ===== */}
                    <p className='filter-title'>Diện tích (m²)</p>
                    <div className="filter-list filter-list-2col">
                        {AcreageLevelOptions.map(a => {
                            const isActive =
                                filters.acreage_level === a.value;

                            return (
                                <div
                                    key={a.value}
                                    className={`filter-item ${isActive ? 'active' : ''}`}
                                    onClick={() =>
                                        selectSingleValue(
                                            'acreage_level',
                                            a.value
                                        )
                                    }
                                >
                                    {a.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Popup>
    </>
    );
};

export default RoomFilter;
