import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SearchNotFound from 'src/components/search-not-found';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// api
import { useGetUsers } from 'src/api/user';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

type Props = {
  open: boolean;
  onClose: VoidFunction;
  assignee?: any;
  // assignee?: IKanbanAssignee[];
  onAssign: any;
};

export default function StreamUserAssignDialog({ assignee = {}, open, onClose, onAssign = null }: Props) {
  const [searchName, setSearchName] = useState(assignee.id ? assignee.name[0] : '');
  const filterName = useDebounce(searchName, 500);
  const { users, usersLoading, usersEmpty } = useGetUsers({
    limit: 10,
    page: 1,
    name: filterName,
  });

  const handleSearchNames = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  }, []);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Users <Typography component="span">({users.length})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={searchName}
          onChange={handleSearchNames}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {usersEmpty ? (
          <SearchNotFound query={searchName} sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar
            sx={{
              px: 2.5,
              height: ITEM_HEIGHT * 6,
            }}
          >
            {!usersLoading &&
              users.map((user) => {
                // const checked = assignee.map((person) => person.name).includes(user.name);
                const checked = assignee.id === user.id;

                return (
                  <ListItem
                    key={user.id}
                    disableGutters
                    secondaryAction={
                      <Button
                        size="small"
                        color={checked ? 'primary' : 'inherit'}
                        startIcon={
                          <Iconify
                            width={16}
                            icon={checked ? 'eva:checkmark-fill' : 'mingcute:add-line'}
                            sx={{ mr: -0.5 }}
                          />
                        }
                        onClick={() => {
                          assignee = user;
                          onAssign(user);
                        }}
                      >
                        {checked ? 'Assigned' : 'Assign'}
                      </Button>
                    }
                    sx={{ height: ITEM_HEIGHT }}
                  >
                    <ListItemAvatar>
                      <Avatar src={user.avatarUrl} />
                    </ListItemAvatar>

                    <ListItemText
                      primaryTypographyProps={{
                        typography: 'subtitle2',
                        sx: { mb: 0.25 },
                      }}
                      secondaryTypographyProps={{ typography: 'caption' }}
                      primary={user.name}
                      secondary={user.email}
                    />
                  </ListItem>
                );
              })}
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
