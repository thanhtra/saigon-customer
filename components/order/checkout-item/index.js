import { useSelector } from 'react-redux';
import { formatCurrency } from 'lib/utils';

const CheckoutItems = () => {
    const { cartItems } = useSelector(state => state.carts)

    return (
        <ul className="checkout-items">
            {cartItems.map(item => (
                <li className="checkout-item" key={item.item}>
                    <div className="checkout-item-content">
                        <div className="checkout-item-img">
                            <img src={`${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/product/` + item?.image} />
                        </div>

                        <div className="checkout-item-data">
                            <p>{item.item}</p>
                            <span>{item.quantity} x {formatCurrency.format(item.price)}</span>
                        </div>
                    </div>
                    <p className='c-price'>{formatCurrency.format((item.quantity || 0) * (item.price || 0))}</p>
                </li>
            ))}
        </ul>
    )
}

export default CheckoutItems