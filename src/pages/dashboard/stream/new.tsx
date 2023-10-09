import { Helmet } from 'react-helmet-async';
// sections
import { StreamCreateView } from 'src/sections/stream/view';

// ----------------------------------------------------------------------

export default function StreamCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new stream</title>
      </Helmet>

      <StreamCreateView />
    </>
  );
}
