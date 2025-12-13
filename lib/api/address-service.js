import http from './config.api'

export const getAddresses = async (query) => {
  const { userId = '', isPagin = false } = query;
  const { data } = await http.get(`/addresses?userId=${userId}&isPagin=${isPagin}`)

  return data;
}

export const createAddress = async (address) => {
  const { data } = await http.post('/addresses', address)

  return data;
}

export const removeAddress = async (id) => {
  const { data } = await http.delete(`/addresses/${id}/delete`);

  return data;
}