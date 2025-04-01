import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Rating as MuiRating
} from '@mui/material';
import {
  Store as StoreIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Star as StarIcon
} from '@mui/icons-material';
import StoreServices from '../../services/storeService';

const StoreList = () => {
  const [allStores, setAllStores] = useState([]); // Store original data
  const [filteredStores, setFilteredStores] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all stores data on initial load
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await StoreServices.getAllStores();
        setAllStores(response);
        setFilteredStores(response); // Initialize filtered stores with all stores
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Apply filtering whenever searchTerm changes
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
        (store.owner?.name && store.owner.name.toLowerCase().includes(term))
      );
    });

         // Debugging line to check filtered stores
    setFilteredStores(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, allStores]);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Table pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatRating = (rating) => {
    // Convert to number if it's a string
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    // Check if it's a valid number
    if (typeof numericRating !== 'number' || isNaN(numericRating)) {
      return '0.0';
    }
    
    return numericRating.toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('Filtered stores:', allStores[0].owner_name);

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
                      <TableCell>Rating</TableCell>
                      <TableCell>Count</TableCell>
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
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View reviews">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<StarIcon fontSize="small" />}
                              >
                                {store.rating_count || 0}
                              </Button>
                            </Tooltip>
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
    </Box>
  );
};

export default StoreList;