// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// components
import Iconify from 'src/components/iconify';
// types
import { IPostItem } from 'src/types/blog';
//
import StreamItem from './stream-item';
import { StreamItemSkeleton } from './stream-skeleton';

// ----------------------------------------------------------------------

type Props = {
  // posts: IPostItem[];
  posts: any;
  loading?: boolean;
  disabledIndex?: boolean;
};

export default function StreamList({ posts, loading, disabledIndex }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <StreamItemSkeleton />
        </Grid>
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post: any, index: number) => (
        <Grid key={post.id} xs={12} sm={6} md={!disabledIndex && index === 0 ? 6 : 3}>
          <StreamItem post={post} index={!disabledIndex ? index : undefined} />
        </Grid>
      ))}
    </>
  );

  return (
    <>
      <Grid container spacing={3}>
        {loading ? renderSkeleton : renderList}
      </Grid>

      {posts.length > 8 && (
        <Stack
          alignItems="center"
          sx={{
            mt: 8,
            mb: { xs: 10, md: 15 },
          }}
        >
          <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button>
        </Stack>
      )}
    </>
  );
}
