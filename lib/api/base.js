import apiClient from '../utils/apiClient';

export const get = async (url, params) => {
    const res = await apiClient.get(url, { params });
    return res.data;
};

export const post = async (url, body) => {
    const res = await apiClient.post(url, body);
    return res.data;
};

export const put = async (url, body) => {
    const res = await apiClient.put(url, body);
    return res.data;
};

export const del = async (url) => {
    const res = await apiClient.delete(url);
    return res.data;
};
