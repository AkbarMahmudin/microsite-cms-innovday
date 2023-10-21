// @mui
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { ICategoryTableFilters, ICategoryTableFilterValue } from 'src/types/category';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ICategoryTableFilters;
  onFilters: (name: string, value: ICategoryTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function CategoryTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>
    </Stack>
  );
}
