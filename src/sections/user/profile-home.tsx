import { useRef } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
// _mock
import { _socials } from 'src/_mock';
// utils
import { fNumber } from 'src/utils/format-number';
// types
import { IUserProfile, IUserProfilePost } from 'src/types/user';
import { IPostItem } from 'src/types/blog';
// components
import Iconify from 'src/components/iconify';
//
import { NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import ProfilePostItem from './profile-post-item';
import PostItem from '../post/post-item';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IPostItem[];
};

export default function ProfileHome({ info, posts }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderTotalPosts = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {fNumber(posts.length)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Post
          </Box>
        </Stack>

        {/* <Stack width={1}>
          {fNumber(info.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack> */}
      </Stack>
    </Card>
  );

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Stack spacing={3}>{renderTotalPosts}</Stack>
        </Grid>

        <Grid xs={12} md={8}>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
          >
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </Box>
        </Grid>
      </Grid>

      <NavLink to="/dashboard/post/new">
        <Tooltip title="Add new post">
          <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 20, right: 40 }}>
            <Iconify icon="mdi:pencil-add-outline" width={24} sx={{ color: 'text.main' }} />
          </Fab>
        </Tooltip>
      </NavLink>
    </>
  );
}
