"use client";

import { useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import useUsersStore, { USERS_LIMIT } from "@/lib/store/users-store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

/**
 * Memoised row — prevents re-render of unchanged rows when pagination
 * or search state changes in the parent.
 */
const UserRow = memo(function UserRow({ user }) {
  return (
    <TableRow hover>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar src={user.image} alt={user.firstName} sx={{ width: 36, height: 36 }} />
          <Typography variant="body2" fontWeight={600}>
            {user.firstName} {user.lastName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.email}</Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          color={user.gender === "male" ? "info" : "secondary"}
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.phone}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>{user.company?.name}</Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View details">
          <IconButton component={Link} href={`/users/${user.id}`} size="small">
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
});

export default function UsersPage() {
  const { users, total, page, search, loading, error, fetchUsers, setPage, setSearch } =
    useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [page, search, fetchUsers]);

  const handleSearchChange = useCallback(
    (e) => setSearch(e.target.value),
    [setSearch]
  );

  const handlePageChange = useCallback(
    (_e, newPage) => setPage(newPage),
    [setPage]
  );

  const emptyMessage = useMemo(
    () => (search ? `No users found for "${search}"` : "No users available"),
    [search]
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Users
      </Typography>

      {/* Search */}
      <TextField
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
        size="small"
        sx={{ mb: 3, maxWidth: 360, width: "100%" }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => <UserRow key={user.id} user={user} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={USERS_LIMIT}
          rowsPerPageOptions={[USERS_LIMIT]}
          onPageChange={handlePageChange}
        />
      </Paper>
    </Box>
  );
}
