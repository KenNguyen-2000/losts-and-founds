import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const interceptor = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // withCredentials: true,
});

interceptor.interceptors.request.use(function (req) {
  const token = Cookies.get('accessToken');
  if (token && req.headers) req.headers['Authorization'] = `Bearer ${token}`;

  // req.headers['Content-Type'] = 'application/json';
  return req;
});

interceptor.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error: AxiosError) {
    if (error?.response!.status === 401) {
      Cookies.remove('accessToken');
      window.location.assign('/login');
    }
    return Promise.reject(error.response);
  }
);

export default interceptor;
