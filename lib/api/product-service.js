import axios from 'axios';
import api from './config.api';
// import http from './config.api';

const { NEXT_PUBLIC_REACT_APP_API } = process.env


const http = axios.create({
    baseURL: `${NEXT_PUBLIC_REACT_APP_API}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getProducts = async (query) => {
    const { categoryId = '', keySearch = '', page = 0, size = 24, status = '' } = query;

    const { data } = await http.get('/products', {
        params: {
            categoryId,
            page,
            size,
            keySearch,
            status
        }
    })

    return data.result
}

export const getProductDetail = async (slug) => {
    const { data } = await http.get('/products/' + slug + '/detail/slug')

    return data?.result
}

export const getContactDetail = async (collaboratorId) => {
    const res = await api.get('/collaborators/' + collaboratorId + '/detail');

    return res?.data || null;
}

export const getMyPost = async (slug) => {
    const res = await api.get('/products/' + slug + '/my-post/slug');

    return res?.data || null;
}

export const createProduct = async (payload) => {
    const res = await api.post('/products/customer-post', payload);

    return res?.data || null;
};

export const uploadImagesProduct = async (body) => {
    const res = await api.post('/images/uploads-product', body);

    return res?.data || null;
};

export const getMyPosts = async (payload) => {
    const { status_post = '', page = 0, size = 10 } = payload;
    const res = await api.get(`/products/my-posts?status_post=${status_post}&page=${page}&size=${size}`);

    return res?.data || null;
}

export const removeMyPost = async (id) => {
    const res = await api.put(`/products/${id}/remove-my-post`);

    return res?.data || null;
};

export const updateMyProductPost = async (id, payload) => {
    const res = await api.put(`/products/${id}/update-my-post`, payload);

    return res?.data || null;
};
