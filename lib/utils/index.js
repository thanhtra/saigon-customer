import { StatusProduct, CategoryTypeOption, LandStatus } from '../constants/data';


export function getDistrictOption(obj) {
    var option = [];

    Object.keys(obj).map(item => {
        option.push({
            id: item,
            label: item
        });
    });

    return option;
}

export function getWardsOption(obj, district) {
    var option = [];

    (obj[district] || []).forEach(item => {
        option.push({
            id: item,
            label: item
        });
    });

    return option;
}

export const formatCurrency = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
})


export const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}


export const getOptionFromObject = (obj) => {
    let option = [];

    Object.keys(obj).map(item => {
        option.push({
            id: item,
            label: obj[item]
        });
    });

    return option;
}


export const addCart = (origin, newcart) => {
    if (origin?.length === 0) return newcart;
    const arr = [...origin, ...newcart];
    const obj = {};
    const result = [];

    (arr || []).forEach(e => {
        if (Object.keys(obj).includes(e.item)) {
            obj[e.item] = {
                quantity: obj[e.item]?.quantity + e.quantity,
                price: e.price,
                image: e.image
            };
        } else {
            obj[e.item] = {
                quantity: e.quantity,
                price: e.price,
                image: e.image
            };
        }
    });

    (Object.entries(obj) || []).forEach(val => {
        result.push({
            item: val[0],
            quantity: val[1]?.quantity,
            price: val[1]?.price,
            image: val[1]?.image
        });
    });

    return result;
}

export const getStatusProduct = (status) => {
    if (!status) return '';

    const a = StatusProduct.find(item => item.value === status.trim());
    if (!a) return '';

    return a.label;
}


export const saveTokens = (accessToken, refreshToken) => {
    if (typeof window === 'undefined') return;

    if (accessToken) {
        localStorage.setItem('access_token', accessToken);
    }
    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
    }
};

export const saveUser = (user) => {
    localStorage.setItem('infor_user', JSON.stringify(user))
}

export const removeAllLocalStorage = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('infor_user');
    localStorage.removeItem('persist:nextjs');
};

export const localStorageGet = (key) => {
    if (typeof window === 'undefined') {
        return '';
    }

    return localStorage.getItem(key) || '';
};


// export const localStorageSet = (key, value) => {
//     return localStorage.getItem(key);
// }

export const formatDate = (date) => {
    if (!date) return '';

    const a = date.toString();
    const y = a.slice(0, 4);
    const m = a.slice(5, 7);
    const d = a.slice(8, 10);

    return `${d}-${m}-${y}`;
};

export const getCateOption = (key) => {
    if (!key) return '';

    return CategoryTypeOption[key];
}

export const getStatusLand = (key) => {
    if (!key) return '';

    return LandStatus[key];
}

export const convertObjectToOptions = (obj) => {
    return Object.entries(obj).map(([value, label]) => ({
        value,
        label,
    }));
};


export const formatVnd = (value, options = {}) => {
    const { suffix = ' đ', emptyText = '-' } = options;

    if (value === null || value === undefined) {
        return emptyText;
    }

    // Nếu suffix là null thì không nối thêm gì vào
    const formattedValue = `${Number(value).toLocaleString('vi-VN')}`;
    return suffix === null ? formattedValue : `${formattedValue}${suffix}`;
};


export const formatArea = (value, options = {}) => {
    const { unit = 'm²', emptyText = '-' } = options;

    if (value === null || value === undefined) {
        return emptyText;
    }

    return `${value} ${unit}`;
};


export const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '';
    return Number(value).toLocaleString('vi-VN');
};

export const parseNumber = (value) => {
    if (!value) return null; // 👈 QUAN TRỌNG
    const raw = value.replace(/\./g, '');
    const num = Number(raw);
    return isNaN(num) ? null : num;
};


export const buildSelectOptions = (
    labels,
    placeholder = '-- Chọn --'
) => [
        { value: '', label: placeholder },
        ...Object.entries(labels).map(([value, label]) => ({
            value,
            label,
        })),
    ];

export const buildSelectOptionsFromList = (
    list = [],
    { labelKey = 'label', valueKey = 'value', placeholder } = {}
) => {
    const options = list.map(item => ({
        label: item[labelKey],
        value: item[valueKey],
    }));

    if (placeholder) {
        options.unshift({
            label: placeholder,
            value: '',
            disabled: true,
        });
    }

    return options;
};

export function getEmbedUrl(url = '') {
    if (!url) return '';

    const cleanUrl = url.trim();

    // TikTok: https://www.tiktok.com/@abc/video/123
    const tiktokMatch = cleanUrl.match(/tiktok\.com\/@.+\/video\/(\d+)/);
    if (tiktokMatch?.[1]) {
        // ✅ autoplay=1 & muted=1 để browser cho phép chạy ngay
        return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}?autoplay=1&muted=1`;
    }

    // YouTube
    if (cleanUrl.includes('youtube.com/watch')) {
        const u = new URL(cleanUrl);
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }

    const ytShort = cleanUrl.match(/youtu\.be\/([^?]+)/);
    if (ytShort?.[1]) {
        return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1&mute=1`;
    }

    return cleanUrl;
}
