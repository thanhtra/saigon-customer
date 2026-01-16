'use client';

import InputField from 'components/common/form/InputField';
import LocationSelect from 'components/common/location-select';
import { convertObjectToOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
    createImages,
    createRoom,
    getMyPost,
    updateMyRoomPost,
    uploadImagesRoom
} from 'lib/api/room.api';

import { getMyBoardingHouses, createBoardingHouses } from 'lib/api/rental.api';

import RadioGroupCheckbox from 'components/common/form/RadioGroupCheckbox';
import SelectField from 'components/common/form/SelectField';
import InputFieldCurrency from 'components/common/form/InputFieldCurrency';
import { mapRoomFormToDto } from 'components/post-room/service';
import { Position, RentalType, RentalTypeLabels } from 'lib/constants/data';
import { buildSelectOptions, buildSelectOptionsFromList } from 'lib/utils';

import {
    DEFAULT_PROVINCE_ID,
    DEFAULT_DISTRICT_ID,
} from 'lib/locations/const';


const BoardingHouseMode = {
    SELECT_EXISTING: 'select_existing',
    CREATE_NEW: 'create_new',
};

export const BoardingHouseModeOptions = {
    [BoardingHouseMode.SELECT_EXISTING]: 'Chọn nhà trọ đã có',
    [BoardingHouseMode.CREATE_NEW]: 'Tạo nhà trọ mới',
};

const RentalTypeOptions = buildSelectOptions(
    RentalTypeLabels,
    '-- Chọn loại hình cho thuê --'
);


