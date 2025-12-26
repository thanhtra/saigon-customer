import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NProgress from 'nprogress'
import OrderItem from '../order-item'
import { getOrderByUserId } from 'lib/api/order-service';
import { OrderStatus } from 'lib/constants/data';
import Pagination from 'components/common/pagination';

const ManageOrder = () => {
    const [orders, setOrders] = useState([])
    const { user } = useSelector(state => state.users)
    const [meta, setMeta] = useState(0);
    const [type, setType] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        getOrders()
    }, [page, type]);

    const getOrders = async () => {
        const userId = user?.id
        if (!userId) return;

        try {
            NProgress.start();

            const payload = {
                userId,
                status: type || '',
                page: page || 0,
                size: 10,
                isPagin: true
            }

            const res = await getOrderByUserId(payload)
            if (res && res.success) {
                const { data, meta } = res.result;

                setOrders(data);
                setMeta(meta);
            }
            NProgress.done()
        } catch (error) {
            NProgress.done()
        }
    }

    const selectType = (e) => {
        setPage(0);
        setType(e.target.value)
    }

    return (
        <section className="manage-order">
            <div className='p-header'>
                <p className='p-title'>Đơn hàng của tôi</p>

                <form className='form'>
                    <div className="form-select">
                        <select onChange={selectType}>
                            <option key={99999} value={''}>Tất cả</option>
                            {Object.entries(OrderStatus).map(
                                ([key, value]) => <option key={key} value={key}>{value}</option>
                            )}
                            <option key={999999} value={''}>Tất cả</option>
                        </select>
                    </div>
                </form>
            </div>

            <div className='m-o-content'>
                {orders && orders.map(item => <OrderItem
                    key={item?.id}
                    order_code={item?.order_code}
                    order_detail={JSON.parse(item?.order_detail)}
                    status={item?.status}
                    updatedAt={item?.updatedAt}
                />)}
            </div>

            {meta?.itemCount > 0 && <Pagination
                className="pagination-bar"
                currentPage={meta?.page}
                totalCount={meta?.itemCount}
                pageSize={meta?.size}
                onPageChange={page => setPage(page)}
            />}

        </section>
    )
}

export default ManageOrder
