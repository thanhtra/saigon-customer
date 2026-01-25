
import InputField from 'components/common/form/InputField';
import LocationSelect from 'components/common/location-select';
import {
    createRoom,
    getMyPost
} from 'lib/api/room.api';
import { convertObjectToOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

import { createBoardingHouses, getMyBoardingHouses } from 'lib/api/rental.api';

import FormAmenityCheckbox from 'components/common/form-amenity-checkbox';
import FormImageUpload from 'components/common/form-image-upload';
import InputFieldCurrency from 'components/common/form/InputFieldCurrency';
import RadioGroupCheckbox from 'components/common/form/RadioGroupCheckbox';
import SelectField from 'components/common/form/SelectField';
import { createUnitRental } from 'lib/api/rental.api';
import { updateRoom } from 'lib/api/room.api';
import useUploadImages from 'lib/api/upload.api';
import { UploadDomain, WaterUnit } from 'lib/constants/tech';
import { buildSelectOptionsFromList } from 'lib/utils';

import CardSelectField from 'components/common/card-select-field';
import { RentalType } from 'lib/constants/data';
import { RentalTypeOptions } from 'lib/constants/rental-type.options';
import { PageUrl, ProfileTab } from 'lib/constants/tech';
import { useRouter } from 'next/router';


import {
    DEFAULT_DISTRICT_ID,
    DEFAULT_PROVINCE_ID,
} from 'lib/locations/const';


const BoardingHouseMode = {
    SELECT_EXISTING: 'select_existing',
    CREATE_NEW: 'create_new',
};

export const BoardingHouseModeOptions = {
    [BoardingHouseMode.SELECT_EXISTING]: 'Chọn nhà trọ đã có',
    [BoardingHouseMode.CREATE_NEW]: 'Tạo nhà trọ mới',
};

const per_m3 = 'per_m3';

const PostRoomCreate = ({ slug = '', displayList }) => {
    const fetchedRef = useRef(false);
    const [boardingHouses, setBoardingHouses] = useState([]);
    const [loadingBoardingHouses, setLoadingBoardingHouses] = useState(false);
    const [loading, setLoading] = useState(false);
    const { uploadImages, loading: uploading } = useUploadImages();
    const router = useRouter();
    const [creatingBoardingHouses, setCreateBoardingHouses] = useState(false);


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
                water_unit: WaterUnit.PerM3
            },

            room: {
                title: '',
                price: null,
                deposit: null,
                area: null,
                floor: null,
                room_number: '',
                max_people: null,
                description: '',
                amenities: [],
                images: [],
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

    // useEffect(() => {
    //     if (rentalType !== RentalType.BOARDING_HOUSE) return;

    //     if (boardingHouses.length === 0) {
    //         setValue('boarding_mode', BoardingHouseMode.CREATE_NEW);
    //         setValue('boarding_house_id', ''); // Xóa giá trị nếu không có nhà trọ
    //     } else {
    //         setValue('boarding_mode', BoardingHouseMode.SELECT_EXISTING);
    //         // setValue('boarding_house_id', boardingHouses[0]?.id || ''); // Điền ID nhà trọ đã chọn
    //     }
    // }, [rentalType, boardingHouses, setValue]);


    const isBoardingHouse = rentalType === RentalType.BOARDING_HOUSE;
    const showCommonInfo = !isBoardingHouse || boardingMode === BoardingHouseMode.CREATE_NEW;
    const hasBoardingHouse = boardingHouses.length > 0;
    const showRoomForm = !isBoardingHouse || (boardingMode === BoardingHouseMode.SELECT_EXISTING && !!selectedBoardingHouseId);
    const isCreateBoardingHouse = rentalType === RentalType.BOARDING_HOUSE && boardingMode === BoardingHouseMode.CREATE_NEW

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
            water_unit: WaterUnit.PerM3
        }, { shouldDirty: false });
    };

    const handleCreateBoardingHouse = async () => {
        NProgress.start();
        setCreateBoardingHouses(true);

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
                water_unit: fee.water_unit,
                fee_wifi: fee.wifi,
                fee_service: fee.service,
                fee_parking: fee.parking,
                fee_other: fee.other,
            });

            if (!res?.success) {
                if (res.message === 'BOARDING_HOUSE_ADDRESS_ALREADY_EXISTS') {
                    toast.error('Bạn đã tạo nhà trọ với địa chỉ nhày');
                } else if (res.message === 'USER_IS_NOT_COLLABORATOR') {
                    toast.error('Bạn chưa đăng kí cộng tác. Hãy liên hệ admin để được hỗ trợ');
                } else {
                    toast.error('Tạo nhà trọ thất bại');
                }

                setCreateBoardingHouses(false);
                return;
            }

            const newHouse = {
                id: res.result.id,
                address: res.result.address_detail,
            };

            setBoardingHouses(prev => [newHouse, ...prev]);

            resetLocationAndFee(setValue);

            setValue('boarding_mode', BoardingHouseMode.SELECT_EXISTING);
            setValue('boarding_house_id', newHouse.id);

            toast.success('Tạo nhà trọ thành công, hãy tiếp tục tạo phòng');

        } catch (error) {
            toast.error('Có lỗi khi tạo nhà trọ');
        } finally {
            setCreateBoardingHouses(false);
            NProgress.done();
        }
    };

    const uploadRoomImages = async ({ roomId, images, uploadImages }) => {
        if (!roomId || !images?.length) return;

        const hasCover = images.some(img => img.isCover);

        const files = images.map((img, index) => ({
            file: img.file,
            is_cover: img.isCover || (index === 0 && !hasCover),
        }));

        const uploadRes = await uploadImages(files, {
            domain: UploadDomain.Rooms,
            room_id: roomId,
        });

        if (!uploadRes?.success) {
            throw new Error('UPLOAD_FAILED');
        }
    };



    const onSubmit = async (data) => {
        const {
            boarding_house_id,
            rental_type,
            location,
            fee,
            room
        } = data;

        if (!room?.images?.length) {
            toast.error('Cần ít nhất 1 hình ảnh');
            return;
        }

        setLoading(true);
        NProgress.start();

        try {
            /* =====================================================
             * CASE 1: NHÀ TRỌ → CHỌN NHÀ → TẠO ROOM
             * ===================================================== */

            if (rental_type === RentalType.BOARDING_HOUSE) {

                if (!boarding_house_id) {
                    toast.warning('Vui lòng chọn nhà trọ');
                    setLoading(false);
                    return;
                }

                const res = await createRoom({
                    rental_id: boarding_house_id,
                    title: room.title,
                    room_number: room.room_number,
                    price: Number(room.price),
                    deposit: Number(room.deposit),
                    description: room.description,
                    amenities: room.amenities,
                    ...(room?.area && { area: Number(room.area) }),
                    ...(room?.max_people && { max_people: Number(room.max_people) }),
                    ...(room?.floor && { floor: Number(room.floor) })
                });

                if (!res?.success || !res.result?.id) {
                    toast.error('Tạo phòng thất bại');
                    setLoading(false);
                    return;
                }

                const roomId = res.result.id;

                await uploadRoomImages({
                    roomId,
                    images: room.images,
                    uploadImages,
                });

                toast.success('Tạo phòng thành công');
                reset();

                setLoading(false);
                return;
            }

            /* =====================================================
             * CASE 2: KHÔNG PHẢI NHÀ TRỌ → TẠO RENTAL + ROOM
             * ===================================================== */
            const payload = {
                rental_type: rental_type,

                // ADDRESS
                province: location.province,
                district: location.district,
                ward: location.ward,
                street: location.street,
                house_number: location.house_number,
                address_detail: location.address_detail,
                address_detail_display: location.address_detail_display,

                // FEE
                fee_electric: fee.electric,
                fee_water: fee.water,
                water_unit: fee.water_unit,
                fee_wifi: fee.wifi,
                fee_service: fee.service,
                fee_parking: fee.parking,
                fee_other: fee.other,

                // ROOM
                title: room.title,
                price: room.price ? Number(room.price) : undefined,
                deposit: room.deposit ? Number(room.deposit) : undefined,
                floor: room.floor,
                room_number: room.room_number,
                area: room.area ? Number(room.area) : undefined,
                max_people: room.max_people ? Number(room.max_people) : undefined,
                amenities: room.amenities,
                description: room.description,
            };

            const res = await createUnitRental(payload);

            if (!res?.success) {
                toast.error('Tạo tin thất bại');
                setLoading(false);
                return;
            }

            const roomId = res.result?.roomId;

            if (roomId) {
                await uploadRoomImages({
                    roomId,
                    images: room.images,
                    uploadImages,
                });
            }

            toast.success('Tạo tin cho thuê thành công');
            reset();

            router.push(`${PageUrl.Profile}?tab=${ProfileTab.ManagePostRental}`)

        } catch (err) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
            NProgress.done();
        }
    };


    return (
        <form
            className="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <div className="card-post">
                <p className="title">Loại hình cho thuê</p>

                <CardSelectField
                    label="Loại hình cho thuê"
                    name="rental_type"
                    control={control}
                    options={RentalTypeOptions}
                    required
                />
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

                        {
                            boardingMode === BoardingHouseMode.SELECT_EXISTING && (
                                hasBoardingHouse ?
                                    <div className="form-row inline">
                                        <SelectField
                                            label="Nhà trọ của bạn"
                                            name="boarding_house_id"
                                            control={control}
                                            options={boardingHouseOptions}
                                            required
                                        />
                                    </div> :
                                    "Bạn chưa có nhà trọ, hãy tạo mới"
                            )
                        }
                    </div>
                )}

                {showRoomForm && (
                    <div className="card-post">
                        <p className="title">Tạo tin đăng</p>

                        <div className="form-row inline">
                            <InputField
                                label="Tiêu đề"
                                placeholder="VD: Phòng trọ đẹp full nội thất gần ĐH Bách Khoa"
                                name="room.title"
                                control={control}
                                required
                                rules={{ required: 'Vui lòng nhập tiêu đề' }}
                            />
                        </div>


                        <div className="form-row four">
                            <InputFieldCurrency
                                label="Giá thuê (VNĐ/tháng)"
                                name="room.price"
                                type="number"
                                control={control}
                                required
                                rules={{ required: 'Vui lòng nhập giá thuê' }}
                            />

                            <InputFieldCurrency
                                label="Cọc giữ chỗ (VNĐ)"
                                name="room.deposit"
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

                            <InputField
                                label="Số người tối đa"
                                name="room.max_people"
                                type="number"
                                control={control}
                            />
                        </div>

                        {
                            (rentalType === RentalType.APARTMENT || rentalType === RentalType.BOARDING_HOUSE) && (
                                <>
                                    <div className="form-row">
                                        <InputField
                                            label="Tầng"
                                            name="room.floor"
                                            placeholder="Để trống nếu tầng trệt"
                                            type="number"
                                            control={control}
                                        />

                                        <InputField
                                            label="Số căn trong toà nhà"
                                            name="room.room_number"
                                            control={control}
                                            placeholder="Ví dụ: A12.03"
                                        />
                                    </div>
                                </>
                            )
                        }

                        <div className="form-row inline">
                            <FormAmenityCheckbox
                                name="room.amenities"
                                control={control}
                            />
                        </div>

                        <div className="form-row inline flex-column">
                            <Controller
                                name="room.images"
                                control={control}
                                defaultValue={[]}
                                rules={{
                                    validate: {
                                        minImages: value => value.length > 0 || 'Vui lòng tải lên ít nhất 1 hình ảnh',
                                        maxImages: value => value.length <= 10 || 'Tối đa chỉ được tải lên 10 hình ảnh',
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <FormImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            label="Hình ảnh phòng"
                                        />
                                        {/* Hiển thị thông báo lỗi nếu có */}
                                        {fieldState?.error && (
                                            <p className="upload-error-message message message-error">
                                                {fieldState?.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>


                        <div className="form-row inline textarea-input">
                            <InputField
                                label="Mô tả chi tiết"
                                name="room.description"
                                placeholder='VD: Phòng gần tiện ích chợ, bách hoá xanh, cách công viên Làng Hoa 200m'
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
                                required
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

                                <div className="form-row inline-p0">
                                    <InputFieldCurrency
                                        label="Nước"
                                        name="fee.water"
                                        type="number"
                                        placeholder="Để trống nếu miễn phí"
                                        control={control}
                                        inputProps={{ min: 0, step: 1000 }}
                                    />

                                    <SelectField
                                        label="Đơn vị"
                                        name="fee.water_unit"
                                        control={control}
                                        options={[
                                            { label: 'đ / m³', value: 'per_m3' },
                                            { label: 'đ / người', value: 'per_person' },
                                        ]}
                                    />
                                </div>

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

                    {isCreateBoardingHouse && (
                        <button
                            type="button"
                            className="btn"
                            onClick={handleCreateBoardingHouse}
                            disabled={creatingBoardingHouses}
                        >
                            {creatingBoardingHouses ? 'Đang lưu...' : 'Tạo nhà trọ mới'}
                        </button>
                    )}

                    {displaySubmit && (
                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting || !canSubmit || loading || uploading}
                        >
                            {loading ? "Đang lưu..." : submitLabel}
                        </button>
                    )}
                </div>
            </>}

        </form>
    );
};

export default PostRoomCreate;
