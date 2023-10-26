// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetStream } from 'src/api/stream';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import StreamNewEditForm from '../stream-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: number;
};

export default function StreamEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { stream: currentStream, streamLoading } = useGetStream(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Stream',
            href: paths.dashboard.stream.root,
          },
          {
            name: currentStream?.title,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {!streamLoading && <StreamNewEditForm currentStream={currentStream} />}
    </Container>
  );
}
