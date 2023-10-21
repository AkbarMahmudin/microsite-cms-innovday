// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { ICategoryItem } from 'src/types/category';
// components
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import CategoryQuickNewEditForm from './category-quick-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: ICategoryItem;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function CategoryTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, slug } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{slug}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" placement="top" arrow>
            <IconButton
              color="error"
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CategoryQuickNewEditForm
        currentCategory={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
