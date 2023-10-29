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

import { ROLE_PERMISSION } from 'src/config-global';
import { RoleBasedGuard } from 'src/auth/guard';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string | number;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const rolesAccess = [...ROLE_PERMISSION.ALL_ACCESS];

  const { user: currentUser, userLoading, userError } = useGetUser(id as number);

  if (userLoading && !userError) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Skeleton />
      </Container>
    );
  }

  return (
    <RoleBasedGuard hasContent roles={rolesAccess} sx={{ py: 10 }}>
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
    </RoleBasedGuard>
  );
}
