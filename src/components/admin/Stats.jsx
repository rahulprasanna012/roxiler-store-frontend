import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  useTheme,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import AdminServices from '../../services/adminService';
import UserServices from '../../services/userService';

const StatsDashboard = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Initialize filters from URL or use defaults
  const initialFilters = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    address: searchParams.get('address') || '',
    role: searchParams.get('role') || ''
  };
  const [filters, setFilters] = useState(initialFilters);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, usersData] = await Promise.all([
          AdminServices.getDashboardStats(),
          UserServices.getAllUsers({}) // Get all users without filtering
        ]);
        setStats(statsData);
        setAllUsers(usersData);
        setFilteredUsers(usersData); // Initialize filteredUsers with all users
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever filters or allUsers change
  useEffect(() => {
    const filtered = allUsers.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
      const addressMatch = filters.address === '' || 
                         (user.address && user.address.toLowerCase().includes(filters.address.toLowerCase()));
      const roleMatch = filters.role === '' || user.role === filters.role;
      
      return nameMatch && emailMatch && addressMatch && roleMatch;
    });
    
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filters change
    
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    
    // Check if any filters are applied
    setFiltersApplied(Object.values(filters).some(Boolean));
  }, [filters, allUsers, setSearchParams]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const clearFilter = (field) => {
    setFilters(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      name: '',
      email: '',
      address: '',
      role: ''
    });
    setSearchParams({}); // Clear all query params
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'store_owner': return 'warning';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {stats.userCount || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                  <StoreIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Stores
                  </Typography>
                  <Typography variant="h4">
                    {stats.storesCount || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                  <StarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="textSecondary">
                    Total Ratings
                  </Typography>
                  <Typography variant="h4">
                    {stats.ratingCount || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

        
        {/* Other stat cards... */}
      

      {/* Users Table with Filters */}
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            {filtersApplied && (
              <Button
                startIcon={<ClearIcon />}
                onClick={clearAllFilters}
                color="error"
                size="small"
                variant="outlined"
              >
                Clear Filters
              </Button>
            )}
          </Box>
          
          {/* Filter Controls */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Name"
                value={filters.name}
                onChange={handleFilterChange('name')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.name && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter('name')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Email"
                value={filters.email}
                onChange={handleFilterChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.email && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter('email')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Address"
                value={filters.address}
                onChange={handleFilterChange('address')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.address && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter('address')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Role"
                value={filters.role}
                onChange={handleFilterChange('role')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.role && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => clearFilter('role')}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="store_owner">Store Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {filteredUsers.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 4,
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 1
            }}>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                No users match your filters
              </Typography>
              <Button 
                variant="outlined" 
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                bgcolor: theme.palette.info.main, 
                                mr: 2,
                                width: 32,
                                height: 32
                              }}>
                                <PersonIcon fontSize="small" />
                              </Avatar>
                              <Typography>{user.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.address || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              color={getRoleColor(user.role)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsDashboard;