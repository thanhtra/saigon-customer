import { useEffect, useState } from 'react'
import Checkbox from 'components/common/checkbox';
import { CategoryType } from 'lib/constants/data';
import { getDistrictOption, getWardsOption } from 'lib/utils';
import { AdministrativeUnits } from 'lib/constants/administrativeUnits';
import { getOptionFromObject } from 'lib/utils';
import Popup from 'reactjs-popup';
import { AcreageLevel, PriceLevel } from 'lib/constants/data';
import { POPUP_FILTER_OPEN, POPUP_FILTER_HIDE } from 'lib/store/type/common-type';
import { useSelector, useDispatch } from 'react-redux';

const initData = {
    district: '',
    ward: '',
    categoryId: '',
    priceLevel: '',
    acreageLevel: '',
}

const LandFilter = ({ searchLands, query }) => {
    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [activeAddress, setActiveAddress] = useState(false);
    const [activeCategory, setActiveCategory] = useState(false);
    const [activePrice, setActivePrice] = useState(false);
    const [activeAcreage, setActiveAcreage] = useState(false);
    const dispatch = useDispatch();
    const [wards, setWards] = useState([]);
    const [modelSearch, setModelSearch] = useState(initData);

    const [firstRender, setFirstRender] = useState(true);

    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);
    const [priceLevelChoosed, setPriceLevelChoosed] = useState([]);
    const [acreageLevelChoosed, setAcreageLevelChoosed] = useState([]);

    const listAcreage = getOptionFromObject(AcreageLevel);
    const listPriceLevel = getOptionFromObject(PriceLevel);


    useEffect(() => {
        getCategoriesHandle();
    }, []);

    useEffect(() => {
        if (!firstRender) {
            searchLands(modelSearch);
        }

        setFirstRender(false);
    }, [JSON.stringify(modelSearch)]);

    useEffect(() => {
        if (activeAddress || activeCategory || activePrice || activeAcreage) {
            dispatch({ type: POPUP_FILTER_OPEN });
        } else {
            dispatch({ type: POPUP_FILTER_HIDE });
        }
    }, [activeAddress, activeCategory, activePrice, activeAcreage]);


    useEffect(() => {
        const { district = '', ward = '', categoryId = '', priceLevel = '', acreageLevel = '' } = query;
        if (district?.length || ward?.length || categoryId?.length || priceLevel?.length || acreageLevel?.length) {
            const cateIds = categoryId.split(',');
            const priceLeveles = priceLevel.split(',');
            const acreageLeveles = acreageLevel.split(',');

            if (categoryId?.length) {
                setCategoryIds(cateIds);
            }
            if (priceLevel?.length) {
                setPriceLevelChoosed(priceLeveles);
            }
            if (acreageLevel?.length) {
                setAcreageLevelChoosed(acreageLeveles);
            }

            if (district?.length) {
                setDistrict(district);
                setWards(getWardsOption(AdministrativeUnits, district));

                if (ward?.length) {
                    setWard(ward);
                }
            }

            const search = {
                district: district?.length ? district : '',
                ward: ward?.length ? ward : '',
                categoryId: categoryId?.length ? categoryId : '',
                priceLevel: priceLevel?.length ? priceLevel : '',
                acreageLevel: acreageLevel?.length ? acreageLevel : ''
            }

            setModelSearch(search);
        }
    }, [JSON.stringify(query)]);



    const getCategoriesHandle = async () => {
        const query = { isPagin: false }

        const res = await getCategories(query);
        if (res?.success) {
            const vals = (res?.result?.data || []).filter(item => item.type === CategoryType.LAND)
            setCategories(vals);
            setMeta(res?.result?.meta);
        }
    }
    const getNameCagegory = () => {
        let b = [];
        (categoryIds || []).forEach(item => {
            let a = categories.find(cat => cat.id == item);

            if (a !== null && a !== undefined) {
                b.push(a.name);
            }
        });

        return b.join(' - ')
    }
    const selectDistrict = (e) => {
        if (!e.target.value) {
            return;
        }

        setWard('');
        setDistrict(e.target.value);
        setWards(getWardsOption(AdministrativeUnits, e.target.value));

        setModelSearch({ ...modelSearch, district: e.target.value, ward: '' })
    }
    const selectWard = (e) => {
        if (!e.target.value) {
            return;
        }

        setWard(e.target.value);
        setModelSearch({ ...modelSearch, ward: e.target.value, })
    }
    const chooseCategories = (e) => {
        let current = [...categoryIds];

        var x = document.getElementsByName(e.target.name);
        if (x.length) {
            if (e.target.checked && !current.includes(e.target.name)) {
                x[0].checked = true;
                x[1]?.checked = true;
            } else {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        }

        if (e.target.checked) {
            current.push(e.target.name);
        } else {
            current = current.filter(item => item !== e.target.name);
        }

        setCategoryIds(current);
        setModelSearch({ ...modelSearch, categoryId: current.toString() })
    }
    const choosePrice = (e) => {
        let current = [...priceLevelChoosed];
        var x = document.getElementsByName(e.target.name);

        if (x.length) {
            if (e.target.checked) {
                x[0].checked = true;
                x[1]?.checked = true;
            } else {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        }

        if (e.target.checked) {
            current.push(e.target.name);
        } else {
            current = current.filter(item => item !== e.target.name);
        }

        setPriceLevelChoosed(current);
        setModelSearch({ ...modelSearch, priceLevel: current.toString(), })
    }
    const chooseAcreage = (e) => {
        let current = [...acreageLevelChoosed];
        var x = document.getElementsByName(e.target.name);

        if (x.length) {
            if (e.target.checked) {
                x[0].checked = true;
                x[1]?.checked = true;
            } else {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        }

        if (e.target.checked) {
            current.push(e.target.name);
        } else {
            current = current.filter(item => item !== e.target.name);
        }

        setAcreageLevelChoosed(current);
        setModelSearch({ ...modelSearch, acreageLevel: current.toString(), })
    }
    const removeFilterAddress = () => {
        setDistrict('');
        setWard('');
        setWards([]);

        setModelSearch({
            ...modelSearch,
            district: '',
            ward: '',
        })
    }
    const removeFilterCategory = () => {
        (categories || []).forEach(item => {
            var x = document.getElementsByName(item.id);
            if (x.length) {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        });

        setCategoryIds([]);
        setModelSearch({
            ...modelSearch,
            categoryId: '',
        })
    }
    const removeFilterPrice = () => {
        (listPriceLevel || []).forEach(item => {
            var x = document.getElementsByName(item.id);
            if (x.length) {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        });

        setPriceLevelChoosed([]);
        setModelSearch({
            ...modelSearch,
            priceLevel: '',
        });
    }
    const removeFilterAcreage = () => {
        (listAcreage || []).forEach(item => {
            var x = document.getElementsByName(item.id);
            if (x.length) {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        });

        setAcreageLevelChoosed([]);
        setModelSearch({
            ...modelSearch,
            acreageLevel: '',
        });
    }

    return (
        <>
            <div className='show-menu-filter'>
                <div className={`filter-item ${activeAddress ? 'active' : ''} ${district ? 'has-value' : ''}`} onClick={() => setActiveAddress(!activeAddress)}>
                    {`${ward ? ward + ', ' : ''}${district ? district : 'Khu vực'}`}
                    <i className="icon-down-open"></i>
                </div>
                <div className={`filter-item ${activeCategory ? 'active' : ''} ${modelSearch?.categoryId?.length ? 'has-value' : ''}`} onClick={() => setActiveCategory(!activeCategory)}>
                    {getNameCagegory() || 'Loại nhà đất'}
                    <i className="icon-down-open"></i>
                </div>
                <div className={`filter-item ${activePrice ? 'active' : ''} ${priceLevelChoosed.length ? 'has-value' : ''}`} onClick={() => setActivePrice(!activePrice)}>
                    Mức giá
                    <i className="icon-down-open"></i>
                </div>
                <div className={`filter-item ${activeAcreage ? 'active' : ''} ${acreageLevelChoosed.length ? 'has-value' : ''}`} onClick={() => setActiveAcreage(!activeAcreage)}>
                    Diện tích
                    <i className="icon-down-open"></i>
                </div>
            </div>

            <Popup open={activeAddress} closeOnDocumentClick onClose={() => setActiveAddress(false)} className="popup-filter-lands">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Khu vực Đăk Nông</p>
                        <i className="icon-cancel" onClick={() => setActiveAddress(false)}></i>
                    </div>

                    <div className="filter-content">
                        <div className="form-select">
                            <select
                                onChange={selectDistrict}
                                name='district'
                                value={district}
                            >
                                <option value="" disabled selected>Huyện, thành phố</option>
                                {getDistrictOption(AdministrativeUnits).map((dis, index) => (
                                    <option key={index} value={dis.id}>{dis.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-select">
                            <select
                                onChange={selectWard}
                                name='ward'
                                value={ward}
                                disabled={!district}
                            >
                                <option value="" disabled selected>Xã, phường</option>
                                {wards.map((prov, index) => (
                                    <option key={index} value={prov.id}>{prov.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='filter-footer'>
                        {district && <span className='remove-filter' onClick={removeFilterAddress}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>

            <Popup open={activeCategory} closeOnDocumentClick onClose={() => setActiveCategory(false)} className="popup-filter-lands">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Loại bất động sản</p>
                        <i className="icon-cancel" onClick={() => setActiveCategory(false)}></i>
                    </div>
                    <div className="filter-content">
                        {categories.map(type => {
                            return (
                                < Checkbox
                                    key={type.id}
                                    name={type.id}
                                    label={type.name}
                                    checked={categoryIds.includes(type.id)}
                                    onChange={e => chooseCategories(e)}
                                />
                            )
                        })}
                    </div>
                    <div className='filter-footer'>
                        {modelSearch?.categoryId?.length > 0 && <span className='remove-filter' onClick={removeFilterCategory}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>

            <Popup open={activePrice} closeOnDocumentClick onClose={() => setActivePrice(false)} className="popup-filter-lands">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Khoảng giá</p>
                        <i className="icon-cancel" onClick={() => setActivePrice(false)}></i>
                    </div>

                    <div className="filter-content">
                        {listPriceLevel.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.id}
                                    name={ac.id}
                                    label={ac.label}
                                    checked={priceLevelChoosed.includes(ac.id)}
                                    onChange={e => choosePrice(e)}
                                />
                            )
                        })}
                    </div>

                    <div className='filter-footer'>
                        {priceLevelChoosed.length > 0 && <span className='remove-filter' onClick={removeFilterPrice}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>

            <Popup open={activeAcreage} closeOnDocumentClick onClose={() => setActiveAcreage(false)} className="popup-filter-lands">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Khoảng diện tích</p>
                        <i className="icon-cancel" onClick={() => setActiveAcreage(false)}></i>
                    </div>

                    <div className="filter-content">
                        {listAcreage.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.id}
                                    name={ac.id}
                                    label={ac.label}
                                    checked={acreageLevelChoosed.includes(ac.id)}
                                    onChange={e => chooseAcreage(e)}
                                />
                            )
                        })}
                    </div>

                    <div className='filter-footer'>
                        {acreageLevelChoosed.length > 0 && <span className='remove-filter' onClick={removeFilterAcreage}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>


            <div className='filter-desktop'>
                <div className="filter-block">
                    <p className='filter-title'>Khu vực Đăk Nông</p>
                    {district && <span className='remove-filter' onClick={removeFilterAddress}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        <div className="form-select small">
                            <select
                                onChange={selectDistrict}
                                name='district'
                                value={district}
                            >
                                <option value="" disabled selected>Huyện, thành phố</option>
                                {getDistrictOption(AdministrativeUnits).map((dis, index) => (
                                    <option key={index} value={dis.id}>{dis.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-select small">
                            <select
                                onChange={selectWard}
                                name='ward'
                                value={ward}
                                disabled={!district}
                            >
                                <option value="" disabled selected>Xã, phường</option>
                                {wards.map((prov, index) => (
                                    <option key={index} value={prov.id}>{prov.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="filter-block">
                    <p className='filter-title'>Loại bất động sản</p>
                    {modelSearch?.categoryId?.length > 0 && <span className='remove-filter' onClick={removeFilterCategory}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        {categories.map(type => (
                            <Checkbox
                                key={type.id}
                                name={type.id}
                                label={type.name}
                                checked={modelSearch?.categoryId?.includes(type.id)}
                                onChange={e => chooseCategories(e)}
                            />
                        ))}
                    </div>
                </div>
                <div className="filter-block">
                    <p className='filter-title'>Khoảng giá</p>
                    {priceLevelChoosed.length > 0 && <span className='remove-filter' onClick={removeFilterPrice}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        {listPriceLevel.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.id}
                                    name={ac.id}
                                    label={ac.label}
                                    checked={priceLevelChoosed.includes(ac.id)}
                                    onChange={e => choosePrice(e)}
                                />
                            )
                        })}
                    </div>
                </div>
                <div className="filter-block">
                    <p className='filter-title'>Khoảng diện tích</p>
                    {acreageLevelChoosed.length > 0 && <span className='remove-filter' onClick={removeFilterAcreage}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        {listAcreage.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.id}
                                    name={ac.id}
                                    label={ac.label}
                                    checked={acreageLevelChoosed.includes(ac.id)}
                                    onChange={e => chooseAcreage(e)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>

        </>
    )
}

export default LandFilter






// import { useCallback, useEffect, useMemo, useState } from 'react';
// import Popup from 'reactjs-popup';
// import { useDispatch } from 'react-redux';

// import Checkbox from 'components/common/checkbox';
// import { CategoryType, AcreageLevel, PriceLevel } from 'lib/constants/data';
// import { AdministrativeUnits } from 'lib/constants/administrativeUnits';
// import {
//     getDistrictOption,
//     getWardsOption,
//     getOptionFromObject,
// } from 'lib/utils';

// import {
//     POPUP_FILTER_OPEN,
//     POPUP_FILTER_HIDE,
// } from 'lib/store/type/common-type';

// /* ===================== CONST ===================== */

// const INIT_FILTER = {
//     district: '',
//     ward: '',
//     categoryId: '',
//     priceLevel: '',
//     acreageLevel: '',
// };

// /* ===================== COMPONENT ===================== */

// const RoomFilter = ({ searchRooms, query }) => {
//     const dispatch = useDispatch();

//     const [categories, setCategories] = useState([]);
//     const [wards, setWards] = useState([]);
//     const [filters, setFilters] = useState(INIT_FILTER);

//     // popup đang mở
//     const [activePopup, setActivePopup] = useState(null);

//     /* ===================== OPTIONS ===================== */

//     const priceOptions = useMemo(
//         () => getOptionFromObject(PriceLevel),
//         []
//     );

//     const acreageOptions = useMemo(
//         () => getOptionFromObject(AcreageLevel),
//         []
//     );

//     const categoryIds = useMemo(
//         () => filters.categoryId.split(',').filter(Boolean),
//         [filters.categoryId]
//     );

//     const priceIds = useMemo(
//         () => filters.priceLevel.split(',').filter(Boolean),
//         [filters.priceLevel]
//     );

//     const acreageIds = useMemo(
//         () => filters.acreageLevel.split(',').filter(Boolean),
//         [filters.acreageLevel]
//     );

//     /* ===================== EFFECTS ===================== */

//     // fetch categories
//     useEffect(() => {
//         getCategories({ isPagin: false }).then(res => {
//             if (res?.success) {
//                 setCategories(
//                     (res.result?.data || []).filter(
//                         item => item.type === CategoryType.LAND
//                     )
//                 );
//             }
//         });
//     }, []);

//     // call search
//     useEffect(() => {
//         const hasValue = Object.values(filters).some(Boolean);
//         if (!hasValue) return;

//         searchRooms(filters);
//     }, [filters, searchRooms]);


//     // popup overlay redux
//     useEffect(() => {
//         dispatch({
//             type: activePopup
//                 ? POPUP_FILTER_OPEN
//                 : POPUP_FILTER_HIDE,
//         });
//     }, [activePopup, dispatch]);

//     // sync query -> filter
//     useEffect(() => {
//         if (!query) return;

//         const nextFilter = {
//             district: query.district || '',
//             ward: query.ward || '',
//             categoryId: query.categoryId || '',
//             priceLevel: query.priceLevel || '',
//             acreageLevel: query.acreageLevel || '',
//         };

//         if (nextFilter.district) {
//             setWards(
//                 getWardsOption(AdministrativeUnits, nextFilter.district)
//             );
//         }

//         setFilters(nextFilter);
//     }, [query]);

//     /* ===================== HANDLERS ===================== */

//     const toggleMultiValue = useCallback(
//         (key, value) => {
//             const current = filters[key].split(',').filter(Boolean);

//             const next = current.includes(value)
//                 ? current.filter(v => v !== value)
//                 : [...current, value];

//             setFilters(prev => ({
//                 ...prev,
//                 [key]: next.join(','),
//             }));
//         },
//         [filters]
//     );

//     const clearFilter = useCallback(key => {
//         setFilters(prev => ({
//             ...prev,
//             [key]: '',
//         }));
//     }, []);

//     const selectDistrict = e => {
//         const value = e.target.value;
//         if (!value) return;

//         setWards(getWardsOption(AdministrativeUnits, value));
//         setFilters(prev => ({
//             ...prev,
//             district: value,
//             ward: '',
//         }));
//     };

//     const selectWard = e => {
//         const value = e.target.value;
//         if (!value) return;

//         setFilters(prev => ({
//             ...prev,
//             ward: value,
//         }));
//     };

//     const categoryNames = useMemo(() => {
//         return categoryIds
//             .map(id => categories.find(c => c.id === id)?.name)
//             .filter(Boolean)
//             .join(' - ');
//     }, [categoryIds, categories]);

//     /* ===================== RENDER ===================== */

//     return (
//         <>
//             {/* ===== TOP FILTER BAR ===== */}
//             <div className="show-menu-filter">
//                 <div
//                     className={`filter-item ${filters.district ? 'has-value' : ''
//                         }`}
//                     onClick={() => setActivePopup('address')}
//                 >
//                     {filters.ward
//                         ? `${filters.ward}, ${filters.district}`
//                         : filters.district || 'Khu vực'}
//                     <i className="icon-down-open" />
//                 </div>

//                 <div
//                     className={`filter-item ${filters.categoryId ? 'has-value' : ''
//                         }`}
//                     onClick={() => setActivePopup('category')}
//                 >
//                     {categoryNames || 'Loại nhà đất'}
//                     <i className="icon-down-open" />
//                 </div>

//                 <div
//                     className={`filter-item ${priceIds.length ? 'has-value' : ''
//                         }`}
//                     onClick={() => setActivePopup('price')}
//                 >
//                     Mức giá <i className="icon-down-open" />
//                 </div>

//                 <div
//                     className={`filter-item ${acreageIds.length ? 'has-value' : ''
//                         }`}
//                     onClick={() => setActivePopup('acreage')}
//                 >
//                     Diện tích <i className="icon-down-open" />
//                 </div>
//             </div>

//             {/* ===== POPUP ADDRESS ===== */}
//             <Popup
//                 open={activePopup === 'address'}
//                 onClose={() => setActivePopup(null)}
//                 className="popup-filter-rooms"
//             >
//                 <div className="filter-mobile">
//                     <div className="filter-head">
//                         <p className="filter-title">Khu vực Đăk Nông</p>
//                         <i
//                             className="icon-cancel"
//                             onClick={() => setActivePopup(null)}
//                         />
//                     </div>

//                     <div className="filter-content">
//                         <div className="form-select">
//                             <select value={filters.district} onChange={selectDistrict}>
//                                 <option value="">Huyện, thành phố</option>
//                                 {getDistrictOption(AdministrativeUnits).map(d => (
//                                     <option key={d.id} value={d.id}>
//                                         {d.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         <div className="form-select">
//                             <select
//                                 value={filters.ward}
//                                 onChange={selectWard}
//                                 disabled={!filters.district}
//                             >
//                                 <option value="">Xã, phường</option>
//                                 {wards.map(w => (
//                                     <option key={w.id} value={w.id}>
//                                         {w.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {filters.district && (
//                         <div className="filter-footer">
//                             <span
//                                 className="remove-filter"
//                                 onClick={() => clearFilter('district')}
//                             >
//                                 Bỏ lọc
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </Popup>

//             {/* ===== POPUP CATEGORY ===== */}
//             <Popup
//                 open={activePopup === 'category'}
//                 onClose={() => setActivePopup(null)}
//                 className="popup-filter-rooms"
//             >
//                 <div className="filter-mobile">
//                     <div className="filter-head">
//                         <p className="filter-title">Loại bất động sản</p>
//                         <i
//                             className="icon-cancel"
//                             onClick={() => setActivePopup(null)}
//                         />
//                     </div>

//                     <div className="filter-content">
//                         {categories.map(c => (
//                             <Checkbox
//                                 key={c.id}
//                                 name={c.id}
//                                 label={c.name}
//                                 checked={categoryIds.includes(c.id)}
//                                 onChange={() =>
//                                     toggleMultiValue('categoryId', c.id)
//                                 }
//                             />
//                         ))}
//                     </div>

//                     {filters.categoryId && (
//                         <div className="filter-footer">
//                             <span
//                                 className="remove-filter"
//                                 onClick={() => clearFilter('categoryId')}
//                             >
//                                 Bỏ lọc
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </Popup>

//             {/* ===== POPUP PRICE ===== */}
//             <Popup
//                 open={activePopup === 'price'}
//                 onClose={() => setActivePopup(null)}
//                 className="popup-filter-rooms"
//             >
//                 <div className="filter-mobile">
//                     <div className="filter-head">
//                         <p className="filter-title">Khoảng giá</p>
//                         <i
//                             className="icon-cancel"
//                             onClick={() => setActivePopup(null)}
//                         />
//                     </div>

//                     <div className="filter-content">
//                         {priceOptions.map(p => (
//                             <Checkbox
//                                 key={p.id}
//                                 name={p.id}
//                                 label={p.label}
//                                 checked={priceIds.includes(p.id)}
//                                 onChange={() =>
//                                     toggleMultiValue('priceLevel', p.id)
//                                 }
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </Popup>

//             {/* ===== POPUP ACREAGE ===== */}
//             <Popup
//                 open={activePopup === 'acreage'}
//                 onClose={() => setActivePopup(null)}
//                 className="popup-filter-rooms"
//             >
//                 <div className="filter-mobile">
//                     <div className="filter-head">
//                         <p className="filter-title">Khoảng diện tích</p>
//                         <i
//                             className="icon-cancel"
//                             onClick={() => setActivePopup(null)}
//                         />
//                     </div>

//                     <div className="filter-content">
//                         {acreageOptions.map(a => (
//                             <Checkbox
//                                 key={a.id}
//                                 name={a.id}
//                                 label={a.label}
//                                 checked={acreageIds.includes(a.id)}
//                                 onChange={() =>
//                                     toggleMultiValue('acreageLevel', a.id)
//                                 }
//                             />
//                         ))}
//                     </div>
//                 </div>
//             </Popup>
//         </>
//     );
// };

// export default RoomFilter;

