import { OrderStatus, PageUrl } from 'lib/constants/data';
import { CART_RE_BUY } from 'lib/store/type/cart-type';
import { formatCurrency } from 'lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


const OrderItem = ({ order_code, order_detail, status, updatedAt }) => {
    const [totalPrice, setTotalPrice] = useState(0)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        getOrderItemDetail()
    }, [])

    const getOrderItemDetail = () => {
        let total = 0;

        (order_detail || []).map(item => {
            total += item?.price * item?.quantity;
        })

        setTotalPrice(total);
    }

    // const redirecToProductDetail = () => {
    //     dispatch({
    //         type: CART_RE_BUY,
    //         payload: order_detail
    //     })

    //     router.push(PageUrl.ShoppingCart)
    // }

    return (
        <div className="order-item">
            <div className='o-i-status'>
                <div className='order-code'>Mã đơn hàng <span>{order_code}</span></div>
                <div className='order-status'>{OrderStatus[status]}</div>
            </div>
            {(order_detail || []).map((item, index) => <div className="o-i-product" key={index}>
                <div className='name'>
                    <div className='image' style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/product/${item?.image})` }}></div>

                    <div className='name-area'>
                        <p className='name-title'>{item?.item}</p>
                        <p className='quantity'>x{item?.quantity}</p>
                    </div>
                </div>
                <div className='price'>
                    {formatCurrency.format(item?.price)}
                </div>
            </div>)}
            <div className="o-i-delivery">
                {/* <button type="button" className="btn btn-border" onClick={redirecToProductDetail}>Mua lại</button> */}
                <p className='total-price'>Tổng số tiền: <span>{formatCurrency.format(totalPrice)}</span> + <span>Phí vận chuyển</span> </p>
            </div>
        </div>
    )
}

export default OrderItem