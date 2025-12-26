import clsx from 'clsx';
import Checkbox from 'components/common/checkbox';
import { getCategories } from 'lib/api/category.service';
import {
    createImages,
    removeImageByName,
} from 'lib/api/land.service';
import { createProduct, getMyPost, updateMyProductPost, uploadImagesProduct } from 'lib/api/product-service';
import { CategoryType } from 'lib/constants/data';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import ImageUploading from "react-images-uploading";
import { toast } from 'react-toastify';


const PostProduct = ({ slug = '', displayList }) => {
    const { register, handleSubmit, errors, reset, setValue } = useForm();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    const [productId, setProductId] = useState(null);
    const [collaId, setCollaId] = useState(null);
    const [savedImages, setSavedImages] = useState([]);
    const [productDetail, setProductDetail] = useState({});
    const [isHaveVideo, setIsHaveVideo] = useState(false);
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [packs, setPacks] = useState([{
        name: "",
        price: "",
        price_origin: "",
        image: ""
    }]);

    useEffect(() => {
        if (slug) {
            getProductDetail(slug);
        } else {
            getCategoriesHandle();
            reset({});
            setIsSubmited(false);
            setIsHaveVideo(false);
            setSavedImages([]);
            setImages([]);
            setProductId(null);
            setCollaId(null);
            setProductDetail({});
        }
    }, [slug]);

    const getProductDetail = async (val) => {
        if (!val) return;
        await getCategoriesHandle();
        const res = await getMyPost(val);
        if (res?.success) {
            const product = res?.result;
            setProductId(product?.id);
            setCollaId(product?.contact?.id);

            reset({
                category_id: product?.category_id,
                name: product?.name,
                price: product?.price,
                contact_name: product?.contact?.name,
                contact_phone: product?.contact?.phone,
                contact_zalo: product?.contact?.zalo,
                contact_address: product?.contact?.address,
            });

            setIsHaveVideo(product?.is_have_video ? true : false)
            setSavedImages((product?.images || []).map((item) => item?.name));
            setProductDetail(product);
            setPacks(JSON.parse(product?.packs || {}));
            NProgress.done();
        }
    }

    const getCategoriesHandle = async () => {
        const query = { isPagin: false }

        const res = await getCategories(query);
        if (res?.success) {
            const vals = (res?.result?.data || []).filter(item => item.type === CategoryType.PRODUCT);
            setCategories(vals);
        }
    }

    const onSubmit = async data => {
        setIsSubmited(true);

        if (productId) {
            try {
                if (!collaId) return;
                const countImage = savedImages.length + images.length;
                if (countImage < 2 || countImage > 6) {
                    toast.error("Vui lòng kiểm tra thông tin hình ảnh. Nếu không tải hình được, bạn cần sao chép và mở link website ở Google để đăng tin hoặc liên hệ để được hỗ trợ.");
                    return;
                }
                NProgress.start();

                const payload = {
                    category_id: data?.category_id,
                    name: data?.name,
                    packs: JSON.stringify(packs),
                    description: data?.description,
                    is_have_video: isHaveVideo,
                    contact_name: data?.contact_name,
                    contact_zalo: data?.contact_zalo,
                    contact_address: data?.contact_address,
                }

                const updated = await updateMyProductPost(productId, payload);
                const { success: updateSuccess } = updated;


                // Bước upload hình ảnh và tạo hình ảnh trong db
                let errorUpload = false;

                if (images.length) {
                    let formData = new FormData();

                    (images || []).forEach((item) => {
                        formData.append('photos', item.file, item.file.name);
                    });

                    const resUpload = await uploadImagesProduct(formData);
                    const { success: uploadSuccess, result: arrImageUploaded } = resUpload;

                    if (uploadSuccess && arrImageUploaded.length) {
                        const imagePayload = {
                            imageList: arrImageUploaded,
                            productId: productId,
                            type: "BatDongSan"
                        }
                        const resImageCreated = await createImages(imagePayload);
                        const { success: createImageSuccess } = resImageCreated;

                        if (!createImageSuccess) {
                            errorUpload = true;

                            //Nếu upload hình lên server thành công nhưng k lưu được vào db thì xóa hình ảnh
                            // const functionPromiss = [];
                            // arrImageUploaded.forEach(item => {
                            //     functionPromiss.push(removeImageByName(item));
                            // })
                            // const a = await Promise.all(arrImageUploaded);
                        }
                    } else {
                        errorUpload = true;
                    }

                    setImages([]);
                }

                setIsSubmited(false);
                if (updateSuccess && !errorUpload) {
                    displayList();
                    NProgress.done();
                    toast.success("Cập nhật sản phẩm thành công");
                } else {
                    const msg = "Cập nhật sản phẩm thất bại.";
                    if (errorUpload) {
                        toast.error(msg + " Kiểm tra thông tin hình ảnh");
                    } else {
                        toast.error(msg);
                    }

                    setIsSubmited(false);
                    NProgress.done();
                    toast.error("");
                }

            } catch (err) {
                setIsSubmited(false);
                NProgress.done();
                toast.error("Cập nhật sản phẩm thất bại.");
            }

        } else {
            try {
                if (images.length === 0 || images.length < 2 || images.length > 6) {
                    toast.error("Vui lòng kiểm tra thông tin hình ảnh. Nếu không tải hình được, bạn cần sao chép và mở link website ở Google để đăng tin hoặc liên hệ để được hỗ trợ.");
                    return;
                }

                NProgress.start();

                const productPayload = {
                    category_id: data?.category_id,
                    name: data?.name,
                    description: data?.description,
                    packs: JSON.stringify(packs),
                    is_have_video: isHaveVideo,
                    contact_name: data?.contact_name,
                    contact_phone: data?.contact_phone,
                    contact_zalo: data?.contact_zalo,
                    contact_address: data?.contact_address,
                }

                const res = await createProduct(productPayload);
                const { success, result: landCreated } = res;

                if (success) {
                    // Bước upload hình ảnh và tạo hình ảnh trong db

                    let errorUpload = false;
                    let formData = new FormData();

                    (images || []).forEach((item) => {
                        formData.append('photos', item.file, item.file.name);
                    });

                    const resUpload = await uploadImagesProduct(formData);
                    const { success: uploadSuccess, result: arrImageUploaded } = resUpload;

                    if (uploadSuccess && arrImageUploaded.length) {
                        const imagePayload = {
                            imageList: arrImageUploaded,
                            productId: landCreated?.id,
                            type: "SanPham"
                        }
                        const resImageCreated = await createImages(imagePayload);
                        const { success: createImageSuccess } = resImageCreated;

                        if (!createImageSuccess) {
                            errorUpload = true;

                            //Nếu upload hình lên server thành công nhưng k lưu được vào db thì xóa hình ảnh
                            // const functionPromiss = [];
                            // arrImageUploaded.forEach(item => {
                            //     functionPromiss.push(removeImageByName(item));
                            // })
                            // const a = await Promise.all(arrImageUploaded);
                        }
                    } else {
                        errorUpload = true;
                    }

                    setImages([]);
                    // setMode('edit');
                    // setId(landCreated?.id);
                    setIsSubmited(false);
                    NProgress.done();
                    if (errorUpload) {
                        toast.error("Tải hình ảnh thất bại, vui lòng tải lại");
                    } else {
                        displayList();
                        toast.success("Tạo sản phẩm thành công");
                    }
                } else {
                    setIsSubmited(false);
                    NProgress.done();
                    toast.error("Tạo sản phẩm thất bại.");
                }

            } catch (err) {
                setIsSubmited(false);
                NProgress.done();
                toast.error("Tạo sản phẩm thất bại.");
            }
        }
    }

    const chooseImage = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const removeImageByNameHandle = async (name) => {
        try {
            if (!name) return;
            NProgress.start();

            const res = await removeImageByName(name, CategoryType.LAND);
            const { success } = res;

            if (success) {
                const restImages = (savedImages || []).filter(item => item !== name);
                setSavedImages(restImages);
                NProgress.done();
            } else {
                NProgress.done();
            }

        } catch (err) {
            NProgress.done();
        }
    }

    const checkIsHaveVideo = (e) => {
        setIsHaveVideo(!!e.target.checked);
    }

    const editDescription = (flag) => {
        if (flag) {
            setIsEditDescription(true);
        } else {
            setIsEditDescription(false);
        }
    }

    const addInputPack = () => {
        setPacks([...packs, {
            name: "",
            price: "",
            price_origin: "",
            image: ""
        }]);
    }

    const removePack = (idx) => {
        const a = [...packs];
        a.splice(idx, 1);
        setPacks(a);
    }

    const inputPack = (e, idx, num) => {
        let a = [];
        if (num === 1) {
            a = packs.map((item, i) => idx === i ? { ...item, name: e.target.value } : item);
        } else {
            a = packs.map((item, i) => idx === i ? { ...item, price_origin: e.target.value } : item);
        }
        if (a.length) {
            setPacks(a);
        }
    }

    return (
        <>
            <div className='p-header'>
                <p className='p-title'>{slug ? 'Chỉnh sửa sản phẩm' : 'Tạo mới sản phẩm'}</p>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                <div className='card-post'>
                    <p className='title'>Thông tin sản phẩm</p>
                    <div className='form-row two'>
                        <div className="form-col">
                            <div className="form-select has-label">
                                <label>Loại sản phẩm<label className='required'>*</label></label>
                                <select
                                    name="category_id"
                                    ref={register({
                                        required: true,
                                    })}
                                    defaultValue={''}
                                >
                                    <option value={''} hidden>Chọn</option>
                                    {categories.map((prov, index) => (
                                        <option key={index} value={prov.id}>{prov.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.category_id && errors.category_id.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className="form-col">
                            <div className='form-textarea'>
                                <label>Tiêu đề<label className='required'>*</label></label>
                                <label className='note'>Tối thiểu 5 ký tự, tối đa 90 ký tự</label>
                                <textarea
                                    name="name"
                                    rows={4}
                                    placeholder='Ví dụ: Mật ong rừng Tây Nguyên'
                                    ref={register({
                                        required: true,
                                        minLength: 5,
                                        maxLength: 90
                                    })}
                                />
                            </div>

                            {errors.name && errors.name.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                            {errors.name && errors.name.type === 'minLength' &&
                                <p className="message message-error">Tiêu đề quá ngắn</p>
                            }
                            {errors.name && errors.name.type === 'maxLength' &&
                                <p className="message message-error">Tiêu đề quá dài</p>
                            }
                        </div>
                    </div>

                    <div className='form-row'>
                        {
                            !!slug && !isEditDescription ? <div className="form-col">
                                <div className='des-group-lbl'>
                                    <label>Mô tả<label className='required'>*</label></label>
                                    <button type="button" class="btn-tiny" onClick={() => editDescription(true)}>Thay đổi</button>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: productDetail?.description }} className='description-detail' />
                            </div> :
                                <div className="form-col">
                                    <div className='form-textarea'>
                                        <div className='des-group-lbl'>
                                            <div>
                                                <label>Mô tả<label className='required'>*</label></label>
                                                <label className='note'>Tối thiểu 30 ký tự, tối đa 3.000 ký tự</label>
                                            </div>

                                            {!!slug && <button type="button" class="btn-tiny" onClick={() => editDescription(false)}>Hủy</button>}
                                        </div>

                                        <textarea
                                            name="description"
                                            rows={10}
                                            placeholder='Mô tả chi tiết thông tin về sản phẩm. Ví dụ: nguồn gốc, cách chế biến, cách sử dụng, cách bảo quản, công dụng,...'
                                            ref={register({
                                                required: isEditDescription || !slug ? true : false,
                                                minLength: 30,
                                                maxLength: 3000
                                            })}
                                        />
                                    </div>

                                    {errors.description && errors.description.type === 'required' &&
                                        <p className="message message-error">Vui lòng nhập thông tin</p>
                                    }
                                    {errors.description && errors.description.type === 'minLength' &&
                                        <p className="message message-error">Mô tả quá ngắn</p>
                                    }
                                    {errors.description && errors.description.type === 'maxLength' &&
                                        <p className="message message-error">Mô tả quá dài</p>
                                    }
                                </div>}
                    </div>

                    <div className="form-row">
                        <div className="form-col">
                            <label>Hình ảnh<label className='required'>*</label></label>
                            <label className='note'>
                                + Đăng tối thiểu 2 ảnh, tối đa 6 ảnh <br />
                                + Dùng ảnh thật, không trùng, không chèn SĐT
                            </label>

                            <ImageUploading
                                multiple
                                value={images}
                                onChange={chooseImage}
                                maxNumber={6}
                                dataURLKey="data_url"
                                acceptType={["jpg", "jpeg", "png", "gif"]}
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemove,
                                    isDragging,
                                    dragProps
                                }) => (
                                    <div className='upload-image-wrapper'>
                                        <div
                                            className={clsx({
                                                'image-upload': true,
                                                'popup-open': isDragging
                                            })}

                                            onClick={onImageUpload}
                                            {...dragProps}
                                        >
                                            <div style={{ backgroundImage: 'url(/images/upload-image.svg)' }} className='upload'></div>
                                            Bấm vào đây để đăng tải hình ảnh
                                        </div>

                                        <div className='list-image-upload'>
                                            {(savedImages || []).map(image => (
                                                <div key={image} className='image-item' style={{ backgroundImage: "url(" + `${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/product/` + image + ")" }} >
                                                    < div style={{ backgroundImage: 'url(/images/remove.svg)' }} className='icon-remove' onClick={() => removeImageByNameHandle(image)}></div>
                                                </div>
                                            ))}

                                            {imageList.map((image, index) => (
                                                <div key={index} className='image-item' style={{ backgroundImage: "url(" + image.data_url + ")" }}>
                                                    <div style={{ backgroundImage: 'url(/images/remove.svg)' }} className='icon-remove' onClick={() => onImageRemove(index)}></div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}
                            </ImageUploading>

                            {isSubmited && (savedImages.length + images.length === 0) && <p className="message message-error">Vui lòng tải hình ảnh</p>}
                            {isSubmited && (images.length !== 0 && (savedImages.length + images.length < 2)) && <p className="message message-error">Đăng tối thiểu 2 hình ảnh</p>}
                            {isSubmited && (savedImages.length + images.length > 6) && <p className="message message-error">Đăng tối đa 6 hình ảnh</p>}
                        </div>

                        <div className="form-col">
                            <label>Video</label>
                            <label className='note'>Chọn nếu bạn có video về sản phẩm, chúng tôi sẽ liên hệ để đăng tải</label>

                            <Checkbox
                                key={111}
                                name='is_have_video'
                                label='Có video sản phẩm'
                                value={isHaveVideo}
                                checked={isHaveVideo}
                                onChange={checkIsHaveVideo}
                            />
                        </div>
                    </div>
                </div>

                <div className='card-post'>
                    <p className='title'>Quy cách và giá bán</p>

                    {packs && packs?.map((item, idx) => (
                        <div className="form-row two package-card">
                            {(idx !== 0 || packs.length > 1) && <div className='remove-pack'>
                                <i className="icon-cancel" onClick={() => removePack(idx)}></i>
                            </div>}
                            <div className="form-col">
                                <div className='form-input has-label'>
                                    <label>Quy cách đóng gói<label className='required'>*</label></label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Ví dụ: Gói 1kg, Chai 1 lit,..."
                                        value={item.name}
                                        onChange={(e) => inputPack(e, idx, 1)}
                                    />
                                </div>
                            </div>

                            <div className="form-col">
                                <div className='form-input has-label'>
                                    <label>Giá bán<label className='required'>*</label></label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Ví dụ: 200000"
                                        value={item.price_origin}
                                        onChange={(e) => inputPack(e, idx, 2)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='add-pack'>
                        <p className="btn-tiny btn-add" onClick={addInputPack}>Thêm quy cách</p>
                    </div>
                </div >

                <div className='card-post'>
                    <p className='title'>Thông tin liên hệ</p>

                    <div className="form-row two">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Tên liên hệ<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='contact_name'
                                    placeholder="Nhập tên liên hệ"
                                    ref={register({
                                        required: true,
                                    })}
                                />
                            </div>

                            {errors.contact_name && errors.contact_name.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>

                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Số điện thoại<label className='required'>*</label></label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    name="contact_phone"
                                    disabled={!!slug}
                                    placeholder="Nhập số điện thoại"
                                    ref={register({
                                        required: true,
                                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    })} />
                            </div>

                            {errors.contact_phone && errors.contact_phone.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }

                            {errors.contact_phone && errors.contact_phone.type === 'pattern' &&
                                <p className="message message-error">Số điện thoại chưa đúng</p>
                            }
                        </div>
                    </div>

                    <div className="form-row two">
                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Zalo<label className='required'>*</label></label>
                                <input
                                    type="number"
                                    autoComplete="off"
                                    name="contact_zalo"
                                    placeholder="Nhập số zalo"
                                    ref={register({
                                        required: true,
                                        pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    })} />
                            </div>
                            {errors.contact_zalo && errors.contact_zalo.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }

                            {errors.contact_zalo && errors.contact_zalo.type === 'pattern' &&
                                <p className="message message-error">Số zalo chưa đúng</p>
                            }
                        </div>

                        <div className="form-col">
                            <div className='form-input has-label'>
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='contact_address'
                                    placeholder="Nhập địa chỉ"
                                    ref={register({})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-cancel-submit">
                    <button type="button" className="btn btn-border" onClick={() => displayList()}>Huỷ</button>
                    <button type="submit" className="btn btn-green">{slug ? 'Lưu' : 'Đăng tin'}</button>
                </div>
            </form >
        </>
    )
}

export default PostProduct