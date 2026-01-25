export const PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;


export const UserRole = {
    Admin: 'admin_saigon',
    Sale: 'sale_saigon',
    Owner: 'owner',       // Chủ nhà
    Broker: 'broker',     // Môi giới
    Tenant: 'tenant',     // Khách hàng
}

export const ProfileTab = {
    Account: 'tai-khoan',
    ChangePassword: 'doi-mat-khau',
    ManageBooking: 'lich-xem-nha',
    ManagePostRental: 'nha-o-cho-thue',
    ManagePostLand: 'bat-dong-san',
    Logout: 'logout'
}

export const PageUrl = {
    Home: '/',
    Register: '/dang-ki',
    ForgotPassword: '/quen-mat-khau',
    Login: '/dang-nhap',
    Payment: '/dat-hang/thanh-toan',
    Profile: '/tai-khoan',
    Rental: '/nha-o-cho-thue',
    PostRental: '/dang-tin-nha-o-cho-thue',
    RentalGuide: '/huong-dan-dang-tin-nha-o-cho-thue',
    Lands: '/bat-dong-san',
    Discoveries: '/kham-pha',
    Products: '/san-pham',
    ShoppingCart: '/dat-hang/gio-hang',
    CompleteOrder: '/dat-hang/hoan-tat',
    Tour: '/thong-tin/du-lich',
    InforLand: '/thong-tin/dat',
    PostLand: '/dang-tin-bat-dong-san',
    PostProduct: '/dang-tin-san-pham',
    AccountMyHouse: '/tai-khoan?tab=nha-o-cho-thue'
}

export const UploadDomain = {
    Rooms: 'rooms',
    RealEstates: 'real_estates',
    Contracts: 'contracts',
}

export const WaterUnit = {
    PerM3: 'per_m3',
    PerPerson: 'per_person'
}