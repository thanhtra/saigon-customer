import { get, post, put, del } from './index';



export const createBookingPublic = (payload) => {
    return post('/bookings/customer/register', payload);
};

export const getMyBooking = (payload) => {
    return get(`/bookings/customer/me`, payload);
}
