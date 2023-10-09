// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
// components
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
//
import { Box, Grid, ListItemText } from '@mui/material';
import Iconify from 'src/components/iconify';
import StreamEmbed from './stream-embed';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  // description: string;
  coverUrl: string;
  //
  open: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onClose: VoidFunction;
  onSubmit: VoidFunction;
};

export default function StreamDetailsPreview({
  title,
  coverUrl,
  content,
  // description,
  //
  open,
  isValid,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const hasContent = title || content || coverUrl;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Preview
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Post
        </LoadingButton>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Scrollbar>
          <Container sx={{ mt: 5, mb: 10 }}>
            <StreamEmbed youtubeId="mccYpk0cEqw" autoplay />

            <Grid container>
              <Grid xs={12} md={8}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    mb: 5,
                  }}
                >
                  {title}
                </Typography>
                <Markdown children={content} />
              </Grid>
              <Grid
                xs={12}
                md={4}
                sx={{
                  px: 3,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ pt: 3, mb: 3, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}
                >
                  Information
                </Typography>

                <Box
                  gap={3}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                >
                  {[
                    {
                      label: 'Start Date',
                      value: 'Wed, 20 Oct 2021',
                      icon: <Iconify icon="solar:calendar-date-bold" />,
                    },
                    {
                      label: 'End Date',
                      value: 'Wed, 20 Oct 2021',
                      icon: <Iconify icon="solar:calendar-date-bold" />,
                    },
                    {
                      label: 'Time',
                      value: '10:00 AM - 11:00 AM',
                      icon: <Iconify icon="solar:clock-circle-bold" />,
                    },
                    {
                      label: 'Location',
                      value: 'Online',
                      icon: <Iconify icon="solar:map-bold" />,
                    },
                    {
                      label: 'Speaker',
                      value: 'Mr. John Doe',
                      icon: <Iconify icon="solar:user-rounded-bold" />,
                    },
                    {
                      label: 'Host',
                      value: 'Mrs. Mary Doe',
                      icon: <Iconify icon="solar:user-rounded-bold" />,
                    },
                  ].map((item) => (
                    <Stack key={item.label} spacing={1.5} direction="row">
                      {item.icon}
                      <ListItemText
                        primary={item.label}
                        secondary={item.value}
                        primaryTypographyProps={{
                          typography: 'body2',
                          color: 'text.secondary',
                          mb: 0.5,
                        }}
                        secondaryTypographyProps={{
                          typography: 'subtitle2',
                          color: 'text.primary',
                          component: 'span',
                        }}
                      />
                    </Stack>
                  ))}
                </Box>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  mt={3}
                  gap={1}
                  sx={{
                    py: 2,
                    borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
                    borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                  }}
                >
                  {/* {tags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} variant="soft" />
                  ))} */}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent filled title="Empty Content!" />
      )}
    </Dialog>
  );
}
