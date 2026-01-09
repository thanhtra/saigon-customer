import { get, post, put, del } from './index';



export const createBookingPublic = (payload) => {
    return post('/bookings/register', payload);
};