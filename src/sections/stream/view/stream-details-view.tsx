import { useEffect, useCallback, useState } from 'react';
// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// _mock
import { POST_PUBLISH_OPTIONS } from 'src/_mock';
// api
import { updateStream, useGetStream } from 'src/api/stream';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
//
import { Box, Grid, ListItemText } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { enqueueSnackbar } from 'notistack';
import { StreamDetailsSkeleton } from '../stream-skeleton';
import StreamDetailsToolbar from '../stream-details-toolbar';
import StreamEmbed from '../stream-embed';

// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export default function StreamDetailsView({ id }: Props) {
  const [publish, setPublish] = useState('');

  const { stream, streamLoading, streamError } = useGetStream(id);

  const handleChangePublish = useCallback(
    async (newValue: string) => {
      try {
        setPublish(newValue);
        const data = {
          status: newValue,
          ...(newValue === 'published' && { publishedAt: new Date().toISOString() }),
        };
        await updateStream(id, data);
        await new Promise((resolve) => setTimeout(resolve, 500));
        enqueueSnackbar('Update success!');
      } catch (error) {
        if (typeof error.message === 'string') {
          enqueueSnackbar(error.message, { variant: 'error' });
        } else {
          error.message.map((err: string) => enqueueSnackbar(err, { variant: 'error' }));
        }
      }
      setPublish(newValue);
    },
    [id]
  );

  useEffect(() => {
    if (stream) {
      setPublish(stream?.status);
    }
  }, [stream]);

  const renderSkeleton = <StreamDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${streamError?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.stream.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{
        py: 20,
      }}
    />
  );

  const renderStream = stream && (
    <>
      <StreamDetailsToolbar
        backLink={paths.dashboard.stream.root}
        editLink={paths.dashboard.stream.edit(stream?.id)}
        liveLink={paths.post.details(`${stream?.title}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={POST_PUBLISH_OPTIONS}
      />

      <StreamEmbed youtubeId={stream.youtubeId} slidoId={stream.slidoId} />

      <Grid container>
        <Grid xs={12} md={8}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 5,
            }}
          >
            {stream.title}
          </Typography>
          <Markdown children={stream.content} />
        </Grid>

        <Grid
          xs={12}
          md={4}
          sx={{
            px: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ pt: 3, mb: 3, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}
          >
            Information
          </Typography>

          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
          >
            {[
              {
                label: 'Start Date',
                value: `${fDate(stream.startDate)}`,
                icon: <Iconify icon="solar:calendar-date-bold" />,
              },
              {
                label: 'End Date',
                value: `${fDate(stream.endDate)}`,
                icon: <Iconify icon="solar:calendar-date-bold" />,
              },
              {
                label: 'Time',
                value: `${new Date(stream.startDate).toLocaleTimeString()} - ${new Date(
                  stream.endDate
                ).toLocaleTimeString()}`,
                icon: <Iconify icon="solar:clock-circle-bold" />,
              },
              {
                label: 'Location',
                value: 'Online',
                icon: <Iconify icon="solar:map-bold" />,
              },
              {
                label: 'Speaker',
                value: `${stream.users[0].name}`,
                icon: <Iconify icon="solar:user-rounded-bold" />,
              },
              {
                label: 'Host',
                value: `${stream.users[1].name}`,
                icon: <Iconify icon="solar:user-rounded-bold" />,
              },
            ].map((item) => (
              <Stack key={item.label} spacing={1.5} direction="row">
                {item.icon}
                <ListItemText
                  primary={item.label}
                  secondary={item.value}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.secondary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.primary',
                    component: 'span',
                  }}
                />
              </Stack>
            ))}
          </Box>

          <Box
            display="flex"
            flexWrap="wrap"
            mt={3}
            gap={1}
            sx={{
              py: 2,
              borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {stream.tags.map((tag: any) => (
              <Chip key={tag} label={`#${tag}`} variant="soft" />
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth={false}>
      {streamLoading && renderSkeleton}

      {streamError && renderError}

      {stream && renderStream}
    </Container>
  );
}
