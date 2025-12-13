import http from './config.api';

export const getCategories = async (query) => {
  const { isPagin = false } = query;
  const { data } = await http.get(`/categories?isPagin=${isPagin}`);

  return data;
}