import { get, post, put, del } from './index';


export const getRooms = (query) => {
    return get('/rooms/customer', query);
};

export const getMyRooms = (query) => {
    return get('/rooms/customer/my', query);
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
    return get(`/collaborators/admintra/${roomId}/contact`);
};