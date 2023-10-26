// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// types
import { IStreamItem } from 'src/types/stream';
//
import { StreamItemSkeleton } from './stream-skeleton';
import StreamItemHorizontal from './stream-item-horizontal';

// ----------------------------------------------------------------------

type Props = {
  streams: IStreamItem[];
  meta: any;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onDeleteStream: (id: number) => void;
  loading?: boolean;
};

export default function StreamListHorizontal({ streams, meta, onPageChange, onDeleteStream, loading }: Props) {
  const renderSkeleton = (
    <>
      {[...Array(9)].map((_, index) => (
        <StreamItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {streams.map((stream) => (
        <StreamItemHorizontal key={stream.id} stream={stream} onDeleteStream={onDeleteStream} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {streams.length && meta?.total_page > 1 &&  (
        <Pagination
          count={meta?.total_page}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
          onChange={onPageChange}
        />
      )}
    </>
  );
}
