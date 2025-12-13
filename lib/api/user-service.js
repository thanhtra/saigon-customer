import http from './config.api'

export const userRegister = async (payload) => {
    const { data } = await http.post(`/users`, payload)
    return data
}

export const login = async (payload) => {
    const { data } = await http.post(`/auth/login`, payload)

    return data
}

export const logout = async () => {
    const { data } = await http.post(`/auth/logout`);

    return data
}

export const getUserById = async (userId) => {
    const { data } = await http.get(`/users/${userId}/detail`)

    return data
}

export const updateUser = async (payload) => {
    const { id, ...user } = payload;
    const { data } = await http.put(`/users/${id}/update`, user);

    return data;
}

export const updatePassword = async (payload) => {
    const { data } = await http.put(`/auth/update-password`, payload)

    return data
}

export const changePassword = async (payload) => {
    const { data } = await http.put(`/auth/change-password`, payload)

    return data
}
