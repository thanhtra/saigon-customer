import { get, post, put, del } from './index';

/* ================= PUBLIC ================= */

export const getRooms = (query) => {
    return get('/rooms/customer', query);
};

export const getRoomDetail = (slug) => {
    return get(`/rooms/customer/${slug}`);
};

export const createRoom = (payload) => {
    return post('/rooms/customer', payload);
};

export const updateRoom = (id, payload) => {
    if (!id) {
        throw new Error('Room ID is required');
    }
    return put(`/rooms/${id}/customer`, payload);
};


export const getContact = (roomId) => {
    return get(`/collaborators/${roomId}/contact-detail`);
};


/* ================= AUTH REQUIRED (COOKIE) ================= */



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
