import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { CART_UPDATE_ITEM_REQUEST } from 'lib/store/type/cart-type';
import { formatCurrency } from 'lib/utils';
import useOnClickOutside from 'use-onclickoutside';
import { useSelector } from 'react-redux';


const CartItem = ({ image, product, quantity, price }) => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const { cartItems } = useSelector(state => state.carts)

    const removeCartItem = () => {
        let newCartItem = cartItems.filter(x => x.item !== product)

        dispatch({
            type: CART_UPDATE_ITEM_REQUEST,
            payload: newCartItem
        })
    }

    const updateQuantity = (isIncrease) => {
        let newCartItem = [];

        if (isIncrease) {
            newCartItem = cartItems.map(x => x.item === product ? { ...x, quantity: Number(x.quantity) + 1 } : x)
        } else {
            newCartItem = cartItems.map(x => x.item === product ? { ...x, quantity: Number(x.quantity) - 1 === 0 ? 1 : Number(x.quantity) - 1 } : x)
        }

        dispatch({
            type: CART_UPDATE_ITEM_REQUEST,
            payload: newCartItem,
        })
    }

    const inputQuantity = (e) => {
        const re = /^[0-9\b]+$/;

        if (e.target.value === '' || re.test(e.target.value)) {
            let newCartItem = cartItems.map(x => x.item === product ? { ...x, quantity: Number(e.target.value) } : x)
            dispatch({
                type: CART_UPDATE_ITEM_REQUEST,
                payload: newCartItem,
            });
        }
    }

    const clickOutInput = () => {
        let a = Number(quantity);
        if (quantity === '' || Number(quantity) === 0) {
            a = 1;
        } else if (quantity[0] === '0') {
            a = Number(quantity);
        }

        let newCartItem = cartItems.map(x => x.item === product ? { ...x, quantity: a } : x)
        dispatch({
            type: CART_UPDATE_ITEM_REQUEST,
            payload: newCartItem,
        })
    }

    useOnClickOutside(inputRef, clickOutInput);



    return (
        <tr className='cart-item'>
            <td className='td-cancel'><i className="icon-cancel" onClick={() => removeCartItem()}></i></td>
            <td>
                <div className="cart-product">
                    <div className="cart-product-img" style={{
                        backgroundImage: "url(" + `${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/product/` + image + ")"
                    }}>
                        <i className="icon-cancel" onClick={() => removeCartItem()}></i>
                    </div>

                    <div className="cart-product-content">
                        <p className='c-p-c-name'>{product}</p>
                        <p className='c-p-c-price'>{quantity} x {formatCurrency.format(price)}</p>
                    </div>

                    <div className='quantity-buttons'>
                        <div className="quantity-button" ref={inputRef}>
                            <button type="button" onClick={() => updateQuantity(false)}>
                                -
                            </button>
                            <input type="text" value={quantity} onChange={(e) => inputQuantity(e)} />
                            <button type="button" onClick={() => updateQuantity(true)}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </td>
            <td className='td-quantity'>
                <div className='quantity-buttons'>
                    <div className="quantity-button" ref={inputRef}>
                        <button type="button" onClick={() => updateQuantity(false)}>
                            -
                        </button>
                        <input type="text" value={quantity} onChange={(e) => inputQuantity(e, item)} />
                        <button type="button" onClick={() => updateQuantity(true)}>
                            +
                        </button>
                    </div>
                </div>
            </td>
            <td className='td-price'>{formatCurrency.format(price)}</td>
            <td className='td-sum-price'>{formatCurrency.format(quantity * price)}</td>
        </tr>
    )
}

export default CartItem