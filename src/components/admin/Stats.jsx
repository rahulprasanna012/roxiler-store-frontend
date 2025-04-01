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
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating as MuiRating
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  FilterAlt as FilterIcon,
  StarHalf as StarHalfIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AdminServices from '../../services/adminService';
import UserServices from '../../services/userService';
import RatingServices from '../../services/ratingService';

const StatsDashboard = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingRatings, setLoadingRatings] = useState({});
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedUserRatings, setSelectedUserRatings] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');

  // Filters
  const initialFilters = {
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    address: searchParams.get('address') || '',
    role: searchParams.get('role') || ''
  };
  const [filters, setFilters] = useState(initialFilters);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, usersData] = await Promise.all([
          AdminServices.getDashboardStats(),
          UserServices.getAllUsers()
        ]);
        
        setStats(statsData);
        setAllUsers(usersData);
        setFilteredUsers(usersData);
        
        // Pre-fetch ratings for store owners
        const storeOwners = usersData.filter(user => user.role === 'store_owner');
        await fetchRatingsForUsers(storeOwners);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch ratings for store owners
  const fetchRatingsForUsers = async (users) => {
    const storeOwners = users.filter(user => user.role === 'store_owner');
    const newRatings = { ...userRatings };
    const newLoadingRatings = { ...loadingRatings };
  
    for (const user of storeOwners) {
      if (!userRatings[user.id]) {
        newLoadingRatings[user.id] = true;
        try {
          const response = await RatingServices.getUserRatings(user.id);
          // Ensure we're using the correct data structure
          const ratingsData = response.data || response; // Handle both cases
          newRatings[user.id] = {
            data: Array.isArray(ratingsData) ? ratingsData : ratingsData.data,
            count: Array.isArray(ratingsData) ? ratingsData.length : ratingsData.count
          };
        } catch (error) {
          console.error(`Error fetching ratings for user ${user.id}:`, error);
          newRatings[user.id] = {
            data: [],
            count: 0
          };
        } finally {
          newLoadingRatings[user.id] = false;
        }
      }
    }
  
    setUserRatings(newRatings);
    setLoadingRatings(newLoadingRatings);
  };
  // Apply filters
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
    setPage(0);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
    
    setFiltersApplied(Object.values(filters).some(Boolean));

    // Fetch ratings for new store owners in filtered results
    const newStoreOwners = filtered.filter(
      user => user.role === 'store_owner' && !userRatings[user.id]
    );
    if (newStoreOwners.length > 0) {
      fetchRatingsForUsers(newStoreOwners);
    }
  }, [filters, allUsers, setSearchParams]);

  // View ratings details
  const handleViewRatings = async (userId, userName) => {
    try {
      setSelectedUserName(userName);
      setRatingDialogOpen(true);
      
      if (userRatings[userId]) {
        setSelectedUserRatings(userRatings[userId].data);
      } else {
        const response = await RatingServices.getUserRatings(userId);
        setSelectedUserRatings(response.data.data);
        
        // Update cache
        setUserRatings(prev => ({
          ...prev,
          [userId]: response.data
        }));
      }
    } catch (error) {
      console.error('Error viewing ratings:', error);
    }
  };

  // Close ratings dialog
  const handleCloseRatingDialog = () => {
    setRatingDialogOpen(false);
    setSelectedUserRatings([]);
    setSelectedUserName('');
  };

  // Table pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter handlers
  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };
  const clearFilter = (field) => {
    setFilters(prev => ({ ...prev, [field]: '' }));
  };
  const clearAllFilters = () => {
    setFilters({
      name: '',
      email: '',
      address: '',
      role: ''
    });
    setSearchParams({});
  };

  // Get role color for chips
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'store_owner': return 'warning';
      default: return 'primary';
    }
  };

  // Calculate average rating
  const calculateAverageRating = (ratings) => {
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return 0;
    const validRatings = ratings.filter(r => typeof r.rating === 'number');
    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / validRatings.length).toFixed(1);
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

      {/* Users Table */}
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                      <TableCell>Ratings</TableCell>
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
                                {user.role === 'store_owner' ? (
                                    loadingRatings[user.id] ? (
                                    <CircularProgress size={24} />
                                    ) : userRatings[user.id] ? (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<StarHalfIcon color="warning" />}
                                        onClick={() => handleViewRatings(user.id, user.name)}
                                    >
                                        {userRatings[user.id].data.length > 0 ? 
                                        `${calculateAverageRating(userRatings[user.id].data)} (${userRatings[user.id].count})` : 
                                        'No ratings'}
                                    </Button>
                                    ) : (
                                    <Typography color="textSecondary">N/A</Typography>
                                    )
                                ) : (
                                    <Typography color="textSecondary">-</Typography>
                                )}
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

      {/* Ratings Dialog */}
      <Dialog
        open={ratingDialogOpen}
        onClose={handleCloseRatingDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Ratings for {selectedUserName}
            </Typography>
            <IconButton onClick={handleCloseRatingDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUserRatings.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Store</TableCell>
                    <TableCell>Rater</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedUserRatings.map((rating) => (
                    <TableRow key={rating._id}>
                      <TableCell>{rating.store?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={rating.rater?.avatar} 
                            sx={{ width: 24, height: 24, mr: 1 }}
                          >
                            {rating.rater?.name?.charAt(0) || '?'}
                          </Avatar>
                          {rating.rater?.name || 'Anonymous'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <MuiRating 
                          value={rating.rating} 
                          precision={0.5} 
                          readOnly 
                        />
                      </TableCell>
                      <TableCell>
                        {rating.comment || 'No comment'}
                      </TableCell>
                      <TableCell>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No ratings found for this user
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatsDashboard;