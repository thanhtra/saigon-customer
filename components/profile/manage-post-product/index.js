import { useEffect, useState } from 'react'
import NProgress from 'nprogress'
import { getMyPosts, removeMyPost } from 'lib/api/product-service';
import { LandStatus } from 'lib/constants/constant';
import Pagination from 'components/common/pagination';
import { toast } from 'react-toastify';
import PopupConfirm from 'components/common/popup-confirm';
import PostProductItem from '../../product/post-product-item';

const ManagePostProduct = ({ editProduct }) => {
    const [products, setProducts] = useState([])
    const [meta, setMeta] = useState(0);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [productRemove, setProductRemove] = useState(null);

    useEffect(() => {
        getProducts();
    }, [page, status]);

    const getProducts = async () => {
        try {
            NProgress.start();
            const payload = {
                status_post: status || '',
                page: page || 0,
                size: 10
            }

            const res = await getMyPosts(payload)
            if (res && res.success) {
                const { data, meta } = res.result;

                setProducts(data);
                setMeta(meta);
            }
            NProgress.done()
        } catch (error) {
            NProgress.done()
        }
    }

    const selectType = (e) => {
        setPage(0);
        setStatus(e.target.value)
    }

    const deleteProductHandle = async (id) => {
        setProductRemove(id);
        setIsShowConfirm(true);
    }

    const closeModalHandle = () => {
        setProductRemove(null);
        setIsShowConfirm(false);
    }

    const removeProduct = async () => {
        try {
            if (!productRemove) return;

            NProgress.start();
            const res = await removeMyPost(productRemove);

            if (res && res.success) {
                getProducts();
                toast.success("Đã xóa tin đăng");
            } else {
                toast.error("Xóa tin đăng thất bại");
            }

            setIsShowConfirm(false);
            NProgress.done()
        } catch (error) {
            setIsShowConfirm(false);
            NProgress.done();
            toast.error("Xóa tin đăng thất bại");
        }
    }

    return (
        <section className="manage-post-land">
            <div className='p-header'>
                <p className='p-title'>Danh sách sản phẩm của tôi</p>

                <form className='form'>
                    <div className="form-select">
                        <select onChange={selectType}>
                            <option key={99999} value={''}>Tất cả</option>
                            {Object.entries(LandStatus).map(
                                ([key, value]) => <option key={key} value={key}>{value}</option>
                            )}
                            <option key={999999} value={''}>Tất cả</option>
                        </select>
                    </div>
                </form>
            </div>

            <div className='m-p-l-content'>
                {products && products.map((item) => (
                    <PostProductItem key={item?.id} product={item} editProduct={editProduct} deleteProduct={deleteProductHandle} />
                ))}

                <Pagination
                    className="pagination-bar"
                    currentPage={meta?.page}
                    totalCount={meta?.itemCount}
                    pageSize={meta?.size}
                    onPageChange={page => setPage(page)}
                />
            </div>

            <PopupConfirm
                isShow={isShowConfirm}
                closeModalHandle={closeModalHandle}
                title='Bạn muốn xóa bất động sản này?'
                message='Dữ liệu sẽ bị xóa không thể khôi phục'
                confirm={removeProduct}
            />
        </section>
    )
}

export default ManagePostProduct
