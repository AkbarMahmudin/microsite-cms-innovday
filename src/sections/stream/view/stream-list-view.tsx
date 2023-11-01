import { useCallback, useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// _mock
import { POST_SORT_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { IStreamFilters, IStreamFilterValue, StreamStatusColor } from 'src/types/stream';
// api
import { deleteStream, useGetStreams } from 'src/api/stream';

import { ROLE_PERMISSION } from 'src/config-global';
import { RoleBasedGuard } from 'src/auth/guard';

import { enqueueSnackbar } from 'notistack';
import StreamSort from '../stream-sort';
import StreamSearch from '../stream-search';
import StreamListHorizontal from '../stream-list-horizontal';

// ----------------------------------------------------------------------

const defaultFilters: IStreamFilters = {
  publish: 'all',
  page: 1,
};

// ----------------------------------------------------------------------

export default function StreamListView() {
  const settings = useSettingsContext();

  const rolesAccess = [...ROLE_PERMISSION.ALL_ACCESS, ...ROLE_PERMISSION.RESTRICTED];

  const [sortBy, setSortBy] = useState('latest');

  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState('');

  const [configs, setConfigs] = useState({
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    keepPreviousData: true,
    // refreshInterval: 5000,
    // revalidateOnMount: true,
    // dedupingInterval: 5000,
  });

  const debouncedQuery = useDebounce(searchQuery);

  const { streams: searchResults, streamsLoading: searchLoading } = useGetStreams({
    title: debouncedQuery,
  });

  const { streams, status, meta, streamsLoading } = useGetStreams(
    {
      limit: 9,
      page: filters.page,
      status: filters.publish !== 'all' ? filters.publish : '',
      sort: {
        createdAt: sortBy === 'latest' ? 'desc' : 'asc',
      },
    },
    configs
  );

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name: string, value: IStreamFilterValue) => {
    setFilters((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('page', 1);
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      handleFilters('page', page);
    },
    [handleFilters]
  );

  const handleDeleteStream = useCallback(async (id: number) => {
    try {
      await deleteStream(id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Delete success!');

      setConfigs((prevState: any) => ({
        ...prevState,
        revalidateOnFocus: false,
        refreshInterval: 1000,
        dedupingInterval: 1000,
      }));

      setTimeout(() => {
        setConfigs((prevState: any) => ({
          ...prevState,
          revalidateOnFocus: true,
          refreshInterval: false,
          dedupingInterval: false,
        }));
      }, 5000);
    } catch (error) {
      if (typeof error.message === 'string') {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        error.message.map((err: string) => enqueueSnackbar(err, { variant: 'error' }));
      }
    }
  }, []);

  return (
    <RoleBasedGuard hasContent roles={[...rolesAccess, ...ROLE_PERMISSION.READ_ONLY]} sx={{ py: 10 }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Stream',
              href: paths.dashboard.stream.root,
            },
            {
              name: 'List',
            },
          ]}
          action={
            <RoleBasedGuard roles={rolesAccess}>
              <Button
                component={RouterLink}
                href={paths.dashboard.stream.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Stream
              </Button>
            </RoleBasedGuard>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Stack
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-end', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <StreamSearch
            query={debouncedQuery}
            results={searchResults}
            onSearch={handleSearch}
            loading={searchLoading}
            hrefItem={(slug: string) => paths.dashboard.stream.details(slug)}
          />

          <StreamSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
        </Stack>

        {!streamsLoading && (
          <Tabs
            value={filters.publish}
            onChange={handleFilterPublish}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          >
            {[...Object.keys(status)]
              .map((tab) => (
                <Tab
                  key={tab}
                  iconPosition="end"
                  value={tab}
                  label={tab}
                  icon={
                    <Label
                      variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                      color={StreamStatusColor[tab.toUpperCase()]}
                    >
                      {status[tab]}
                    </Label>
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              ))
              .sort((a, b) => {
                if (a.key === 'all') return -1;
                if (b.key === 'all') return 1;
                return 0;
              })}
          </Tabs>
        )}

        <StreamListHorizontal
          streams={streams}
          meta={meta}
          onPageChange={handlePageChange}
          onDeleteStream={handleDeleteStream}
          loading={streamsLoading}
        />
      </Container>
    </RoleBasedGuard>
  );
}
