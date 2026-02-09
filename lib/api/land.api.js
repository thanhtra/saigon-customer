import { get } from './index';


export const getLands = (query) => {
    return get('/lands/customer', query);
};

export const getLandDetail = (slug) => {
    return get(`/lands/customer/${slug}`);
};

export const getContact = (landId) => {
    return get(`/collaborators/contact-land/${landId}/admintra`);
};