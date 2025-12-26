

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
