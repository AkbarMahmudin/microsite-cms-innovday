import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';

const URL = endpoints.user;
const ACCESSTOKEN = localStorage.getItem('accessToken');

const options = {
  // revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  refreshInterval: 5000,
  revalidateOnMount: true,
  dedupingInterval: 5000,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
};

export const useGetUsers = (query: any) => {
  const URLList = query ? [URL.list, { params: query }] : URL.list;
  const { data: resData, isLoading, error, isValidating } = useSWR(URLList, fetcher, options);
  const data = resData?.data;
  const meta = resData?.meta;

  const memoizedValue = useMemo(
    () => ({
      meta,
      users: (data?.users as any[]) || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users.length,
    }),
    [data?.users, error, isLoading, isValidating, meta]
  );

  return memoizedValue;
};

export const useGetUser = (id: number) => {
  const URLDetail = `${URL.details}/${id}`;
  const { data: resData, isLoading, error, isValidating } = useSWR(URLDetail, fetcher);

  const data = resData?.data;

  const memoizedValue = useMemo(
    () => ({
      user: data?.user as any,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data?.user, error, isLoading, isValidating]
  );

  return memoizedValue;
};

export const createUser = async (data: any) => {
  const { create: URLCreate } = URL;
  const { data: res } = await axios.post(URLCreate, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const { update: URLUpdate } = URL;

  mutate(
    URL.list,
    (currentData: any) => ({
      ...currentData,
      users: currentData?.users?.map((user: any) => (user.id === id ? { ...user, ...data } : user)),
    }),
    false
  );

  const { data: res } = await axios.patch(`${URLUpdate}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};

export const deleteUser = async (id: number) => {
  const { delete: URLDelete } = URL;

  mutate(URL.list, (data: any) => ({
    ...data,
    users: data?.users?.filter((user: any) => user.id !== id),
  }));

  const { data: res } = await axios.delete(`${URLDelete}/${id}`, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};

export const deleteUsers = async (ids: number[]) => {
  const { delete: URLDelete } = URL;

  mutate(URL.list, (data: any) => ({
    ...data,
    users: data?.users?.filter((user: any) => !ids.includes(user.id)),
  }));

  const { data: res } = await axios.delete(URLDelete, {
    data: { ids },
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};

// ----------------------------------------------------------------------
// USER ME (USER PROFILE ACCOUNT)
// ----------------------------------------------------------------------

export const updateUserMe = async (data: any) => {
  const { update: URLUpdate } = URL.me;
  const { data: res } = await axios.patch(URLUpdate, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};

export const updatePasswordMe = async (data: any) => {
  const { updatePassword: URLUpdatePassword } = URL.me;
  const { data: res } = await axios.patch(URLUpdatePassword, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  return res.data;
};
