import { get, post, put, del } from './base';

/* ================= PUBLIC ================= */

export const getRooms = async (query) => {
    return await get('/rooms/public', query);
};

export const getRoomDetail = async (slug) => {
    return await get(`/rooms/public/${slug}`);
};

export const getContact = async (roomId) => {
    return await get(`/collaborators/${roomId}/contact-detail`);
};

/* ================= AUTH REQUIRED ================= */

export const createRoom = async (payload) => {
    return await post('/rooms/customer-post', payload);
};

export const uploadImagesRoom = async (formData) => {
    return await post('/images/uploads-room', formData);
};

export const createImages = async (payload) => {
    return await post('/images', payload);
};

export const removeImageByName = async (imageName, type) => {
    return await del(
        `/images/delete?imageName=${imageName}&type=${type}`,
    );
};

export const getMyPosts = async (params) => {
    return await get('/rooms/my-posts', params);
};

export const getMyPost = async (slug) => {
    return await get(`/rooms/${slug}/my-post/slug`);
};

export const removeMyPost = async (id) => {
    return await put(`/rooms/${id}/remove-my-post`);
};

export const updateMyRoomPost = async (id, payload) => {
    return await put(`/rooms/${id}/update-my-post`, payload);
};
