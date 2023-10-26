import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher, endpoints } from 'src/utils/axios';

const URL = endpoints.stream;
const ACCESSTOKEN = sessionStorage.getItem('accessToken');

const options = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  keepPreviousData: true,
  // refreshInterval: 5000,
  // revalidateOnMount: true,
  // dedupingInterval: 5000,
  // refreshWhenHidden: false,
  // refreshWhenOffline: false,
};

export const useGetStreams = (query: any, otherOptions?: any) => {
  const URLList = query ? [URL.list, { params: query }] : null;

  const { data: resData, isLoading, error, isValidating } = useSWR(URLList, fetcher, {
    ...options,
    ...otherOptions,
  });

  const data = resData?.data;
  const meta = resData?.meta;

  const memoizedValue = useMemo(
    () => ({
      streams: (data?.streams as any[]) || [],
      status: data?.status,
      meta,
      streamsLoading: isLoading,
      streamsError: error,
      streamsValidating: isValidating,
      streamsEmpty: !isLoading && !data?.streams.length,
    }),
    [data?.streams, error, isLoading, isValidating, meta, data?.status]
  );

  return memoizedValue;
};

export const useGetStream = (id: number) => {
  const URLDetail = `${URL.details}/${id}`;

  const { data: resData, isLoading, error, isValidating } = useSWR(URLDetail, fetcher);

  const data = resData?.data;

  const memoizedValue = useMemo(
    () => ({
      stream: data?.stream as any,
      streamLoading: isLoading,
      streamError: error,
      streamValidating: isValidating,
      streamEmpty: !isLoading && !data?.stream,
    }),
    [data?.stream, error, isLoading, isValidating]
  );

  return memoizedValue;
};

export const createStream = async (data: any) => {
  const URLCreate = `${URL.create}`;
  const { data: res } = await axios.post(URLCreate, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  mutate(URL.list);

  return res.data;
};

export const updateStream = async (id: number, data: any) => {
  const URLUpdate = `${URL.update}/${id}`;
  const { data: res } = await axios.patch(URLUpdate, data, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  mutate(URL.list);

  return res.data;
};

export const deleteStream = async (id: number) => {
  const URLDelete = `${URL.delete}/${id}`;
  const { data: res } = await axios.delete(URLDelete, {
    headers: {
      Authorization: `Bearer ${ACCESSTOKEN}`,
    },
  });

  mutate(URL.list);

  return res.data;
};
