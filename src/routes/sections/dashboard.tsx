import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// CATEGORY
const CategoryListPage = lazy(() => import('src/pages/dashboard/category/list'));
// ROLE
const RoleListPage = lazy(() => import('src/pages/dashboard/role/list'));
// POST
const PostPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const PostPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const PostNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const PostEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// STREAM
const StreamsPage = lazy(() => import('src/pages/dashboard/stream/list'));
const StreamPage = lazy(() => import('src/pages/dashboard/stream/details'));
const StreamNewPage = lazy(() => import('src/pages/dashboard/stream/new'));
const StreamEditPage = lazy(() => import('src/pages/dashboard/stream/edit'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      {
        path: 'user',
        children: [
          { element: <UserListPage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'role',
        children: [{ element: <RoleListPage />, index: true }],
      },
      {
        path: 'category',
        children: [{ element: <CategoryListPage />, index: true }],
      },
      {
        path: 'post',
        children: [
          { element: <PostPostsPage />, index: true },
          { path: 'list', element: <PostPostsPage /> },
          { path: ':title', element: <PostPostPage /> },
          { path: ':title/edit', element: <PostEditPostPage /> },
          { path: 'new', element: <PostNewPostPage /> },
        ],
      },
      {
        path: 'stream',
        children: [
          { element: <StreamsPage />, index: true },
          { path: 'list', element: <StreamsPage /> },
          { path: ':idOrSlug', element: <StreamPage /> },
          { path: ':idOrSlug/edit', element: <StreamEditPage /> },
          { path: 'new', element: <StreamNewPage /> },
        ],
      },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
