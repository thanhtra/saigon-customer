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





/* =========================
 * UPDATE MY RENTAL POST
 * ========================= */
export const updateMyRentalPost = (id, payload) => {
    if (!id) {
        throw new Error('Rental ID is required');
    }
    return put(`/rentals/${id}`, payload);
};

/* =========================
 * GET MY POST (DETAIL)
 * ========================= */
export const getMyPost = (slug) => {
    if (!slug) {
        throw new Error('Slug is required');
    }
    return get(`/rentals/my/${slug}`);
};

/* =========================
 * UPLOAD IMAGES (RAW FILE)
 * ========================= */
export const uploadImagesRental = (formData) => {
    if (!(formData instanceof FormData)) {
        throw new Error('FormData is required');
    }

    return post('/uploads/rentals/images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/* =========================
 * CREATE IMAGES (SAVE DB)
 * ========================= */
export const createImages = (payload) => {
    /**
     * payload = {
     *   imageList: [],
     *   productId: string,
     *   type: 'BatDongSan'
     * }
     */
    return post('/images', payload);
};

/* =========================
 * REMOVE IMAGE BY NAME
 * ========================= */
export const removeImageByName = (imageName) => {
    if (!imageName) {
        throw new Error('Image name is required');
    }
    return del(`/images/${imageName}`);
};


