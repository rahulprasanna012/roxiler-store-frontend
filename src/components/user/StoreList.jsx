import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Rating as MuiRating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Store as StoreIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Star as StarIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import StoreServices from '../../services/storeService';
import RatingService from '../../services/ratingService';
import { useAuth } from '../../context/AuthContext';

const StoreList = () => {
  const [allStores, setAllStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
    const { user } = useAuth(); // Assuming you have a user context to get the logged-in user
  const [submittingRating, setSubmittingRating] = useState(false);

  // Fetch all stores data with user ratings
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await StoreServices.getAllStores();
        setAllStores(response);
        setFilteredStores(response);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Apply filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(allStores);
      return;
    }

    const filtered = allStores.filter(store => {
      const term = searchTerm.toLowerCase();
      return (
        (store.name && store.name.toLowerCase().includes(term)) ||
        (store.address && store.address.toLowerCase().includes(term)) ||
        (store.email && store.email.toLowerCase().includes(term)) ||
        (store.owner_name && store.owner_name.toLowerCase().includes(term))
      );
    });

    setFilteredStores(filtered);
    setPage(0);
  }, [searchTerm, allStores]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatRating = (rating) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return isNaN(numericRating) ? '0.0' : numericRating.toFixed(1);
  };

  // Rating dialog handlers
  const openRatingDialog = (store) => {
    setCurrentStore(store);
    setUserRating(store.user_rating || 0);
    setRatingDialogOpen(true);
  };

  const closeRatingDialog = () => {
    setRatingDialogOpen(false);
    setCurrentStore(null);
    setUserRating(0);
  };

  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
  };

  const submitRating = async () => {
    if (!currentStore?.id || !userRating) return;
    
    setSubmittingRating(true);
  
    try {
      await RatingService.submitRating(user.id,currentStore.id, {
        rating: userRating
      });
      
      // More efficient update - just update the rated store
      const updatedStore = await StoreServices.getStoreById(currentStore.id);
      setAllStores(prev => prev.map(store => 
        store.id === currentStore.id ? updatedStore : store
      ));
      
      closeRatingDialog();
      // Consider adding a success notification
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Add user-friendly error display
      alert(error.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
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
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Store Directory
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search stores by name, address, email or owner..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Stores Table */}
      <Card elevation={3}>
        <CardContent>
          {filteredStores.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 4,
              border: '1px dashed rgba(0, 0, 0, 0.12)',
              borderRadius: 1
            }}>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                {searchTerm ? 'No stores match your search' : 'No stores found'}
              </Typography>
              {searchTerm && (
                <Button 
                  variant="outlined" 
                  onClick={clearSearch}
                  startIcon={<ClearIcon />}
                >
                  Clear Search
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Store</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Overall Rating</TableCell>
                      <TableCell>Your Rating</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStores
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((store) => (
                        <TableRow key={store.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main', 
                                mr: 2,
                                width: 32,
                                height: 32
                              }}>
                                <StoreIcon fontSize="small" />
                              </Avatar>
                              <Typography>{store.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {store.owner_name ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ 
                                  bgcolor: 'secondary.main', 
                                  mr: 1,
                                  width: 24,
                                  height: 24
                                }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                {store.owner_name}
                              </Box>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell>{store.address || 'N/A'}</TableCell>
                          <TableCell>{store.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MuiRating
                                value={store.average_rating || 0}
                                precision={0.5}
                                readOnly
                                size="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2">
                                {formatRating(store.average_rating)}
                                ({store.rating_count || 0})
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <MuiRating
                              value={store.user_rating || 0}
                              precision={1}
                              readOnly
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => openRatingDialog(store)}
                            >
                              {store.user_rating ? 'Update Rating' : 'Rate Store'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStores.length}
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

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onClose={closeRatingDialog}>
        <DialogTitle>
          {currentStore?.user_rating ? 'Update Your Rating' : 'Rate This Store'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {currentStore?.name}
            </Typography>
            <MuiRating
              value={userRating}
              onChange={handleRatingChange}
              precision={1}
              size="large"
              sx={{ fontSize: '2.5rem' }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {userRating ? `You're rating this store: ${userRating} star${userRating > 1 ? 's' : ''}` : 'Select a rating'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRatingDialog}>Cancel</Button>
          <Button 
            onClick={submitRating} 
            variant="contained" 
            disabled={!userRating || submittingRating}
          >
            {submittingRating ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreList;