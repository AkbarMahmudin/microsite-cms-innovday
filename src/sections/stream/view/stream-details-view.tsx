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
import { useGetPost } from 'src/api/blog';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
//
import { Box, Grid, ListItemText } from '@mui/material';
import { StreamDetailsSkeleton } from '../stream-skeleton';
import StreamDetailsToolbar from '../stream-details-toolbar';
import StreamEmbed from '../stream-embed';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

export default function StreamDetailsView({ title }: Props) {
  const [publish, setPublish] = useState('');

  const { post, postLoading, postError } = useGetPost(title);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  useEffect(() => {
    if (post) {
      setPublish(post?.publish);
    }
  }, [post]);

  const renderSkeleton = <StreamDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${postError?.message}`}
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

  const renderStream = post && (
    <>
      <StreamDetailsToolbar
        backLink={paths.dashboard.stream.root}
        editLink={paths.dashboard.stream.edit(`${post?.title}`)}
        liveLink={paths.post.details(`${post?.title}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={POST_PUBLISH_OPTIONS}
      />

      {/* <StreamDetailsHero title={post.title} coverUrl={post.coverUrl} /> */}

      <StreamEmbed youtubeId="mccYpk0cEqw" slidoId="tME59qcyfHWjrBP9NgNfj4" />
      {/* <StreamEmbed youtubeId="mccYpk0cEqw" /> */}

      <Grid container>
        <Grid xs={12} md={8}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 5,
            }}
          >
            {title}
          </Typography>
          <Markdown children={post.content} />
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
                value: 'Wed, 20 Oct 2021',
                icon: <Iconify icon="solar:calendar-date-bold" />,
              },
              {
                label: 'End Date',
                value: 'Wed, 20 Oct 2021',
                icon: <Iconify icon="solar:calendar-date-bold" />,
              },
              {
                label: 'Time',
                value: '10:00 AM - 11:00 AM',
                icon: <Iconify icon="solar:clock-circle-bold" />,
              },
              {
                label: 'Location',
                value: 'Online',
                icon: <Iconify icon="solar:map-bold" />,
              },
              {
                label: 'Speaker',
                value: 'Mr. John Doe',
                icon: <Iconify icon="solar:user-rounded-bold" />,
              },
              {
                label: 'Host',
                value: 'Mrs. Mary Doe',
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
            {post.tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} variant="soft" />
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth={false}>
      {postLoading && renderSkeleton}

      {postError && renderError}

      {post && renderStream}
    </Container>
  );
}
