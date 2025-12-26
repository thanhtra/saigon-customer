import axios from 'axios'
const { NEXT_PUBLIC_REACT_APP_API } = process.env;
import api from './config.api';

const http = axios.create({
    baseURL: `${NEXT_PUBLIC_REACT_APP_API}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getRentals = async (query) => {
    const { district = '', ward = '', categoryId = '',
        keySearch = '', priceLevel = '',
        acreageLevel = '', active = true, page = 0,
        size = 20
    } = query;

    const { data } = await http.get('/rentals', {
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

export const getRentalDetail = async (id) => {
    const res = await http.get('/rentals/' + id + '/detail/slug');

    return res?.data || null;
}

export const getContact = async (rentalId) => {
    const res = await api.get('/collaborators/' + rentalId + '/contact-detail');

    return res?.data || null;
}

export const createRental = async (payload) => {
    const res = await api.post('/rentals/customer-post', payload);

    return res?.data || null;
};

export const uploadImagesRental = async (body) => {
    const res = await api.post('/images/uploads-rental', body);

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
    const res = await api.get(`/rentals/my-posts?status=${status}&page=${page}&size=${size}`);

    return res?.data || null;
}

export const getMyPost = async (slug) => {
    const res = await api.get('/rentals/' + slug + '/my-post/slug');

    return res?.data || null;
}

export const removeMyPost = async (id) => {
    const res = await api.put(`/rentals/${id}/remove-my-post`);

    return res?.data || null;
};

export const updateMyRentalPost = async (id, payload) => {
    const res = await api.put(`/rentals/${id}/update-my-post`, payload);

    return res?.data || null;
};
