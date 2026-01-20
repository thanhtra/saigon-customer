import { get, post, put, del } from './index';


export const createBoardingHouses = (payload) => {
    return post('/rentals/customer/create-boarding-houses', payload);
};

export const createUnitRental = (payload) => {
    return post('/rentals/customer/create-unit-rental', payload);
};

export const getMyBoardingHouses = () => {
    return get(`/rentals/customer/my-boarding-houses`);
}