import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userAbout } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { Navigate } from 'react-router-dom';
import { useAuthContext } from 'src/auth/hooks';
import ProfileCover from '../profile-cover';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: <Iconify icon="solar:settings-bold" width={24} />,
  },
  // {
  //   value: 'friends',
  //   label: 'Friends',
  //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  // },
  // {
  //   value: 'gallery',
  //   label: 'Gallery',
  //   icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('profile');

  // const { posts, postsLoading } = useGetPosts();

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Profile', href: paths.dashboard.user.profile },
          { name: user?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={user?.role.name}
          name={user?.name}
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {/* {currentTab === 'profile' && <ProfileHome info={_userAbout} posts={posts} />} */}

      {currentTab === 'settings' && <Navigate to="/dashboard/user/account" />}
    </Container>
  );
}
