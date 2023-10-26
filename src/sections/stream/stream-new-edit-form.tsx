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
// api
import { useGetCategories } from 'src/api/category';
import { createStream, updateStream } from 'src/api/stream';

import StreamDetailsPreview from './stream-details-preview';
import StreamUserAssignDialog from './stream-user-assign-dialog';

// ----------------------------------------------------------------------

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
  currentStream?: IStreamItem;
};

export default function StreamNewEditForm({ currentStream }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const preview = useBoolean();

  const userSpeakerAssign = useBoolean();
  const userOtherRoleAssign = useBoolean();

  const [status, setStatus] = useState(currentStream ? currentStream?.status : 'published');

  const [speaker, setSpeaker] = useState(
    currentStream ? currentStream?.users[0] : { id: 0, name: '', role: '' }
  );
  const [otherRole, setOtherRole] = useState(
    currentStream ? currentStream?.users[1] : { id: 0, name: '', role: '' }
  );

  const { categories, categoriesLoading } = useGetCategories(
    { limit: '*' },
    {
      revalidateOnFocus: true,
      refreshInterval: false,
      dedupingInterval: false,
    }
  );

  const NewStreamSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    youtubeId: Yup.string().required('Youtube ID is required'),
    slidoId: Yup.string().required('Slido ID is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    content: Yup.string().required('Content is required'),
    coverUrl: Yup.mixed<any>().nullable().required('Cover is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    userStream: Yup.string().required('User streamer role is required'),
    // userSpeaker: Yup.string().required('User speaker is required'),
    // not required
    publishedAt: Yup.date(),
  }) as any;

  const defaultValues = useMemo(
    () => ({
      // Post Properties
      title: currentStream?.title || '',
      description: currentStream?.description || '',
      youtubeId: currentStream?.youtubeId || '',
      slidoId: currentStream?.slidoId || '',
      coverUrl: currentStream?.thumbnail || null,
      content: currentStream?.content || '',
      tags: currentStream?.tags || [],
      category: currentStream?.category.id || '',
      // Stream Properties
      startDate: currentStream?.startDate || new Date(),
      endDate: currentStream?.endDate || new Date(),
      //
      userStream:
        currentStream?.users[1].role.replace(/\b\w/g, (c: string) => c.toUpperCase()) || '',
      publishedAt: currentStream?.publishedAt || new Date(),
    }),
    [currentStream]
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
    if (currentStream) {
      reset(defaultValues);
    }
  }, [currentStream, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('youtubeId', data.youtubeId);
      formData.append('slidoId', data.slidoId);
      formData.append('startDate', data.startDate.toISOString() as any);
      formData.append('endDate', data.endDate.toISOString() as any);
      formData.append('content', data.content);
      formData.append('thumbnail', data.coverUrl as any);
      // eslint-disable-next-line no-restricted-syntax
      for (const tag of data.tags) {
        formData.append('tags[]', tag);
      }
      formData.append('categoryId', Number(data.category) as any);
      formData.append('status', status);
      formData.append('publishedAt', data.publishedAt.toISOString() as any);
      formData.append('userStreamIds[speaker]', speaker.id as any);
      formData.append(`userStreamIds[${data.userStream.toLocaleLowerCase()}]`, otherRole.id as any);

      if (currentStream) {
        await updateStream(Number(currentStream.id), formData);
      } else {
        await createStream(formData);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      preview.onFalse();
      enqueueSnackbar(currentStream ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.stream.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      if (typeof error.message === 'string') {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        error.message.map((err: string) => enqueueSnackbar(err, { variant: 'error' }));
      }
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverUrl', newFile as any, { shouldValidate: true });
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

            <RHFTextField name="description" label="Description" fullWidth multiline rows={3} />

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
            <RHFTextField name="youtubeId" label="Youtube ID" />
            <RHFTextField name="slidoId" label="Slido ID" />
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
                defaultValue={new Date((currentStream?.startDate as Date) || new Date())}
                onChange={(e) => methods.setValue('startDate', e as any)}
              />
              <DateTimePicker
                label="End date"
                slotProps={{
                  textField: {
                    name: 'endDate',
                  },
                }}
                defaultValue={new Date((currentStream?.endDate as Date) || new Date())}
                onChange={(e) => methods.setValue('endDate', e as any)}
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
                {speaker.id !== 0 ? (
                  <Tooltip title="Edit speaker">
                    <ListItem key={1} disableGutters onClick={userSpeakerAssign.onTrue}>
                      <ListItemAvatar>
                        <Avatar src="" />
                      </ListItemAvatar>

                      <ListItemText
                        primaryTypographyProps={{
                          typography: 'subtitle2',
                          sx: { mb: 0.25 },
                        }}
                        secondaryTypographyProps={{ typography: 'caption' }}
                        primary={speaker.name}
                        secondary=""
                      />
                    </ListItem>
                  </Tooltip>
                ) : (
                  <Tooltip title="Add speaker">
                    <IconButton
                      onClick={userSpeakerAssign.onTrue}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                        border: (theme) => `dashed 1px ${theme.palette.divider}`,
                      }}
                      name="userSpeaker"
                    >
                      <Iconify icon="mingcute:add-line" />
                    </IconButton>
                  </Tooltip>
                )}

                <StreamUserAssignDialog
                  assignee={speaker}
                  open={userSpeakerAssign.value}
                  onClose={userSpeakerAssign.onFalse}
                  onAssign={setSpeaker}
                />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={10}>
              <StyledLabel sx={{ lineHeight: '40px' }}>
                <RHFAutocomplete
                  name="userStream"
                  options={['Host', 'Moderator'].map((userRole) => userRole)}
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
                {otherRole.id !== 0 ? (
                  <Tooltip title="Edit Host/Moderator">
                    <ListItem key={1} disableGutters onClick={userOtherRoleAssign.onTrue}>
                      <ListItemAvatar>
                        <Avatar src="" />
                      </ListItemAvatar>

                      <ListItemText
                        primaryTypographyProps={{
                          typography: 'subtitle2',
                          sx: { mb: 0.25 },
                        }}
                        secondaryTypographyProps={{ typography: 'caption' }}
                        primary={otherRole.name}
                        secondary=""
                      />
                    </ListItem>
                  </Tooltip>
                ) : (
                  <Tooltip title="Add Host/Moderator">
                    <IconButton
                      onClick={userOtherRoleAssign.onTrue}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                        border: (theme) => `dashed 1px ${theme.palette.divider}`,
                      }}
                    >
                      <Iconify icon="mingcute:add-line" />
                    </IconButton>
                  </Tooltip>
                )}

                <StreamUserAssignDialog
                  assignee={otherRole}
                  open={userOtherRoleAssign.value}
                  onClose={userOtherRoleAssign.onFalse}
                  onAssign={setOtherRole}
                />
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
            {!categoriesLoading && (
              <RHFAutocomplete
                name="category"
                label="Category"
                options={categories.map((category) => category.id)}
                getOptionLabel={(option) =>
                  categories
                    .filter((category) => category.id === option)
                    .map((category) =>
                      category.name.replace(/\b\w/g, (c: string) => c.toUpperCase())
                    )[0] || ''
                }
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => {
                  const { id, name: categoryName } = categories.filter(
                    (category) => category.id === option
                  )[0];

                  if (!categoryName) {
                    return null;
                  }

                  return (
                    <li {...props} key={id}>
                      {categoryName}
                    </li>
                  );
                }}
              />
            )}

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

            <FormControlLabel
              control={
                <Switch
                  checked={status === 'private'}
                  onChange={(e) => {
                    setStatus(e.target.checked ? 'private' : 'draft');
                  }}
                />
              }
              label="Create as private"
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderScheduled = status !== 'published' && status !== 'private' && (
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
            <DateTimePicker
              label="Published date"
              slotProps={{
                textField: {
                  name: 'publishedAt',
                },
              }}
              defaultValue={new Date(currentStream?.publishedAt || (new Date() as Date))}
              onChange={(e) => {
                setStatus('scheduled');
                methods.setValue('publishedAt', e as any);
              }}
            />
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
            <Switch
              checked={status === 'published'}
              onChange={(e) => {
                setStatus(e.target.checked ? 'published' : 'draft');
              }}
            />
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
          {!currentStream ? 'Create Stream' : 'Save Changes'}
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
        youtubeId={values.youtubeId}
        slidoId={values.slidoId}
        startDate={values.startDate as any}
        endDate={values.endDate as any}
        speaker={speaker.name}
        otherRole={{
          name: otherRole.name,
          role: values.userStream,
        }}
        tags={values.tags}
        // description={values.description}
        thumbnail={
          typeof values.coverUrl === 'string'
            ? values.coverUrl
            : `${(values.coverUrl as unknown as CustomFile)?.preview}`
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
