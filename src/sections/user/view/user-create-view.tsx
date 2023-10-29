// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { RoleBasedGuard } from 'src/auth/guard';
import { ROLE_PERMISSION } from 'src/config-global';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();

  const rolesAccess = [...ROLE_PERMISSION.ALL_ACCESS];

  return (
    <RoleBasedGuard hasContent roles={rolesAccess} sx={{ py: 10 }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new user"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'User',
              href: paths.dashboard.user.root,
            },
            { name: 'New user' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserNewEditForm />
      </Container>
    </RoleBasedGuard>
  );
}
