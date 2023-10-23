import axios, { AxiosRequestConfig } from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  // auth: {
  //   me: '/api/auth/me',
  //   login: '/api/auth/login',
  //   register: '/api/auth/register',
  // },
  // ------------------------------
  auth: {
    login: '/auth',
    me: '/users/me',
  },
  user: {
    me: {
      update: '/users/me',
      updatePassword: '/users/me/new-password',
    },
    list: '/users',
    create: '/users',
    details: '/users',
    update: '/users',
    delete: '/users',
  },
  role: {
    list: '/roles',
    create: '/roles',
    details: '/roles',
    update: '/roles',
    delete: '/roles',
  },
  category: {
    list: '/categories',
    create: '/categories',
    details: '/categories',
    update: '/categories',
    delete: '/categories',
  },
  stream: {
    list: '/streams',
    create: '/streams',
    details: '/streams',
    update: '/streams',
    delete: '/streams',
  },
  // ------------------------------
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
