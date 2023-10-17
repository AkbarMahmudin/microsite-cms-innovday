import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';

const URL = endpoints.auth.login;

// ----------------------------------------------------------------------

export const useAuthLogin = ({ email, password }: { email: string; password: string }) => {
  mutate(URL, async (currentData: any) => {
    const data = { email, password };
    const res = await fetcher([URL, { data }]);
    return res;
  });
};

// ----------------------------------------------------------------------
