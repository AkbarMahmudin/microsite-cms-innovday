import { Helmet } from 'react-helmet-async';
// sections
import { PostListHomeView } from 'src/sections/post/view';

// ----------------------------------------------------------------------

export default function PostListHomePage() {
  return (
    <>
      <Helmet>
        <title> Post: List</title>
      </Helmet>

      <PostListHomeView />
    </>
  );
}
