import axios from 'axios'
const { NEXT_PUBLIC_REACT_APP_API } = process.env;
import api from './config.api';

const http = axios.create({
    baseURL: `${NEXT_PUBLIC_REACT_APP_API}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getLands = async (query) => {
    const { district = '', ward = '', categoryId = '',
        keySearch = '', priceLevel = '',
        acreageLevel = '', active = true, page = 0,
        size = 20
    } = query;

    const { data } = await http.get('/lands', {
        params: {
            district,
            ward,
            categoryId,
            priceLevel,
            acreageLevel,
            page,
            size,
            keySearch,
            active
        }
    })

    return data.result
}

export const getLandDetail = async (id) => {
    const res = await http.get('/lands/' + id + '/detail/slug');

    return res?.data || null;
}

export const getContact = async (landId) => {
    const res = await api.get('/collaborators/' + landId + '/contact-detail');

    return res?.data || null;
}

export const createLand = async (payload) => {
    const res = await api.post('/lands/customer-post', payload);

    return res?.data || null;
};

export const uploadImagesLand = async (body) => {
    const res = await api.post('/images/uploads-land', body);

    return res?.data || null;
};

export const createImages = async (body) => {
    const res = await api.post('/images', body);

    return res?.data || null;
};

export const removeImageByName = async (imageName, type) => {
    const data = { imageName, type };
    const res = await api.delete('/images/delete', { data });

    return res?.data || null;
};

export const getMyPosts = async (payload) => {
    const { status = '', page = 0, size = 10 } = payload;
    const res = await api.get(`/lands/my-posts?status=${status}&page=${page}&size=${size}`);

    return res?.data || null;
}

export const getMyPost = async (slug) => {
    const res = await api.get('/lands/' + slug + '/my-post/slug');

    return res?.data || null;
}

export const removeMyPost = async (id) => {
    const res = await api.put(`/lands/${id}/remove-my-post`);

    return res?.data || null;
};

export const updateMyLandPost = async (id, payload) => {
    const res = await api.put(`/lands/${id}/update-my-post`, payload);

    return res?.data || null;
};
