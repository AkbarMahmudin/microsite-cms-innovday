import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { StreamEditView } from 'src/sections/stream/view';

// ----------------------------------------------------------------------

export default function StreamEditPage() {
  const params = useParams();

  const { title } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Stream Edit</title>
      </Helmet>

      <StreamEditView title={`${title}`} />
    </>
  );
}
