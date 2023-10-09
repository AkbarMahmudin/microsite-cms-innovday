import { Helmet } from 'react-helmet-async';
// sections
import { RoleListView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

export default function RoleListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Role List</title>
      </Helmet>

      <RoleListView />
    </>
  );
}
