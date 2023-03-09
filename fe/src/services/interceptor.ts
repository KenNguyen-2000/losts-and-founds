import axios, { AxiosError } from 'axios';

const interceptor = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  // withCredentials: true,
});

interceptor.interceptors.request.use(function (req) {
  const token = localStorage.getItem('access_token');
  if (token && req.headers) req.headers['Authorization'] = `Bearer ${token}`;

  // req.headers['Content-Type'] = 'application/json';
  return req;
});

interceptor.interceptors.response.use(
  function (res) {
    console.log('Interceptor', res);
    return res;
  },
  function (error: AxiosError) {
    return Promise.reject(error.response);
  }
);

export default interceptor;
