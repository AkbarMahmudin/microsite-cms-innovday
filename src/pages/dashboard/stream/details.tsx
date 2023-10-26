import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { StreamDetailsView } from 'src/sections/stream/view';

// ----------------------------------------------------------------------

export default function StreamDetailsPage() {
  const params = useParams();

  const { idOrSlug } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Stream Details</title>
      </Helmet>

      <StreamDetailsView id={Number(idOrSlug)} />
    </>
  );
}
