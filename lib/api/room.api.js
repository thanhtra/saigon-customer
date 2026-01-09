import { get, post, put, del } from './index';

/* ================= PUBLIC ================= */

export const getRooms = (query) => {
    return get('/rooms/public', query);
};

export const getRoomDetail = (slug) => {
    return get(`/rooms/public/${slug}`);
};

export const getContact = (roomId) => {
    return get(`/collaborators/${roomId}/contact-detail`);
};

/* ================= AUTH REQUIRED (COOKIE) ================= */

export const createRoom = (payload) => {
    return post('/rooms/customer-post', payload);
};

export const uploadImagesRoom = (formData) => {
    return post('/images/uploads-room', formData);
};

export const createImages = (payload) => {
    return post('/images', payload);
};

export const removeImageByName = (imageName, type) => {
    return del('/images/delete', {
        imageName,
        type,
    });
};

export const getMyPosts = (params) => {
    return get('/rooms/my-posts', params);
};

export const getMyPost = (slug) => {
    return get(`/rooms/${slug}/my-post/slug`);
};

export const removeMyPost = (id) => {
    return put(`/rooms/${id}/remove-my-post`);
};

export const updateMyRoomPost = (id, payload) => {
    return put(`/rooms/${id}/update-my-post`, payload);
};
