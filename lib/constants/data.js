

export const OrderStatus = {
    new: 'Chờ xác nhận',
    confirmed: 'Chờ lấy hàng',
    delivered: 'Đang giao',
    completed: 'Đã giao',
    canceled: 'Đã huỷ'
}

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

export const Position = {
    Owner: 'Chủ đất',
    Agency: 'Môi giới'
}

export const CustomerType = {
    OWNER: 'owner',
    BROKER: 'broker',
    TENANT: 'tenant',
};

export const CustomerTypeOptions = {
    [CustomerType.OWNER]: 'Chủ nhà',
    [CustomerType.BROKER]: 'Môi giới',
    [CustomerType.TENANT]: 'Người thuê nhà',
};

export const RentalType = {
    BOARDING_HOUSE: 'boarding_house',
    WHOLE_HOUSE: 'whole_house',
    APARTMENT: 'apartment',
    BUSINESS_PREMISES: 'business_premises',
};

export const RentalTypeLabels = {
    [RentalType.BOARDING_HOUSE]: 'Dãy trọ',
    [RentalType.WHOLE_HOUSE]: 'Nhà nguyên căn',
    [RentalType.APARTMENT]: 'Chung cư',
    [RentalType.BUSINESS_PREMISES]: 'Mặt bằng kinh doanh',
};

export const RentalAmenity = {
    FULL_FURNISHED: 'full_furnished',
    MEZZANINE: 'mezzanine',
    KITCHEN_SHELF: 'kitchen_shelf',
    AIR_CONDITIONER: 'air_conditioner',
    WASHING_MACHINE: 'washing_machine',
    REFRIGERATOR: 'refrigerator',
    ELEVATOR: 'elevator',
    NO_LIVE_WITH_OWNER: 'no_live_with_owner',
    FREE_TIME: 'free_time',
    SECURITY_24_7: 'security_24_7',
    BASEMENT_PARKING: 'basement_parking',
};

export const RentalAmenityOptions = {
    [RentalAmenity.FULL_FURNISHED]: 'Đầy đủ nội thất',
    [RentalAmenity.MEZZANINE]: 'Có gác',
    [RentalAmenity.KITCHEN_SHELF]: 'Có kệ bếp',
    [RentalAmenity.AIR_CONDITIONER]: 'Có máy lạnh',
    [RentalAmenity.WASHING_MACHINE]: 'Có máy giặt',
    [RentalAmenity.REFRIGERATOR]: 'Có tủ lạnh',
    [RentalAmenity.ELEVATOR]: 'Có thang máy',
    [RentalAmenity.NO_LIVE_WITH_OWNER]: 'Không chung chủ',
    [RentalAmenity.FREE_TIME]: 'Giờ giấc tự do',
    [RentalAmenity.SECURITY_24_7]: 'Có bảo vệ 24/24',
    [RentalAmenity.BASEMENT_PARKING]: 'Có hầm để xe',
};

export const SLIDES = [
    {
        title: 'Nhà phố Sài Gòn',
        desc: 'Nhà phố Sài Gòn pháp lý rõ ràng – vị trí đẹp – giá hợp lý',
        image: '/images/intro/nha-pho-sai-gon.jpg'
    },
    {
        title: 'Phòng trọ Sài Gòn',
        desc: 'Phòng trọ Sài Gòn sạch đẹp – an ninh – giá tốt',
        image: '/images/intro/phong-tro-sai-gon.jpg'
    },
    {
        title: 'Sản phẩm chất lượng',
        desc: 'Chọn lọc kỹ lưỡng – đáng tin cậy – sử dụng lâu dài',
        image: '/images/intro/san-pham-chat-luong.jpg'
    },
    {
        title: 'Tool & Phần mềm',
        desc: 'Công cụ hỗ trợ công việc – tiết kiệm thời gian – hiệu quả',
        image: '/images/intro/tool-phan-mem.jpg'
    },
    {
        title: 'Website & Dịch vụ uy tín',
        desc: 'Giải pháp số – xây dựng thương hiệu – phát triển bền vững',
        image: '/images/intro/website-dich-vu.jpg'
    }
];
