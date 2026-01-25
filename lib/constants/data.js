import {
    RoomRentalIcon,
    ApartmentIcon,
    HouseIcon,
    ShopIcon,
} from 'lib/utils/icon';
import { WaterUnit } from './tech';

export const OrderStatus = {
    new: 'Chờ xác nhận',
    confirmed: 'Chờ lấy hàng',
    delivered: 'Đang giao',
    completed: 'Đã giao',
    canceled: 'Đã huỷ'
}

export const RentalStatus = {
    New: 'new',               // Nhà mới được tạo, chưa xác nhận
    Confirmed: 'confirmed',   // Nhà đã được admin xác nhận
    Update: 'update',         // Nhà đã được chỉnh sửa sau khi tạo
    Cancelled: 'cancelled',   // Nhà đã bị huỷ hoặc xoá
}

export const RoomStatus = {
    PENDING_APPROVAL: 'pending_approval',
    AVAILABLE: 'available',
    RENTED: 'rented',
    MAINTENANCE: 'maintenance',
    DISABLED: 'disabled',
};

export const RoomStatusLabels = {
    [RoomStatus.PENDING_APPROVAL]: 'Chờ duyệt',
    [RoomStatus.AVAILABLE]: 'Trống',
    [RoomStatus.RENTED]: 'Đã thuê',
    [RoomStatus.MAINTENANCE]: 'Bảo trì',
    [RoomStatus.DISABLED]: 'Vô hiệu hoá',
};

export const RoomStatusLabelsCustomer = {
    // [RoomStatus.PENDING_APPROVAL]: 'Chờ duyệt',
    [RoomStatus.AVAILABLE]: 'Trống',
    [RoomStatus.RENTED]: 'Đã cho thuê',
    [RoomStatus.MAINTENANCE]: 'Bảo trì',
    [RoomStatus.DISABLED]: 'Xoá phòng',
};

export const RoomStatusLabelsFilter = {
    [RoomStatus.PENDING_APPROVAL]: 'Chờ duyệt',
    [RoomStatus.AVAILABLE]: 'Trống',
    [RoomStatus.RENTED]: 'Đã thuê',
    [RoomStatus.MAINTENANCE]: 'Bảo trì',
};


export const RoomStatusColorMap = {
    [RoomStatus.PENDING_APPROVAL]: '#f59e0b',
    [RoomStatus.AVAILABLE]: '#10b981',
    [RoomStatus.RENTED]: '#3b82f6',
    [RoomStatus.MAINTENANCE]: '#8b5cf6',
    [RoomStatus.DISABLED]: '#ef4444',
};


export const CategoryType = {
    PRODUCT: 'SanPham',
    DISCOVERY: 'KhamPha',
    LAND: 'BatDongSan'
}

export const PriceLevel = {
    A: 'Dưới 500 triệu',
    B: '500 - 800 triệu',
    C: '800 triệu - 1 tỷ',
    D: '1 - 2 tỷ',
    E: '2 - 3 tỷ',
    F: '3 - 5 tỷ',
    G: '5 - 7 tỷ',
    H: '7 - 10 tỷ',
    I: 'Trên 10 tỷ',
    J: 'Thỏa thuận'
}

export const AcreageLevel = {
    A: 'Dưới 100 m²',
    B: '100 - 500 m²',
    C: '500 - 1000 m² (1 sào)',
    D: '1000 - 5000 m²',
    E: '5000 - 10.000 m² (1 mẫu)',
    F: '10.000 - 30.000 m²',
    G: '30.000 - 50.000 m²',
    H: '50.000 - 100.000 m² (10 mẫu)',
    I: 'Trên 100.000 m²'
}

export const StatusProduct = [
    {
        value: "InSell",
        label: "Đang bán"
    },
    {
        value: "OutOfStock",
        label: "Hết hàng"
    },
    {
        value: "OnSale",
        label: "Đang giảm giá"
    },
];

export const StatusProductConst = {
    InSell: 'InSell',
    OutOfStock: 'OutOfStock',
    OnSale: 'OnSale'
}

export const CategoryTypeOption = {
    SanPham: 'Sản phẩm, đặc sản',
    KhamPha: 'Du lịch, khám phá',
    BatDongSan: 'Bất động sản'
}

export const LandStatus = {
    new: 'Chờ xác nhận',
    pending: 'Cần cập nhật',
    confirmed: 'Đang bán',
    update: 'Chờ xác nhận'
}

export const CustomerType = {
    OWNER: 'owner',
    BROKER: 'broker',
    TENANT: 'tenant',
};

export const CustomerTypeOptions = {
    [CustomerType.OWNER]: 'Chủ nhà',
    [CustomerType.BROKER]: 'Môi giới',
    [CustomerType.TENANT]: 'Khách hàng',
};

export const FieldCooperation = {
    Undetermined: 'undetermined',
    Land: 'land',
    Rental: 'rental',
};

export const FieldCooperationLabels = {
    [FieldCooperation.Undetermined]: 'Chưa xác định',
    [FieldCooperation.Rental]: 'Nhà ở cho thuê',
    [FieldCooperation.Land]: 'Bất động sản',
};


