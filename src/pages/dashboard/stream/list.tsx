import { Helmet } from 'react-helmet-async';
// sections
import { StreamListView } from 'src/sections/stream/view';

// ----------------------------------------------------------------------

export default function StreamListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Stream List</title>
      </Helmet>

      <StreamListView />
    </>
  );
}
