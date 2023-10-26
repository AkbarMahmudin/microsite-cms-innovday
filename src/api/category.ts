import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';

const URL = endpoints.category;
const ACCESSTOKEN = sessionStorage.getItem('accessToken');

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

export const useGetCategories = (query: any, otherOptions?: any) => {
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
      categories: (data?.categories as any[]) || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.categories.length,
    }),
    [data?.categories, error, isLoading, isValidating, meta]
  );

  return memoizedValue;
}

export const createCategory = async (data: any) => {
  const { data: res } = await axios.post(URL.create, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
};

export const updateCategory = async (id:number, data: any) => {
  const { data: res } = await axios.patch(`${URL.update}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
};

export const deleteCategory = async (id: number) => {
  const { data: res } = await axios.delete(`${URL.delete}/${id}`, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });
  mutate(URL.list);

  return res.data;
}

export const deleteCategories = async (ids: number[]) => {
  const { data: res } = await axios.delete(URL.delete, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
    data: { ids },
  });
  mutate(URL.list);

  return res.data;
};
