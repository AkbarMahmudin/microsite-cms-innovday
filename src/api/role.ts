import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';

const URL = endpoints.role;
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

export const useGetRoles = (query: any, otherOptions?: any) => {
  const URLList = query ? [URL.list, { params: query }] : URL.list;
  const { data: resData, isLoading, error, isValidating } = useSWR(URLList, fetcher, {
    ...options,
    ...otherOptions,
  });
  const data = resData?.data;
  const meta = resData?.meta;

  const memoizedValue = useMemo(
    () => ({
      meta,
      roles: (data?.roles as any[]) || [],
      rolesLoading: isLoading,
      rolesError: error,
      rolesValidating: isValidating,
      rolesEmpty: !isLoading && !data?.roles.length,
    }),
    [data?.roles, error, isLoading, isValidating, meta]
  );

  return memoizedValue;
}

export const createRole = async (data: any) => {
  const { data: res } = await axios.post(URL.create, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
};

export const updateRole = async (id: number, data: any) => {
  const { data: res } = await axios.patch(`${URL.update}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
};

export const deleteRole = async (id: number) => {
  const { data: res } = await axios.delete(`${URL.delete}/${id}`, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
};

export const deleteRoles = async (ids: number[]) => {
  const { data: res } = await axios.delete(URL.delete, {
    data: { ids },
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
}
