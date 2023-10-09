import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { _tags } from 'src/_mock';
// types
import { IStreamItem } from 'src/types/stream';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
//
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  alpha,
  styled,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import StreamDetailsPreview from './stream-details-preview';
import StreamUserAssignDialog from './stream-user-assign-dialog';

// ----------------------------------------------------------------------

const categories = ['All', 'App', 'Website', 'Landing Page', 'Dashboard', 'UI Kit'];

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  fontSize: 14,
  width: '30%',
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IStreamItem;
};

export default function StreamNewEditForm({ currentPost }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const userAssign = useBoolean();

  const [isPublished, setIsPublished] = useState(currentPost?.publish === 'published');

  const NewStreamSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    // description: Yup.string().required('Description is required'),
    youtubeID: Yup.string().required('Youtube ID is required'),
    slidoID: Yup.string().required('Slido ID is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    content: Yup.string().required('Content is required'),
    coverUrl: Yup.mixed<any>().nullable().required('Cover is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    category: Yup.string().required('Category is required'),
    // not required
    metaTitle: Yup.string(),
    metaDescription: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentPost?.title || '',
      // description: currentPost?.description || '',
      youtubeID: currentPost?.youtubeID || '',
      slidoID: currentPost?.slidoID || '',
      startDate: currentPost?.startDate || new Date(),
      endDate: currentPost?.endDate || new Date(),
      content: currentPost?.content || '',
      coverUrl: currentPost?.coverUrl || null,
      tags: currentPost?.tags || [],
      metaKeywords: currentPost?.metaKeywords || [],
      metaTitle: currentPost?.metaTitle || '',
      metaDescription: currentPost?.metaDescription || '',
      category: currentPost?.category || '',
    }),
    [currentPost]
  );

  const methods = useForm({
    resolver: yupResolver(NewStreamSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPost) {
      reset(defaultValues);
    }
  }, [currentPost, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      enqueueSnackbar(currentPost ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.stream.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="title" label="Stream Title" />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="content" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Thumbnail</Typography>
              <RHFUpload
                name="coverUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderStreamProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Streaming Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional streaming functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="youtubeID" label="Youtube ID" />
            <RHFTextField name="slidoID" label="Slido ID" />
            <Box
              rowGap={1}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <DateTimePicker
                label="Start date"
                slotProps={{
                  textField: {
                    name: 'startDate',
                  },
                }}
              />
              <DateTimePicker
                label="End date"
                slotProps={{
                  textField: {
                    name: 'endDate',
                  },
                }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const userStreamProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            User Streamer
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional user streamer as contributor in this stream...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="User streamer" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row" spacing={10}>
              <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Speaker</StyledLabel>

              <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
                <Tooltip title="Edit speaker">
                  <ListItem key={1} disableGutters onClick={userAssign.onTrue}>
                    <ListItemAvatar>
                      <Avatar src="https://mui.com/static/images/avatar/1.jpg" />
                    </ListItemAvatar>

                    <ListItemText
                      primaryTypographyProps={{
                        typography: 'subtitle2',
                        sx: { mb: 0.25 },
                      }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary="Ming"
                      secondary="ming@mail.com"
                    />
                  </ListItem>
                </Tooltip>

                {/* <Tooltip title="Add speaker">
                  <IconButton
                    onClick={userAssign.onTrue}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Iconify icon="mingcute:add-line" />
                  </IconButton>
                </Tooltip> */}

                {/* <StreamUserAssignDialog
                  // assignee={task.assignee}
                  open={userAssign.value}
                  onClose={userAssign.onFalse}
                /> */}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={10}>
              <StyledLabel sx={{ lineHeight: '40px' }}>
                <RHFAutocomplete
                  name="userStream"
                  options={['Host', 'Moderator'].map((user) => user)}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => {
                    const userName = ['Host', 'Moderator'].filter((user) => user === option)[0];

                    if (!userName) {
                      return null;
                    }

                    return (
                      <li {...props} key={userName}>
                        {userName}
                      </li>
                    );
                  }}
                />
              </StyledLabel>

              <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
                {/* {task.assignee.map((user) => (
                  <Avatar key={user.id} alt={user.name} src={user.avatarUrl} />
                ))} */}

                <Tooltip title="Add moderator / host">
                  <IconButton
                    onClick={userAssign.onTrue}
                    sx={{
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      border: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Iconify icon="mingcute:add-line" />
                  </IconButton>
                </Tooltip>

                <StreamUserAssignDialog
                  // assignee={task.assignee}
                  open={userAssign.value}
                  onClose={userAssign.onFalse}
                />

                {/* <KanbanContactsDialog
                  // assignee={task.assignee}
                  // open={contacts.value}
                  // onClose={contacts.onFalse}
                /> */}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFAutocomplete
              name="category"
              label="Category"
              options={categories.map((category) => category)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={(props, option) => {
                const categoryName = categories.filter((category) => category === option)[0];

                if (!categoryName) {
                  return null;
                }

                return (
                  <li {...props} key={categoryName}>
                    {categoryName}
                  </li>
                );
              }}
            />

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            {/* <RHFTextField name="metaTitle" label="Meta title" />

            <RHFTextField
              name="metaDescription"
              label="Meta description"
              fullWidth
              multiline
              rows={3}
            />

            <RHFAutocomplete
              name="metaKeywords"
              label="Meta keywords"
              placeholder="+ Keywords"
              multiple
              freeSolo
              disableCloseOnSelect
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            <FormControlLabel control={<Switch />} label="Create as private" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderScheduled = !isPublished && (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Scheduled
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your stream will be published at...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Published at" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <DateTimePicker defaultValue={new Date()} label="Published date" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          }
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <Button color="inherit" variant="outlined" size="large" onClick={preview.onTrue}>
          Preview
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? 'Create Stream' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderStreamProperties}

        {userStreamProperties}

        {renderProperties}

        {renderScheduled}

        {renderActions}
      </Grid>

      <StreamDetailsPreview
        title={values.title}
        content={values.content}
        // description={values.description}
        coverUrl={
          typeof values.coverUrl === 'string'
            ? values.coverUrl
            : `${(values.coverUrl as CustomFile)?.preview}`
        }
        //
        open={preview.value}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={preview.onFalse}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
}
