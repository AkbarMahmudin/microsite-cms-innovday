import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import {
  ICategoryItem,
  ICategoryTableFilters,
  ICategoryTableFilterValue,
} from 'src/types/category';
// api
import { deleteCategories, deleteCategory, useGetCategories } from 'src/api/category';

import { enqueueSnackbar } from 'notistack';

import { RoleBasedGuard } from 'src/auth/guard';
import { ROLE_PERMISSION } from 'src/config-global';

import CategoryTableToolbar from '../category-table-toolbar';
import CategoryTableFiltersResult from '../category-table-filters-result';
import CategoryTableRow from '../category-table-row';
import CategoryQuickNewEditForm from '../category-quick-new-edit-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'slug', label: 'Slug' },
  { id: '', width: 88 },
];

const defaultFilters: ICategoryTableFilters = {
  name: '',
  slug: '',
};

// ----------------------------------------------------------------------

export default function CategoryListView() {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const quickNew = useBoolean();

  const rolesAccess = [...ROLE_PERMISSION.ALL_ACCESS, ...ROLE_PERMISSION.RESTRICTED];

  const [filters, setFilters] = useState(defaultFilters);

  const filteredByName = useDebounce(filters.name, 1000);

  const { categories, meta, categoriesEmpty } = useGetCategories({
    name: filteredByName,
    limit: table.rowsPerPage,
    page: table.page + 1,
    sort: {
      [table.orderBy]: table.order,
    },
  });

  const dataFiltered = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = categories;

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: ICategoryTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    async (id: string) => {
      await deleteCategory(Number(id));
      categories.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, categories]
  );

  const handleDeleteRows = useCallback(async () => {
    await deleteCategories(table.selected as unknown as number[]);

    enqueueSnackbar('Delete success!');

    table.onUpdatePageDeleteRows({
      totalRows: meta?.total_data || 5,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, meta]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <RoleBasedGuard hasContent roles={rolesAccess} sx={{ py: 10 }}>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Category', href: paths.dashboard.category.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={quickNew.onTrue}
            >
              New Category
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <CategoryQuickNewEditForm open={quickNew.value} onClose={quickNew.onFalse} />

        <Card>
          <CategoryTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <CategoryTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={meta?.total_data}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={categories.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  categories.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={categories.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      categories.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {categories.map((row) => (
                    <CategoryTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={
                      categoriesEmpty
                        ? emptyRows(table.page, table.rowsPerPage, categories.length)
                        : 0
                    }
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={meta?.total_data || 5}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </RoleBasedGuard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: ICategoryItem[];
  comparator: (a: any, b: any) => number;
  filters: ICategoryTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
