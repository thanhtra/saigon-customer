const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3005/images/san-pham"
    : "https://tratimnha.com/images/san-pham";

export const shopeeCategories = [
    {
        id: 3020217,
        name: 'Thời trang nam',
        image: `${baseUrl}/thoi-trang-nam.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/3020217'
    },
    {
        id: 2885659,
        name: 'Thời trang nữ',
        image: `${baseUrl}/thoi-trang-nu.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/2885659'
    },
    {
        id: 2829830,
        name: 'Mỹ phẩm',
        image: `${baseUrl}/my-pham.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/2829830'
    },
    {
        id: 2823948,
        name: 'Gia dụng',
        image: `${baseUrl}/gia-dung.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/2823948'
    },
    {
        id: 2901511,
        name: 'Điện tử',
        image: `${baseUrl}/dien-tu.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/2901511'
    },
    {
        id: 3020213,
        name: 'Nội thất',
        image: `${baseUrl}/noi-that.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/3020213'
    },
    {
        id: 2823562,
        name: 'Ăn vặt',
        image: `${baseUrl}/an-vat.jpg`,
        url: 'https://collshp.com/tratimnhacom/category/2823562'
    }
];