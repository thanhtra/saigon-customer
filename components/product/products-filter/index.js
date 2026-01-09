import Checkbox from 'components/common/checkbox';
import { CategoryType } from 'lib/constants/data';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { COMMON_POPUP_FILTER_OPEN, COMMON_POPUP_FILTER_HIDE } from 'lib/store/type/common-type';
import { useDispatch } from 'react-redux';
import { StatusProduct } from 'lib/constants/data';

const initModelSearch = {
    categoryId: '',
    status: '',
    keySearch: ''
};

const ProductsFilter = ({ searchProducts, query }) => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [modelSearch, setModelSearch] = useState(initModelSearch);
    const [firstRender, setFirstRender] = useState(true);
    const [activeCategory, setActiveCategory] = useState(false);
    const [activeStatus, setActiveStatus] = useState(false);
    const [categoryIds, setCategoryIds] = useState([]);
    const [statusChoosed, setStatusChoosed] = useState([]);


    useEffect(() => {
        getCategoriesHandle();
    }, [])

    useEffect(() => {
        if (!firstRender) {
            searchProducts(modelSearch);
        }

        setFirstRender(false);
    }, [JSON.stringify(modelSearch)]);

    useEffect(() => {
        if (activeCategory || activeStatus) {
            dispatch({ type: COMMON_POPUP_FILTER_OPEN });
        } else {
            dispatch({ type: COMMON_POPUP_FILTER_HIDE });
        }
    }, [activeCategory, activeStatus])

    useEffect(() => {
        const { categoryId = '', status = '', keySearch = '' } = query;
        if (categoryId.length || status.length || keySearch?.length) {
            const cateIds = categoryId.split(',');
            const stt = status.split(',');

            if (categoryId.length) {
                setCategoryIds(cateIds);
            }
            if (status.length) {
                setStatusChoosed(stt);
            }

            setModelSearch({ categoryId: categoryId.length ? categoryId : '', status: status.length ? status : '', keySearch: keySearch.trim() });
        }
    }, [JSON.stringify(query)]);


    const getCategoriesHandle = async () => {
        const query = { isPagin: false }

        const res = await getCategories(query);
        if (res?.success) {
            const vals = (res?.result?.data || []).filter(item => item.type === CategoryType.PRODUCT)
            setCategories(vals);
        }
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
        setModelSearch({ ...modelSearch, categoryId: current.toString() });
    }

    const chooseStatus = (e) => {
        let current = [...statusChoosed];
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

        setStatusChoosed(current);
        setModelSearch({ ...modelSearch, status: current.toString() });
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
        setModelSearch({ ...modelSearch, categoryId: '' });
    }

    const removeFilterStatus = () => {
        (StatusProduct || []).forEach(item => {
            var x = document.getElementsByName(item.value);
            if (x.length) {
                x[0].checked = false;
                x[1]?.checked = false;
            }
        });

        setStatusChoosed([]);
        setModelSearch({ ...modelSearch, status: '' });
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
                    {getNameCagegory() || 'Loại sản phẩm'}
                    <i className="icon-down-open"></i>
                </div>

                <div className={`filter-item ${activeStatus ? 'active' : ''} ${modelSearch?.status?.length ? 'has-value' : ''}`} onClick={() => setActiveStatus(!activeStatus)}>
                    Trạng thái
                    <i className="icon-down-open"></i>
                </div>
            </div>

            <Popup open={activeCategory} closeOnDocumentClick onClose={() => setActiveCategory(false)} className="popup-filter-products">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Danh mục sản phẩm</p>
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
                        {categoryIds.length > 0 && <span className='remove-filter' onClick={removeFilterCategory}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>

            <Popup open={activeStatus} closeOnDocumentClick onClose={() => setActiveStatus(false)} className="popup-filter-products">
                <div className='filter-mobile'>
                    <div className='filter-head'>
                        <p className='filter-title'>Trạng thái sản phẩm</p>
                        <i className="icon-cancel" onClick={() => setActiveStatus(false)}></i>
                    </div>

                    <div className="filter-content">
                        {StatusProduct.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.value}
                                    name={ac.value}
                                    label={ac.label}
                                    checked={statusChoosed.includes(ac.value)}
                                    onChange={e => chooseStatus(e)}
                                />
                            )
                        })}
                    </div>

                    <div className='filter-footer'>
                        {statusChoosed.length > 0 && <span className='remove-filter' onClick={removeFilterStatus}>Bỏ lọc</span>}
                    </div>
                </div>
            </Popup>


            <div className='filter-desktop'>
                <div className="filter-block">
                    <p className='filter-title'>Danh mục sản phẩm</p>
                    {modelSearch?.categoryId?.length > 0 && <span className='remove-filter' onClick={removeFilterCategory}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        {categories.map(type => (
                            <Checkbox
                                key={type.id}
                                name={type.id}
                                label={type.name}
                                checked={modelSearch?.categoryId.includes(type.id)}
                                onChange={e => chooseCategories(e)}
                            />
                        ))}
                    </div>
                </div>

                <div className="filter-block">
                    <p className='filter-title'>Trạng thái sản phẩm</p>
                    {modelSearch?.status?.length > 0 && <span className='remove-filter' onClick={removeFilterStatus}>Bỏ lọc</span>}
                    <div className="filter-block-content">
                        {StatusProduct.map(ac => {
                            return (
                                < Checkbox
                                    key={ac.value}
                                    name={ac.value}
                                    label={ac.label}
                                    checked={statusChoosed.includes(ac.value)}
                                    onChange={e => chooseStatus(e)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductsFilter
