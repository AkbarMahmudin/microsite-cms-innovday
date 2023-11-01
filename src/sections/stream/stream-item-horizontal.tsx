// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
import { fLive } from 'src/utils/is-live';
// types
import { IStreamItem, StreamStatusColor } from 'src/types/stream';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useCallback, useState } from 'react';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useSnackbar } from 'notistack';
import { CLIENT_HOST, ROLE_PERMISSION } from 'src/config-global';
import { RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  // post: IPostItem;
  stream: IStreamItem;
  onDeleteStream: (id: number) => void;
};

export default function StreamItemHorizontal({ stream, onDeleteStream }: Props) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const isDeleteConfirm = useBoolean();

  const showShareModal = useBoolean();

  const rolesAccess = [...ROLE_PERMISSION.ALL_ACCESS, ...ROLE_PERMISSION.RESTRICTED];

  const [value, setValue] = useState(CLIENT_HOST);

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const onCopy = useCallback(
    (text: string) => {
      if (text) {
        enqueueSnackbar('Copied!');
        copy(text);
      }
    },
    [copy, enqueueSnackbar]
  );

  const handleClick = useDoubleClick({
    doubleClick: () => onCopy(value),
  });

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  }, []);

  const {
    id,
    slug,
    title,
    status,
    key,
    category,
    thumbnail,
    createdAt,
    description,
    startDate,
    endDate,
  } = stream;

  const statusStreaming = status !== 'draft' && fLive(startDate.toString(), endDate.toString());

  const renderStatusStreaming = statusStreaming && (
    <Label variant="filled" color={statusStreaming === 'Live' ? 'error' : 'warning'}>
      {statusStreaming}
    </Label>
  );

  return (
    <>
      <Stack component={Card} direction="column">
        {mdUp && (
          <Box
            sx={{
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <Stack sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}>
              {renderStatusStreaming}
            </Stack>
            <Image alt={title} src={thumbnail} sx={{ height: 1 }} />
          </Box>
        )}
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {!mdUp && renderStatusStreaming}
              <Label variant="outlined" color={StreamStatusColor[status.toUpperCase()]}>
                {status}
              </Label>
              <Label variant="soft" color="default">
                {category.name}
              </Label>
            </Stack>

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(createdAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <Link
              color="inherit"
              component={RouterLink}
              href={paths.dashboard.stream.details(Number(id))}
            >
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ pt: 3 }}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            {/* <Stack
              spacing={1.5}
              flexGrow={1}
              direction="row"
              justifyContent="flex-end"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Stack direction="row" alignItems="center">
                <Iconify icon="eva:message-circle-fill" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalComments)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalViews)}
              </Stack>

              <Stack direction="row" alignItems="center">
                <Iconify icon="solar:share-bold" width={16} sx={{ mr: 0.5 }} />
                {fShortenNumber(totalShares)}
              </Stack>
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.stream.details(Number(id)));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            showShareModal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <RoleBasedGuard roles={rolesAccess}>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.stream.edit(id));
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              isDeleteConfirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </RoleBasedGuard>
      </CustomPopover>

      <Dialog
        open={showShareModal.value}
        onClose={showShareModal.onFalse}
        PaperProps={{ sx: { py: 3 } }}
        sx={{ '& .MuiDialog-paper': { width: 480 } }}
      >
        <DialogContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Share</Typography>

            <IconButton onClick={showShareModal.onFalse}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack direction="column" spacing={2} alignItems="center">
            <TextField
              fullWidth
              value={slug}
              onChange={handleChange}
              // onDoubleClick={handleClick}
              label="Link by slug"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy">
                      <IconButton onClick={() => onCopy(`${value}/${slug}`)}>
                        <Iconify icon="eva:copy-fill" width={24} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              value={id}
              onChange={handleChange}
              // onDoubleClick={handleClick}
              label="Link by ID"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy">
                      <IconButton onClick={() => onCopy(`${value}/${id}`)}>
                        <Iconify icon="eva:copy-fill" width={24} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            {key && (
              <TextField
                fullWidth
                value={key}
                onChange={handleChange}
                onDoubleClick={handleClick}
                label="Key"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy">
                        <IconButton onClick={() => onCopy(value)}>
                          <Iconify icon="eva:copy-fill" width={24} />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteConfirm.value}
        onClose={isDeleteConfirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => onDeleteStream(Number(id))}>
            Delete
          </Button>
        }
      />
    </>
  );
}
