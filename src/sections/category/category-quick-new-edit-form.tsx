import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { ICategoryItem } from 'src/types/category';
import { createCategory, updateCategory } from 'src/api/category';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentCategory?: ICategoryItem;
};

export default function UserQuickNewEditForm({ currentCategory, open, onClose }: Props) {
  // const [categoryCountFields, setCategoryCountFields] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

  const NewCategorySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
    }),
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      let message = 'Create success!';
      if (currentCategory) {
        message = 'Update success!';
        await updateCategory(Number(currentCategory?.id), data);
      } else {
        await createCategory(data);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      enqueueSnackbar(message);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentCategory ? 'Quick Update' : 'New Category'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }} />

            <RHFTextField name="name" label="Name" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentCategory ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
