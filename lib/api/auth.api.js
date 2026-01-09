import { get, post, put } from './index';

export const login = (data) => post('/auth/login', data);
export const logout = () => post('/auth/logout');
export const getMe = () => get('/auth/me');
export const updatePassword = (data) =>
    put('/auth/update-password', data);
export const changePassword = (data) =>
    put('/auth/change-password', data);
