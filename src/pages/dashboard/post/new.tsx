import { Helmet } from 'react-helmet-async';
// sections
import { PostCreateView } from 'src/sections/post/view';

// ----------------------------------------------------------------------

export default function PostCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new post</title>
      </Helmet>

      <PostCreateView />
    </>
  );
}
