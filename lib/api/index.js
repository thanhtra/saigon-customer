import http from './http';

export const get = (url, params) =>
    http.get(url, { params }).then((res) => res.data);

export const post = (url, body) =>
    http.post(url, body).then((res) => res.data);

export const put = (url, body) =>
    http.put(url, body).then((res) => res.data);

export const del = (url) =>
    http.delete(url).then((res) => res.data);
