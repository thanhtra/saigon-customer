import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CART_ADD_ITEM_REQUEST } from 'lib/store/type/cart-type';
import { formatCurrency } from 'lib/utils'
import useOnClickOutside from 'use-onclickoutside';
import Checkbox from 'components/common/checkbox';
import { StatusProductConst } from 'lib/constants/data';

const ProductContent = ({ product }) => {
    const inputRef = useRef(null);
    const dispatch = useDispatch();
    const [packs, setPacks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    const addToCart = async () => {
        const payload = packs.filter(item => item.selected === true).map(item => ({
            item: product.name + ' - ' + item.name,
            price: Number(item.price),
            quantity: item.quantity || 1,
            image: item.image
        }));

        dispatch({
            type: CART_ADD_ITEM_REQUEST,
            payload: payload
        });
    }

    useEffect(() => {
        const listPacks = (JSON.parse(product.packs) || []).map(item => {
            return {
                ...item,
                selected: false,
                quantity: 1,
            }
        });
        if (listPacks.length) {
            listPacks[0].selected = true;
        }

        setPacks(listPacks);
    }, []);

    const inputQuantity = (e, pack) => {
        const re = /^[0-9\b]+$/;

        if (e.target.value === '' || re.test(e.target.value)) {
            const newPacks = packs.map(item => {
                if (item.name === pack.name) {
                    return {
                        ...item,
                        quantity: e.target.value
                    }
                } else {
                    return item
                }
            });

            setPacks(newPacks);
        }
    }

    const clickOutInput = () => {
        const newPacks = packs.map(item => {
            if (item?.quantity === '' || Number(item?.quantity) === 0) {
                return {
                    ...item,
                    quantity: 1
                }
            } else {
                return item
            }
        });

        setPacks(newPacks);
    }

    useOnClickOutside(inputRef, clickOutInput);

    const updateQuantity = (pack, isIncrease) => {
        const newPacks = packs.map(item => {
            if (item.name === pack.name) {
                return {
                    ...item,
                    quantity: isIncrease ? (++item.quantity) : (item.quantity > 1 ? --item.quantity : 1)
                }
            } else {
                return item
            }
        });

        setPacks(newPacks);
    }

    const isEmptyHandel = () => {
        const a = packs.filter(item => item.selected == true);
        return a === 0;
    }

    const choosePack = (e, pack) => {
        const newPacks = packs.map(item => {
            if (item.name === pack.name) {
                return {
                    ...item,
                    selected: !item.selected
                }
            } else {
                return item
            }
        });
        const a = newPacks.filter(item => item.selected == true).length === 0;
        setIsEmpty(a);

        setPacks(newPacks);
    }


    return (
        <section className="product-content">
            <div className="product-add-cart">
                <h2 className="product-name">{product.name}</h2>
                <div dangerouslySetInnerHTML={{ __html: product.brief_description }} className='brief-description' />

                <div className="choose-product">
                    <div className='pack-head'>
                        <p>Chọn sản phẩm</p>
                        <p>Số lượng</p>
                    </div>

                    {packs.map(item => <>
                        <div className='pack-item'>
                            <div className='pack-name'>
                                <Checkbox
                                    key={item.name}
                                    name={item.name}
                                    checked={item?.selected}
                                    label={`${item.name} - ${formatCurrency.format(Number(item.price))}`}
                                    onChange={e => choosePack(e, item)}
                                />
                            </div>
                            <div className={`quantity-buttons ${item?.selected ? 'active' : ''}`}>
                                <div className="quantity-button" ref={inputRef}>
                                    <button type="button" onClick={() => updateQuantity(item, false)}>
                                        -
                                    </button>
                                    <input type="text" value={item.quantity} onChange={(e) => inputQuantity(e, item)} />
                                    <button type="button" onClick={() => updateQuantity(item, true)}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>)}
                </div>

                <div className='btn-add-to-cart'>
                    <button type="button" onClick={() => addToCart()} className={`btn ${product?.status === StatusProductConst.OutOfStock || isEmpty ? 'btn-disable' : ''}`}>Thêm vào giỏ hàng</button>
                </div>

                <div className='call-to-order'>
                    <p className='c-title'>Hoặc liên hệ để mua sản phẩm <span className='phone-lable'><span className='phone'>điện thoại</span> - <span className='zalo'>zalo</span> <span className='phone-val'>0968 922 006</span></span></p>

                    <div className='action'>
                        <a className="btn btn_call zalo" target="_blank" href="https://zalo.me/0968922006">
                            Zalo
                        </a>

                        <a className="btn btn_call" href="tel://0968922006">
                            Bấm gọi
                        </a>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default ProductContent;
