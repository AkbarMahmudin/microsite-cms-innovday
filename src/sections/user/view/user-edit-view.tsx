// @mui
import Container from '@mui/material/Container';
import { Skeleton } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// api
import { useGetUser } from 'src/api/user';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string | number;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { user: currentUser, userLoading } = useGetUser(id as number);

  if (userLoading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Skeleton />
      </Container>
    );
  }

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
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* {userAuth?.role.name.toLowerCase() === 'admin' && <UserNewEditForm currentUser={currentUser} />} */}
      <UserNewEditForm currentUser={currentUser} />
    </Container>
  );
}
