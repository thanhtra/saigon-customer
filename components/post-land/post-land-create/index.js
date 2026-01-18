import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import NProgress from 'nprogress';
import {
    createLand, uploadImagesLand, removeImageByName,
    createImages, getMyPost, updateMyLandPost
} from 'lib/api/land.service';
import { CategoryType, Position } from 'lib/constants/data';
import ImageUploading from "react-images-uploading";
import clsx from 'clsx';
import Checkbox from 'components/common/checkbox';
import { AdministrativeUnits } from 'lib/constants/administrativeUnits';
import { getDistrictOption, getWardsOption } from 'lib/utils/index';


const PostLandCreate = ({ slug = '', displayList }) => {
    const { register, handleSubmit, errors, reset, setValue } = useForm();
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [wards, setWards] = useState([])
    const [district, setDistrict] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    const [isOwner, setIsOwner] = useState(true);
    const [landId, setLandId] = useState(null);
    const [collaId, setCollaId] = useState(null);
    const [savedImages, setSavedImages] = useState([]);
    const [landDetail, setLandDetail] = useState({});
    const [isHaveVideo, setIsHaveVideo] = useState(false);
    const [isEditDescription, setIsEditDescription] = useState(false);

    useEffect(() => {
        if (slug) {
            getLandDetail(slug);
        } else {
            getCategoriesHandle();
            reset();
            setWards([]);
            setDistrict('');
            setIsSubmited(false);
            setIsHaveVideo(false);
            setSavedImages([]);
            setImages([]);
            setIsOwner(true);
            setLandId(null);
            setCollaId(null);
            setLandDetail({});
        }
    }, [slug]);

    const getLandDetail = async (val) => {
        if (!val) return;
        await getCategoriesHandle();
        const res = await getMyPost(val);
        if (res?.success) {
            const land = res?.result;
            setLandId(land?.id);
            setCollaId(land?.contact?.id);

            if (land?.district) {
                setDistrict(land.district);
                setWards(getWardsOption(AdministrativeUnits, land.district));
            }

            reset({
                category_id: land?.category_id,
                district: land?.district,
                ward: land?.ward,
                address_detail: land?.address_detail,
                title: land?.title,
                // description: land?.description,
                acreage: land?.acreage,
                price: land?.price,
                contact_name: land?.contact?.name,
                contact_phone: land?.contact?.phone,
                contact_zalo: land?.contact?.zalo,
                contact_address: land?.contact?.address,
                commission: land?.commission
            });

            setIsOwner(land?.contact?.position === Position.Owner ? true : false)
            setIsHaveVideo(land?.is_have_video ? true : false)
            setSavedImages((land?.images || []).map((item) => item?.name));
            setLandDetail(land);
            NProgress.done();
        }
    }

    const selectDistrict = (e) => {
        if (!e.target.value) {
            return;
        }

        setValue('ward', '');
        setDistrict(e.target.value);
        setWards(getWardsOption(AdministrativeUnits, e.target.value));
    }

    const getCategoriesHandle = async () => {
        const query = { isPagin: false }

        const res = await getCategories(query);
        if (res?.success) {
            const vals = (res?.result?.data || []).filter(item => item.type === CategoryType.LAND);
            setCategories(vals);
        }
    }

    const onSubmit = async data => {
        setIsSubmited(true);

        if (landId) {
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
                    district: data?.district,
                    ward: data?.ward,
                    address_detail: data?.address_detail,
                    title: data?.title,
                    description: data?.description,
                    acreage: data?.acreage,
                    price: data?.price,
                    is_have_video: isHaveVideo,
                    commission: data?.commission,
                    contact_name: data?.contact_name,
                    contact_zalo: data?.contact_zalo,
                    contact_address: data?.contact_address,
                    is_contact_owner: isOwner
                }

                const updated = await updateMyLandPost(landId, payload);
                const { success: updateSuccess } = updated;


                // Bước upload hình ảnh và tạo hình ảnh trong db
                let errorUpload = false;

                if (images.length) {
                    let formData = new FormData();

                    (images || []).forEach((item) => {
                        formData.append('photos', item.file, item.file.name);
                    });

                    const resUpload = await uploadImagesLand(formData);
                    const { success: uploadSuccess, result: arrImageUploaded } = resUpload;

                    if (uploadSuccess && arrImageUploaded.length) {
                        const imagePayload = {
                            imageList: arrImageUploaded,
                            productId: landId,
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
                    toast.success("Cập nhật bất động sản thành công");
                } else {
                    const msg = "Cập nhật bất động sản thất bại.";
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
                toast.error("Cập nhật bất động sản thất bại.");
            }

        } else {
            try {
                if (images.length === 0 || images.length < 2 || images.length > 6) {
                    toast.error("Vui lòng kiểm tra thông tin hình ảnh. Nếu không tải hình được, bạn cần sao chép và mở link website ở Google để đăng tin hoặc liên hệ để được hỗ trợ.");
                    return;
                }

                NProgress.start();

                const landPayload = {
                    category_id: data?.category_id,
                    district: data?.district,
                    ward: data?.ward,
                    address_detail: data?.address_detail,
                    title: data?.title,
                    description: data?.description,
                    acreage: data?.acreage,
                    price: data?.price,
                    is_have_video: isHaveVideo,
                    contact_name: data?.contact_name,
                    contact_phone: data?.contact_phone,
                    contact_zalo: data?.contact_zalo,
                    contact_address: data?.contact_address,
                    is_contact_owner: isOwner ? true : false,
                    commission: data?.commission
                }

                const res = await createLand(landPayload);
                const { success, result: landCreated } = res;

                if (success) {
                    // Bước upload hình ảnh và tạo hình ảnh trong db

                    let errorUpload = false;
                    let formData = new FormData();

                    (images || []).forEach((item) => {
                        formData.append('photos', item.file, item.file.name);
                    });

                    const resUpload = await uploadImagesLand(formData);
                    const { success: uploadSuccess, result: arrImageUploaded } = resUpload;

                    if (uploadSuccess && arrImageUploaded.length) {
                        const imagePayload = {
                            imageList: arrImageUploaded,
                            productId: landCreated?.id,
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
                    // setMode('edit');
                    // setId(landCreated?.id);
                    setIsSubmited(false);
                    NProgress.done();
                    if (errorUpload) {
                        toast.error("Tải hình ảnh thất bại, vui lòng tải lại");
                    } else {
                        displayList();
                        toast.success("Tạo bất động sản thành công");
                    }
                } else {
                    setIsSubmited(false);
                    NProgress.done();
                    toast.error("Tạo bất động sản thất bại.");
                }

            } catch (err) {
                setIsSubmited(false);
                NProgress.done();
                toast.error("Tạo bất động sản thất bại.");
            }
        }
    }

    const chooseImage = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const chooseContactOwner = (e, type) => {
        if (type) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }

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

    return (
        <>
            <div className='p-header'>
                <p className='p-title'>{slug ? 'Chỉnh sửa bất động sản' : 'Tạo mới bất động sản'}</p>
            </div>

            <form className="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className='card-post'>
                    <p className='title'>Thông tin cơ bản</p>

                    <div className='form-row'>
                        <div className="form-group">
                            <div className="form-select has-label">
                                <label>Loại bất động sản<label className='required'>*</label></label>
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

                        <div className="form-group">
                            <div className="form-input">
                                <label>Tỉnh, thành phố</label>
                                <p className='province'>Đăk Nông</p>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <div className="form-select has-label">
                                <label>Quận, huyện<label className='required'>*</label></label>
                                <select
                                    onChange={selectDistrict}
                                    name="district"
                                    ref={register({
                                        required: true,
                                    })}
                                    defaultValue={''}
                                >
                                    <option value={''} hidden>Chọn</option>
                                    {getDistrictOption(AdministrativeUnits).map((dis, index) => (
                                        <option key={index} value={dis.id}>{dis.label}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.district && errors.district.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>

                        <div className="form-group">
                            <div className="form-select has-label">
                                <label>Phường, xã<label className='required'>*</label></label>
                                <select
                                    name="ward"
                                    disabled={!district}
                                    ref={register({
                                        required: true,
                                    })}
                                    defaultValue={''}
                                >
                                    <option value={''} hidden>Chọn</option>
                                    {wards.map((prov, index) => (
                                        <option key={index} value={prov.id}>{prov.label}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.ward && errors.ward.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <div className='form-input has-label'>
                                <label>Địa chỉ chi tiết<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='address_detail'
                                    placeholder="Nhập tên đường, hẻm, ngách, ngõ,..."
                                    ref={register({
                                        required: true,
                                    })}
                                />
                            </div>

                            {errors.address_detail && errors.address_detail.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>
                </div>

                <div className='card-post'>
                    <p className='title'>Thông tin bài viết</p>

                    <div className='form-row'>
                        <div className="form-group">
                            <div className='form-textarea'>
                                <label>Tiêu đề<label className='required'>*</label></label>
                                <label className='note'>Tối thiểu 10 ký tự, tối đa 90 ký tự</label>
                                <textarea
                                    name="title"
                                    rows={4}
                                    placeholder='Ví dụ: 2ha đất cà phê tại Đăk Rlấp'
                                    ref={register({
                                        required: true,
                                        minLength: 10,
                                        maxLength: 90
                                    })}
                                />
                            </div>

                            {errors.title && errors.title.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                            {errors.title && errors.title.type === 'minLength' &&
                                <p className="message message-error">Tiêu đề quá ngắn</p>
                            }
                            {errors.title && errors.title.type === 'maxLength' &&
                                <p className="message message-error">Tiêu đề quá dài</p>
                            }
                        </div>
                    </div>

                    <div className='form-row'>
                        {
                            !!slug && !isEditDescription ? <div className="form-group">
                                <div className='des-group-lbl'>
                                    <label>Mô tả<label className='required'>*</label></label>
                                    <button type="button" class="btn-tiny" onClick={() => editDescription(true)}>Thay đổi</button>
                                </div>

                                <div dangerouslySetInnerHTML={{ __html: landDetail?.description }} className='description-detail' />
                            </div> :
                                <div className="form-group">
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
                                            placeholder='Mô tả chi tiết về bất động sản. Ví dụ: ngôi nhà có vị trí thuận lợi, cách chợ 1km...'
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
                </div>

                <div className='card-post'>
                    <p className='title'>Thông tin bất động sản</p>

                    <div className="form-row">
                        <div className="form-group">
                            <div className='form-input has-label'>
                                <label>Diện tích<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='acreage'
                                    placeholder="Ví dụ: 2ha"
                                    ref={register({
                                        required: true,
                                    })}
                                />
                            </div>

                            {errors.acreage && errors.acreage.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>

                        <div className="form-group">
                            <div className='form-input has-label'>
                                <label>Giá bán<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='price'
                                    placeholder="Ví dụ: 2 tỷ"
                                    ref={register({
                                        required: true,
                                    })}
                                />
                            </div>

                            {errors.price && errors.price.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
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
                                                <div key={image} className='image-item' style={{ backgroundImage: "url(" + `${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/land/` + image + ")" }} >
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

                        <div className="form-group">
                            <label>Video</label>
                            <label className='note'>Chọn nếu bạn có video về bất động sản, chúng tôi sẽ liên hệ để đăng tải</label>

                            <Checkbox
                                key={111}
                                name='is_have_video'
                                label='Có video bất động sản'
                                value={isHaveVideo}
                                checked={isHaveVideo}
                                onChange={checkIsHaveVideo}
                            />
                        </div>
                    </div>
                </div >

                <div className='card-post'>
                    <p className='title'>Thông tin liên hệ</p>

                    <div className="form-row">
                        <div className="form-group">
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

                        <div className="form-group">
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

                    <div className="form-row">
                        <div className="form-group">
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

                        <div className="form-group">
                            <div className='form-input has-label'>
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='contact_address'
                                    placeholder="Nhập địa chỉ"
                                    {...register('contact_address')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Thông tin liên hệ là<label className='required'>*</label></label>
                            <div className='broker-owner'>
                                <Checkbox
                                    key={321}
                                    checked={isOwner === true}
                                    label='Chủ sở hữu'
                                    onChange={e => chooseContactOwner(e, true)}
                                />
                            </div>
                            <div className='broker-owner'>
                                <Checkbox
                                    key={123}
                                    checked={isOwner === false}
                                    label='Môi giới'
                                    onChange={e => chooseContactOwner(e, false)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className='form-input has-label'>
                                <label>Hoa hồng cho người giới thiệu<label className='required'>*</label></label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    name='commission'
                                    placeholder="Ví dụ: 2%"
                                    ref={register({
                                        required: true,
                                    })}
                                />
                            </div>

                            {errors.commission && errors.commission.type === 'required' &&
                                <p className="message message-error">Vui lòng nhập thông tin</p>
                            }
                        </div>
                    </div>
                </div>

                <div className="action-cancel-submit">
                    <button type="button" className="btn btn-border" onClick={() => displayList()}>Huỷ</button>
                    <button type="submit" className="btn">{slug ? 'Lưu' : 'Đăng tin'}</button>
                </div>
            </form >
        </>
    )
}

export default PostLandCreate