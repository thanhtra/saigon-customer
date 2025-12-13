import axios from 'axios';
const { NEXT_PUBLIC_REACT_APP_API } = process.env;
import { removeAllLocalStorage, saveTokens, localStorageGet } from 'lib/utils/index';
import { REMOVE_USER } from 'lib/store/type/user-type';
import { makeStore } from 'lib/store/index';
const store = makeStore();

const http = axios.create({
  baseURL: `${NEXT_PUBLIC_REACT_APP_API}/api/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use(req => {
  const accessToken = localStorageGet("access_token");

  if (accessToken) {
    req.headers['authorization'] = 'Bearer ' + accessToken
  }

  return req
},
  error => {
    Promise.reject(error)
  }
)

http.interceptors.response.use(
  res => res,
  error => {
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }
    const originalRequest = error.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorageGet("refresh_token");

      const config = {
        headers: { authorization: `Bearer ${refreshToken}` }
      };

      return axios
        .get(`${NEXT_PUBLIC_REACT_APP_API}/api/auth/refresh-token`, config)
        .then((res) => {
          const { data } = res;
          if (data && data?.success) {
            const { accessToken } = data?.result;
            if (accessToken) {
              saveTokens(accessToken);
              http.defaults.headers.common['authorization'] = 'Bearer ' + accessToken;
              return http(originalRequest)
            } else {
              removeAllLocalStorage();
            }
          } else {
            removeAllLocalStorage();
            store.dispatch({
              type: REMOVE_USER,
              payload: {}
            });
          }
        })
        .catch(err => {
          // refresh token bị expire => không get được access token mới và trả phải trả về Unauthorized.
          // cần xử lý xóa state global user và remove local storage user + token và sau đó redirect sang page login

          store.dispatch({
            type: REMOVE_USER,
            payload: {}
          });
          removeAllLocalStorage();
          window.location.reload();
        })
    }

    return Promise.reject(error)
  }
)

export default http
