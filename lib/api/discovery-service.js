import axios from 'axios';
// import http from './config.api';
const { NEXT_PUBLIC_REACT_APP_API } = process.env

const http = axios.create({
    baseURL: `${NEXT_PUBLIC_REACT_APP_API}/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getDiscoveries = async (query) => {
    const { district = '', categoryId = '', keySearch = '', active = true,
        page = 0, size = 10 } = query;

    const { data } = await http.get('/discoveries', {
        params: {
            district,
            categoryId,
            keySearch,
            active,
            page,
            size,
        }
    })

    return data.result
}

export const getDiscoveryDetail = async (id) => {
    const { data } = await http.get('/discoveries/' + id + '/detail/slug');

    return data;
}
