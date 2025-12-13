import Checkbox from 'components/common/checkbox';
import { getCategories } from 'lib/api/category.service';
import { AdministrativeUnits } from 'lib/constants/administrativeUnits';
import { CategoryType } from 'lib/constants/constant';
import { getDistrictOption } from 'lib/utils';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { COMMON_POPUP_FILTER_OPEN, COMMON_POPUP_FILTER_HIDE } from 'lib/store/type/common-type';
import { useDispatch } from 'react-redux';

const initDataSearch = {
    categoryId: '',
    district: ''
}

const DiscoveryFilter = ({ searchDiscoveries, query }) => {
    const [categories, setCategories] = useState([]);
    const [activeAddress, setActiveAddress] = useState(false);
    const [activeCategory, setActiveCategory] = useState(false);
    const dispatch = useDispatch();
    const [district, setDistrict] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);
    const [modelSearch, setModelSearch] = useState(initDataSearch);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        getCategoriesHandle();
    }, []);

    useEffect(() => {
        if (!firstRender) {
            searchDiscoveries(modelSearch);
        }

        setFirstRender(false);
    }, [JSON.stringify(modelSearch)])

    useEffect(() => {
        if (activeAddress || activeCategory) {
            dispatch({ type: COMMON_POPUP_FILTER_OPEN });
        } else {
            dispatch({ type: COMMON_POPUP_FILTER_HIDE });
        }
    }, [activeAddress, activeCategory])


    useEffect(() => {
        const { district = '', categoryId = '' } = query;
        if (district?.length || categoryId?.length) {
            const cateIds = categoryId.split(',');

            if (categoryId?.length) {
                setCategoryIds(cateIds);
            }

            if (district?.length) {
                setDistrict(district);
            }

            const search = {
                district: district?.length ? district : '',
                categoryId: categoryId?.length ? categoryId : ''
            }

            setModelSearch(search);
        }
    }, [JSON.stringify(query)]);



    const getCategoriesHandle = async () => {
        const query = { isPagin: false }

        const res = await getCategories(query);
        if (res?.success) {
            const vals = (res?.result?.data || []).filter(item => item.type === CategoryType.DISCOVERY)
            setCategories(vals);
        }
    }

    const selectDistrict = (e) => {
        if (!e.target.value) {
            return;
        }

        setDistrict(e.target.value);
        setModelSearch({ ...modelSearch, district: e.target.value, });
    }
    const chooseCategories = (e) => {
        let current = [...categoryIds];

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

        setCategoryIds(current);
        setModelSearch({ ...modelSearch, categoryId: current.toString(), });
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
        setModelSearch({ ...modelSearch, categoryId: '', });
    }
    const removeFilterAddress = () => {
        setDistrict('');
        setModelSearch({ ...modelSearch, district: '', });
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

    return (
        <>
            <div className='show-menu-filter'>
                <div className={`filter-item ${activeCategory ? 'active' : ''} ${modelSearch?.categoryId?.length ? 'has-value' : ''}`} onClick={() => setActiveCategory(!activeCategory)}>
                    {getNameCagegory() || 'Chủ đề'}
                    <i className="icon-down-open"></i>
                </div>
                <div className={`filter-item ${activeAddress ? 'active' : ''} ${district ? 'has-value' : ''}`} onClick={() => setActiveAddress(!activeAddress)}>
                    {`${district ? district : 'Khu vực'}`}
                    <i className="icon-down-open"></i>
                </div>
            </div>


            <Popup open={activeAddress} closeOnDocumentClick onClose={() => setActiveAddress(false)} className="popup-filter-discoveries">
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
                    </div>

                    <div className='filter-footer'>
                        {district && <span className='remove-filter' onClick={removeFilterAddress}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>

            <Popup open={activeCategory} closeOnDocumentClick onClose={() => setActiveCategory(false)} className="popup-filter-discoveries">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Chủ đề khám phá</p>
                        <i className="icon-cancel" onClick={() => setActiveCategory(false)}></i>
                    </div>
                    <div className="filter-content">
                        {categories.map(type => {
                            return (
                                < Checkbox
                                    key={type.id}
                                    name={type.id}
                                    label={type.name}
                                    checked={modelSearch?.categoryId?.includes(type.id)}
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


            <div className='filter-desktop'>
                <div className="filter-block">
                    <p className='filter-title'>Chủ đề khám phá</p>
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
                    <p className='filter-title'>Khu vực Đăk Nông</p>
                    {district && <span className='remove-filter' onClick={removeFilterAddress}>Bỏ lọc</span>}
                    <div className="filter-block-content">
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default DiscoveryFilter
