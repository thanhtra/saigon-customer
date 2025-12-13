import http from 'lib/api/config.api';

export const createOrder = async (order) => {
  const { data } = await http.post('/orders', order)

  return data
}

export const getOrderByUserId = async (payload) => {
  const { userId = '', status = '', page = 0, size = 10, isPagin = true } = payload;
  const { data } = await http.get(`/orders/order-by-user?userId=${userId}&status=${status}&page=${page}&size=${size}&isPagin=${isPagin}`);

  return data;
}