const PostRoomCreate = ({ slug = '', displayList }) => {
    const [images, setImages] = useState([]);
    const [savedImages, setSavedImages] = useState([]);
    const [isHaveVideo, setIsHaveVideo] = useState(false);
    const [isOwner, setIsOwner] = useState(true);
    const [roomId, setRoomId] = useState(null);
    const [boardingHouses, setBoardingHouses] = useState([]);
    const [loadingBoardingHouses, setLoadingBoardingHouses] = useState(false);

    const fetchedRef = useRef(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            rental_type: '',
            boarding_mode: null,
            boarding_house_id: '',

            location: {
                province: '',
                district: '',
                ward: '',
                street: '',
                house_number: '',
                address_detail: '',
                address_detail_display: '',
            },

            fee: {
                electric: null,
                water: null,
                wifi: null,
                service: null,
                parking: null,
                other: '',
            },

            room: {
                title: '',
                price: null,
                area: '',
                floor: '',
                room_number: '',
                description: '',
            },
        },
    });

    const rentalType = useWatch({
        control,
        name: 'rental_type',
    });
    const boardingMode = useWatch({
        control,
        name: 'boarding_mode',
    });
    const selectedBoardingHouseId = useWatch({
        control,
        name: 'boarding_house_id',
    });

    useEffect(() => {
        if (!slug) return;

        let mounted = true;

        (async () => {
            try {
                NProgress.start();
                const res = await getMyPost(slug);

                if (!mounted || !res?.success) return;

                const r = res.result;

                setRoomId(r.id);
                setIsOwner(r.contact?.position === Position.Owner);
                setSavedImages((r.images || []).map(i => i.name));

                reset({
                    rental_type: r.rental_type || '',

                    location: {
                        province: r.province || '',
                        district: r.district || '',
                        ward: r.ward || '',
                        address_detail: r.address_detail || '',
                    },

                    post: {
                        title: r.title || '',
                        description: r.description || '',
                    },

                    property: {
                        acreage: r.acreage || '',
                        price: r.price || '',
                    },

                });
            } catch (e) {
                toast.error('Không tải được dữ liệu bài đăng');
            } finally {
                NProgress.done();
            }
        })();

        return () => {
            mounted = false;
        };
    }, [slug, reset]);

    useEffect(() => {
        if (rentalType !== RentalType.BOARDING_HOUSE) return;
        // if (fetchedRef.current) return;

        fetchedRef.current = true;

        let mounted = true;

        (async () => {
            try {
                setLoadingBoardingHouses(true);
                const res = await getMyBoardingHouses();
                if (!mounted || !res?.success) return;

                const list = res.result || [];
                setBoardingHouses(list);

                if (list.length === 0) {
                    setValue('boarding_mode', BoardingHouseMode.CREATE_NEW);
                    setValue('boarding_house_id', '');
                } else {
                    setValue('boarding_mode', BoardingHouseMode.SELECT_EXISTING);
                    setValue('boarding_house_id', '');
                }
            } catch {
                toast.error('Không tải được danh sách nhà trọ');
            } finally {
                setLoadingBoardingHouses(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [rentalType, setValue]);

    useEffect(() => {
        fetchedRef.current = false;
    }, [rentalType]);

    useEffect(() => {
        if (!rentalType) return;

        setValue('location.province', String(DEFAULT_PROVINCE_ID), {
            shouldDirty: false,
        });

        setValue('location.district', String(DEFAULT_DISTRICT_ID), {
            shouldDirty: false,
        });
    }, [rentalType, setValue]);

    useEffect(() => {
        if (!boardingMode) return;

        setValue('boarding_house_id', '', {
            shouldDirty: true,
            shouldValidate: true,
        });
    }, [boardingMode, setValue]);


    const resetLocationAndFee = (setValue) => {
        setValue('location', {
            province: '',
            district: '',
            ward: '',
            street: '',
            house_number: '',
            address_detail: '',
            address_detail_display: '',
        }, { shouldDirty: false });

        setValue('fee', {
            electric: null,
            water: null,
            wifi: null,
            service: null,
            parking: null,
            other: '',
        }, { shouldDirty: false });
    };

    const submitLabel = useMemo(() => {
        if (!rentalType) return '';
        if (slug) return 'Lưu';

        if (
            rentalType === RentalType.BOARDING_HOUSE &&
            boardingMode === BoardingHouseMode.CREATE_NEW
        ) {
            return 'Tạo nhà trọ mới';
        }

        return 'Đăng tin';
    }, [rentalType, boardingMode, slug]);

    const boardingHouseOptions = useMemo(
        () =>
            buildSelectOptionsFromList(boardingHouses, {
                labelKey: 'address',
                valueKey: 'id',
                placeholder: '-- Chọn nhà trọ --',
            }),
        [boardingHouses],
    );

    const canSubmit = useMemo(() => {
        if (!rentalType) return false;

        // Không phải nhà trọ → cho submit
        if (rentalType !== RentalType.BOARDING_HOUSE) return true;

        // Nhà trọ - tạo mới
        if (boardingMode === BoardingHouseMode.CREATE_NEW) return false;

        // Nhà trọ - chọn nhà trọ
        if (boardingMode === BoardingHouseMode.SELECT_EXISTING) {
            return !!selectedBoardingHouseId;
        }

        // Chưa chọn mode → disable
        return false;
    }, [rentalType, boardingMode, selectedBoardingHouseId]);

    const isBoardingHouse = rentalType === RentalType.BOARDING_HOUSE;
    const showCommonInfo = !isBoardingHouse || boardingMode === BoardingHouseMode.CREATE_NEW;
    const hasBoardingHouse = boardingHouses.length > 0;
    const showRoomForm =
        !isBoardingHouse ||
        (boardingMode === BoardingHouseMode.SELECT_EXISTING && !!selectedBoardingHouseId);
    const isCreateBoardingHouse = rentalType === RentalType.BOARDING_HOUSE && boardingMode === BoardingHouseMode.CREATE_NEW
    const isCreateRoom = rentalType === RentalType.BOARDING_HOUSE && !!selectedBoardingHouseId;

    const displaySubmit = useMemo(() => {
        // Chưa chọn loại hình → không hiển thị
        if (!rentalType) return false;

        // Không phải nhà trọ → luôn hiển thị
        if (rentalType !== RentalType.BOARDING_HOUSE) return true;

        // Nhà trọ - tạo mới → KHÔNG hiển thị
        if (boardingMode === BoardingHouseMode.CREATE_NEW) return false;

        // Nhà trọ - chọn nhà trọ → chỉ hiển thị khi đã chọn
        if (boardingMode === BoardingHouseMode.SELECT_EXISTING) {
            return !!selectedBoardingHouseId;
        }

        return false;
    }, [rentalType, boardingMode, selectedBoardingHouseId]);

    const handleCreateBoardingHouse = async () => {
        NProgress.start();

        try {
            const formData = getValues();
            const location = formData.location;
            const fee = formData.fee;

            const res = await createBoardingHouses({
                province: location.province,
                district: location.district,
                ward: location.ward,
                street: location.street,
                house_number: location.house_number,
                address_detail: location.address_detail,
                address_detail_display: location.address_detail_display,
                fee_electric: fee.electric,
                fee_water: fee.water,
                fee_wifi: fee.wifi,
                fee_service: fee.service,
                fee_parking: fee.parking,
                fee_other: fee.other,
            });

            if (!res?.success) {
                if (res.message === 'BOARDING_HOUSE_ADDRESS_ALREADY_EXISTS') {
                    toast.error('Bạn đã tạo nhà trọ với địa chỉ nhày');
                } else {
                    toast.error('Tạo nhà trọ thất bại');
                }

                return;
            }

            const newHouse = {
                id: res.result.rental.id,
                address: res.result.rental.address_detail,
            };

            resetLocationAndFee(setValue);
            setBoardingHouses(prev => [newHouse, ...prev]);

            setValue('boarding_mode', BoardingHouseMode.SELECT_EXISTING);
            setValue('boarding_house_id', newHouse.id);

            toast.success('Tạo nhà trọ thành công, hãy tiếp tục tạo phòng');

        } catch (error) {
            console.error(error);
            toast.error('Có lỗi khi tạo nhà trọ');
        } finally {
            NProgress.done();
        }
    };

    const onSubmit = useCallback(
        async (formData) => {

            if (
                rentalType === RentalType.BOARDING_HOUSE &&
                boardingMode === BoardingHouseMode.SELECT_EXISTING &&
                !formData.boarding_house_id
            ) {
                toast.warning('Vui lòng chọn nhà trọ');
                return;
            }

            NProgress.start();

            try {
                const dto = mapRoomFormToDto(formData);

                const res = roomId
                    ? await updateMyRoomPost(roomId, dto)
                    : await createRoom(dto);

                if (!res?.success) {
                    toast.error('Đăng tin thất bại');
                    return;
                }

                const postId = roomId || res.result.id;

                // ===== OPTIONAL: UPLOAD IMAGES =====
                if (images.length > 0) {
                    try {
                        const fd = new FormData();
                        images.forEach(img =>
                            fd.append('photos', img.file, img.file.name)
                        );

                        const upload = await uploadImagesRoom(fd);

                        if (upload?.success) {
                            await createImages({
                                imageList: upload.result,
                                productId: postId,
                                type: 'BatDongSan',
                            });
                        }
                    } catch {
                        toast.warning('Đăng tin thành công nhưng upload ảnh thất bại');
                    }
                }

                toast.success(roomId ? 'Cập nhật thành công' : 'Đăng tin thành công');
                displayList();

            } catch (err) {
                console.error(err);
                toast.error('Có lỗi xảy ra');
            } finally {
                NProgress.done();
            }
        },
        [
            rentalType,
            boardingMode,
            images,
            isHaveVideo,
            isOwner,
            roomId,
            displayList,
        ]
    );

    return (
        <form
            className="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div className="card-post">
                <p className="title">Loại hình cho thuê</p>

                <div className="form-row">
                    <SelectField
                        label="Loại hình cho thuê"
                        name="rental_type"
                        control={control}
                        options={RentalTypeOptions}
                        required
                    />
                </div>
            </div >

            {rentalType && <>

                {isBoardingHouse && (
                    <div className="card-post">
                        <p className="title">Chọn nhà trọ</p>

                        <div className="form-row inline">
                            <RadioGroupCheckbox
                                label="Quản lý nhà trọ"
                                name="boarding_mode"
                                required
                                options={convertObjectToOptions(BoardingHouseModeOptions)}
                                control={control}
                                inline
                                disabled={loadingBoardingHouses}
                            />
                        </div>

                        {boardingMode === BoardingHouseMode.SELECT_EXISTING && hasBoardingHouse && (
                            <div className="form-row inline">
                                <SelectField
                                    label="Nhà trọ của bạn"
                                    name="boarding_house_id"
                                    control={control}
                                    options={boardingHouseOptions}
                                    required
                                />
                            </div>
                        )}

                    </div>
                )}

                {showRoomForm && (
                    <div className="card-post">
                        <p className="title">{isCreateRoom ? 'Tạo phòng trọ (Tin đăng)' : 'Tạo tin đăng'} </p>

                        <div className="form-row inline">
                            <InputField
                                label="Tiêu đề"
                                name="room.title"
                                control={control}
                                required
                                rules={{ required: 'Vui lòng nhập tiêu đề' }}
                            />
                        </div>

                        <div className="form-row">
                            <InputFieldCurrency
                                label="Giá thuê (VNĐ/tháng)"
                                name="room.price"
                                type="number"
                                control={control}
                                required
                                rules={{ required: 'Vui lòng nhập giá thuê' }}
                            />

                            <InputField
                                label="Diện tích (m²)"
                                name="room.area"
                                type="number"
                                control={control}
                            />
                        </div>

                        {
                            rentalType === RentalType.APARTMENT && (
                                <>
                                    <div className="form-row">
                                        <InputField
                                            label="Tầng"
                                            name="rental.floor"
                                            type="number"
                                            control={control}
                                            required
                                            rules={{ required: 'Vui lòng nhập tầng' }}
                                        />

                                        <InputField
                                            label="Số căn trong toà nhà"
                                            name="rental.room_number"
                                            control={control}
                                            placeholder="Ví dụ: A12.03"
                                        />
                                    </div>
                                </>
                            )
                        }

                        <div className="form-row">
                            <InputField
                                label="Số người tối đa (nếu có)"
                                name="room.max_people"
                                type="number"
                                control={control}
                            />
                        </div>

                        {/* ===== AMENITIES + IMAGES ===== */}
                        <div className="form-row">
                            {/* Amenities – bạn gắn component hiện có */}
                            {/* <AmenityCheckbox control={control} name="rental.amenities" /> */}

                            {/* Images – bạn đã xử lý ở ngoài */}
                            {/* <RoomImageUpload ... /> */}
                        </div>

                        {/* ===== DESCRIPTION ===== */}
                        <div className="form-row inline textarea-input">
                            <InputField
                                label="Mô tả chi tiết"
                                name="rental.description_detail"
                                type="textarea"
                                rows={6}

                                control={control}
                                rules={{
                                    required: 'Vui lòng nhập mô tả chi tiết',
                                    minLength: {
                                        value: 10,
                                        message: 'Mô tả tối thiểu 10 ký tự',
                                    },
                                }}
                            />
                        </div>
                    </div>
                )}

                {((showCommonInfo || showRoomForm) && !selectedBoardingHouseId) && (
                    <>
                        <div className="card-post">
                            <p className="title">Địa chỉ nhà</p>
                            <LocationSelect
                                control={control}
                                setValue={setValue}
                                errors={errors}
                            />
                        </div>
                        <div className="card-post">
                            <p className="title">Phí</p>

                            <div className="form-row">
                                <InputFieldCurrency
                                    label="Điện (đ/kWh)"
                                    name="fee.electric"
                                    type="number"
                                    placeholder="Để trống nếu miễn phí"
                                    control={control}
                                    inputProps={{ min: 0, step: 500 }}
                                />

                                <InputFieldCurrency
                                    label="Nước (đ/m³)"
                                    name="fee.water"
                                    type="number"
                                    placeholder="Để trống nếu miễn phí"
                                    control={control}
                                    inputProps={{ min: 0, step: 1000 }}
                                />
                            </div>

                            <div className="form-row">
                                <InputFieldCurrency
                                    label="Wifi (đ/tháng)"
                                    name="fee.wifi"
                                    type="number"
                                    placeholder="Để trống nếu miễn phí"
                                    control={control}
                                    inputProps={{ min: 0, step: 1000 }}
                                />

                                <InputFieldCurrency
                                    label="Phí gửi xe (đ/tháng)"
                                    name="fee.parking"
                                    type="number"
                                    placeholder="Để trống nếu miễn phí"
                                    control={control}
                                    inputProps={{ min: 0, step: 1000 }}
                                />
                            </div>

                            <div className="form-row">
                                <InputFieldCurrency
                                    label="Phí dịch vụ (đ/tháng)"
                                    name="fee.service"
                                    type="number"
                                    placeholder="Để trống nếu miễn phí"
                                    control={control}
                                    inputProps={{ min: 0, step: 1000 }}
                                />

                                <InputField
                                    label="Phí khác"
                                    name="fee.other"
                                    placeholder="VD: vệ sinh, bảo vệ (có thể bỏ trống)"
                                    control={control}
                                />
                            </div>

                            <p className="hint">
                                * Các khoản phí để trống sẽ được hiểu là <strong>miễn phí</strong>
                            </p>
                        </div>
                    </>
                )}

                <div className="action-cancel-submit">
                    <button
                        type="button"
                        className="btn btn-border"
                        onClick={displayList}
                    >
                        Huỷ
                    </button>

                    {/* TẠO DÃY TRỌ */}
                    {isCreateBoardingHouse && (
                        <button
                            type="button"
                            className="btn"
                            onClick={handleCreateBoardingHouse}
                        >
                            Tạo nhà trọ mới
                        </button>
                    )}

                    {/* TẠO PHÒNG / ĐĂNG TIN */}
                    {displaySubmit && (
                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting || !canSubmit}
                        >
                            {submitLabel}
                        </button>
                    )}
                </div>
            </>}

        </form>
    );
};

export default PostRoomCreate;
