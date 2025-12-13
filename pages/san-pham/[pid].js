import Breadcrumb from 'components/common/breadcrumb';
import ProductContent from 'components/product/product-content';
import ProductGallery from 'components/product/product-gallery';
import { getProductDetail } from 'lib/api/product-service';
import { PageUrl } from 'lib/constants/constant';
import PopupContactProduct from 'components/common/popup-contact-product';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POPUP_ADD_ADDRESS_HIDE, POPUP_ADD_ADDRESS_OPEN } from 'lib/store/type/common-type';
import { getContactDetail } from 'lib/api/product-service';
import { toast } from 'react-toastify';

export async function getServerSideProps({ params }) {
    const { pid } = params;
    const data = await getProductDetail(pid);

    return {
        props: {
            product: data || {}
        },
    }
}

const ProductDetail = ({ product }) => {
    const { isPopupAddAddressOpen } = useSelector(state => state.commons)
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const [openModal, setOpenModal] = useState(false);
    const [contact, setContact] = useState({});

    useEffect(() => {
        if (!openModal) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }, openModal);

    const openModalHandle = async () => {
        try {
            if (product && product?.collaborator_id) {
                const res = await getContactDetail(product.collaborator_id);
                if (res && res?.success) {
                    setContact(res.result);
                    setOpenModal(true);
                    dispatch({ type: POPUP_ADD_ADDRESS_OPEN });
                } else {
                    toast.error('Lấy thông tin thất bại')
                }
            } else {
                toast.error('Lấy thông tin thất bại');
            }
        } catch (error) {
            toast.error('Lấy thông tin thất bại')
        }
    }

    const closeModalContact = () => {
        setOpenModal(false);

        if (isPopupAddAddressOpen) {
            dispatch({ type: POPUP_ADD_ADDRESS_HIDE });
        }
    }

    return (
        <>
            <section className="container product-detail-page">
                <Breadcrumb menu={PageUrl.Products} title={product?.name} />

                <div className="product-detail-content">
                    <ProductGallery images={product?.images} />
                    <ProductContent product={product} />
                </div>

                <p className='title-description-detail'>Mô tả chi tiết</p>
                <div dangerouslySetInnerHTML={{ __html: product.description }} className="product-description" />

                {user && user?.role === 'Admin_ViRung_DakNong' && < div className="group-btn infor-contact">
                    <button type="button" className="btn btn-border" onClick={openModalHandle}>Thông tin</button>
                </div>}

                <PopupContactProduct isShow={openModal} hideModal={closeModalContact} contact={contact} product={product} />
            </section>
        </>
    )
}

export default ProductDetail