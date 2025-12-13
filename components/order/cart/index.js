import React from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import CheckoutStatus from '../checkout-status';
import CartItem from '../cart-item';
import { formatCurrency } from 'lib/utils';
import Link from 'next/link';
import { PageUrl } from 'lib/constants/constant';
import Breadcrumb from 'components/common/breadcrumb';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';

const Cart = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.carts)
    const { user } = useSelector(state => state.users);
    const totalPrice = (cartItems || []).reduce((total, curr) => total + Number(curr.price) * Number(curr.quantity), 0)

    const redirectToPayment = () => {
        if (Object.keys(user).length) {
            router.push(PageUrl.Payment);
        } else {
            dispatch({
                type: COMMON_URL_REDIRECT_LOGIN,
                payload: PageUrl.Payment
            })
            router.push(PageUrl.Login);
        }
    }

    return (
        <section className="container cart">
            <Breadcrumb title='Giỏ hàng' />

            <div className="cart-intro">
                <h3 className="cart-title">Giỏ hàng</h3>
                <CheckoutStatus step="cart" />
            </div>

            {cartItems.length === 0 ?
                <div className="cart-empty">
                    <p>Giỏ hàng trống</p>

                    <Link href="/san-pham">
                        <button type="button" className="btn btn-border btn-full">Mua hàng</button>
                    </Link>
                </div>
                :
                <div>
                    <div className="cart-list">
                        {cartItems.length > 0 &&
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Xóa</th>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th className="price">Giá</th>
                                        <th>Thành tiền</th>
                                    </tr>

                                    {cartItems.map(item => (
                                        <CartItem
                                            key={item.item}
                                            product={item.item}
                                            image={item?.image}
                                            price={item.price}
                                            quantity={item.quantity}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        }
                        <p className="total-price">Tổng tiền <span>{formatCurrency.format(totalPrice)}</span></p>
                    </div>

                    <div className="cart-actions">
                        <button type="button" className={"btn btn-green btn-full" + (totalPrice > 0 ? '' : 'btn-disable')} onClick={redirectToPayment}>Tiến hành đặt hàng</button>

                        <Link href="/san-pham">
                            <button type="button" className="btn btn-border btn-full">Tiếp tục chọn hàng</button>
                        </Link>
                    </div>
                </div>
            }

        </section>
    )
}

export default Cart