export const RentalType = {
    BOARDING_HOUSE: 'boarding_house',
    WHOLE_HOUSE: 'whole_house',
    APARTMENT: 'apartment',
    BUSINESS_PREMISES: 'business_premises',
};

export const RentalTypeLabels = {
    [RentalType.BOARDING_HOUSE]: 'Nhà trọ',
    [RentalType.WHOLE_HOUSE]: 'Nhà nguyên căn',
    [RentalType.APARTMENT]: 'Chung cư',
    [RentalType.BUSINESS_PREMISES]: 'MBKD, văn phòng',
};

export const RentalTypeIcons = {
    [RentalType.BOARDING_HOUSE]: RoomRentalIcon,
    [RentalType.WHOLE_HOUSE]: HouseIcon,
    [RentalType.APARTMENT]: ApartmentIcon,
    [RentalType.BUSINESS_PREMISES]: ShopIcon,
};

export const RentalTypeOptions = Object.entries(RentalTypeLabels).map(
    ([value, label]) => ({ value, label })
);

export const RentalAmenity = {
    FullFurnished: 'full_furnished',
    Toilet: 'toilet',
    KitchenShelf: 'kitchen_shelf',
    Mezzanine: 'mezzanine',
    AirConditioner: 'air_conditioner',
    WashingMachine: 'washing_machine',
    Refrigerator: 'refrigerator',
    NoLiveWithOwner: 'no_live_with_owner',
    FreeTime: 'free_time',
    Security247: 'security_24_7',
    BasementParking: 'basement_parking',
    ElectricMotorbike: 'electric_motorbike',   // Xe máy điện
    PetAllowed: 'pet_allowed',                 // Nuôi thú cưng
    Window: 'window',                          // Cửa sổ
    Balcony: 'balcony',                        // Ban công
    Elevator: 'elevator',
};

export const RentalAmenityOptions = {
    [RentalAmenity.FullFurnished]: 'Nội thất đầy đủ',
    [RentalAmenity.Toilet]: 'WC riêng',
    [RentalAmenity.Mezzanine]: 'Gác lửng',
    [RentalAmenity.KitchenShelf]: 'Kệ bếp',
    [RentalAmenity.AirConditioner]: 'Máy lạnh',
    [RentalAmenity.WashingMachine]: 'Máy giặt',
    [RentalAmenity.Refrigerator]: 'Tủ lạnh',
    [RentalAmenity.Elevator]: 'Thang máy',
    [RentalAmenity.NoLiveWithOwner]: 'Không chung chủ',
    [RentalAmenity.FreeTime]: 'Giờ giấc tự do',
    [RentalAmenity.Security247]: 'An ninh 24/7',
    [RentalAmenity.BasementParking]: 'Chỗ để xe',
    [RentalAmenity.PetAllowed]: 'Nuôi thú cưng',
    [RentalAmenity.ElectricMotorbike]: 'Xe máy điện',
    [RentalAmenity.Window]: 'Cửa sổ',
    [RentalAmenity.Balcony]: 'Ban công',
};

export const SLIDES = [
    {
        title: 'Nhà phố Sài Gòn',
        desc: 'Nhà phố Sài Gòn pháp lý rõ ràng - vị trí đẹp - giá hợp lý',
        image: '/images/intro/nha-pho-sai-gon.jpg'
    },
    {
        title: 'Phòng trọ Sài Gòn',
        desc: 'Phòng trọ Sài Gòn sạch đẹp - an ninh - giá tốt',
        image: '/images/intro/phong-tro-sai-gon.jpg'
    },
    {
        title: 'Sản phẩm chất lượng',
        desc: 'Chọn lọc kỹ lưỡng - đáng tin cậy - sử dụng lâu dài',
        image: '/images/intro/san-pham-chat-luong.jpg'
    },
    {
        title: 'Tool & Phần mềm',
        desc: 'Công cụ hỗ trợ công việc - tiết kiệm thời gian - hiệu quả',
        image: '/images/intro/tool-phan-mem.jpg'
    },
    {
        title: 'Website & Dịch vụ uy tín',
        desc: 'Giải pháp số - xây dựng thương hiệu - phát triển bền vững',
        image: '/images/intro/website-dich-vu.jpg'
    }
];

export const BookingStatus = {
    PENDING: 'pending',        // Đã đặt lịch
    CONFIRMED: 'confirmed',    // Đã xác nhận với chủ trọ
    COMPLETED: 'completed',    // Đã đi xem
    CANCELLED: 'cancelled',    // Khách huỷ
    NO_SHOW: 'no_show',        // Khách không đến
};

export const BookingStatusLabels = {
    [BookingStatus.PENDING]: 'Đã đặt lịch',
    [BookingStatus.CONFIRMED]: 'Đã xác nhận',
    [BookingStatus.COMPLETED]: 'Đã đi xem',
    [BookingStatus.CANCELLED]: 'Khách huỷ',
    [BookingStatus.NO_SHOW]: 'Không đến',
};


export const WaterUnitOptions = {
    [WaterUnit.PerM3]: 'đ / m³',
    [WaterUnit.PerPerson]: 'đ / người',
};

