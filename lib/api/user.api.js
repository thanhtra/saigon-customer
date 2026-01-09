import { get, post, put } from './index';


export const registerUser = (payload) => {
    return post('/users/register', payload);
};

export const updateUser = (payload) => {
    return put(`/users/me`, payload);
};

export const registerAfterBooking = (payload) => {
    return post('/users/register-after-booking', payload);
};





export const getUserById = (userId) => {
    return get(`/users/${userId}/detail`);
};
