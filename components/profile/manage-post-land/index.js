import { useEffect, useState } from 'react'
import NProgress from 'nprogress'
import LandItem from '../../post-land/land-item';
import { getMyPosts, removeMyPost } from 'lib/api/land.service';
import { LandStatus } from 'lib/constants/constant';
import Pagination from 'components/common/pagination';
import { toast } from 'react-toastify';
import PopupConfirm from 'components/common/popup-confirm';

const ManagePostLand = ({ editLand }) => {
    const [lands, setLands] = useState([])
    const [meta, setMeta] = useState(0);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(0);
    const [isShowConfirm, setIsShowConfirm] = useState(false);
    const [landRemove, setLandRemove] = useState(null);

    useEffect(() => {
        getLands();
    }, [page, status]);

    const getLands = async () => {
        try {
            NProgress.start();
            const payload = {
                status: status || '',
                page: page || 0,
                size: 10
            }

            const res = await getMyPosts(payload)
            if (res && res.success) {
                const { data, meta } = res.result;

                setLands(data);
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

    const deleteLandHandle = async (id) => {
        setLandRemove(id);
        setIsShowConfirm(true);
    }

    const closeModalHandle = () => {
        setLandRemove(null);
        setIsShowConfirm(false);
    }

    const removeLand = async () => {
        try {
            if (!landRemove) return;

            NProgress.start();
            const res = await removeMyPost(landRemove);

            if (res && res.success) {
                getLands();
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
                <p className='p-title'>Danh sách bất động sản của tôi</p>

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
                {lands && lands.map((item) => (
                    <LandItem key={item?.id} land={item} editLand={editLand} deleteLand={deleteLandHandle} />
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
                confirm={removeLand}
            />
        </section>
    )
}

export default ManagePostLand
