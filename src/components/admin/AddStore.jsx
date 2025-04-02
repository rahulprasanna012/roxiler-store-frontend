import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Store as StoreIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StoreService from '../../services/storeService';
import UserService from '../../services/userService';

const AddStore = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    owner_id: ''
  });
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOwners, setFetchingOwners] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Fetch store owners when component mounts
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setFetchingOwners(true);
        // Fetch users with role 'store_owner'
       
        const ownersData = await UserService.getUsersByRole('store_owner');
        console.log('Fetched owners:', ownersData); // Debugging line
        
        setOwners(ownersData);
      } catch (error) {
        console.error('Error fetching owners:', error);
        setApiError('Failed to fetch store owners. Please try again later.');
      } finally {
        setFetchingOwners(false);
      }
    };
    
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when user interacts with form
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Store name is required';
      isValid = false;
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Store name must be 2-100 characters';
      isValid = false;
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Owner validation
    if (!formData.owner_id) {
      newErrors.owner_id = 'Store owner is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {

  

      const createdStore = await StoreService.createStore(formData);
      
      toast.success('Store created successfully!');
      navigate(`/admin/store-list`); 
    } catch (error) {
      console.error('Error creating store:', error);
      const errorMsg = error.response?.data?.message || 'Error creating store';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <StoreIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            Add New Store
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setApiError('')}>
            {apiError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Store Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <StoreIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || "Optional"}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.owner_id}>
                <InputLabel id="owner-select-label">Store Owner *</InputLabel>
                <Select
                  labelId="owner-select-label"
                  label="Store Owner *"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  required
                  disabled={fetchingOwners}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                    </InputAdornment>
                  }
                >
                  {fetchingOwners ? (
                    <MenuItem disabled>Loading owners...</MenuItem>
                  ) : owners.length > 0 ? (
                    owners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No store owners available</MenuItem>
                  )}
                </Select>
                {errors.owner_id && (
                  <Typography variant="caption" color="error">
                    {errors.owner_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <HomeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
              startIcon={<ArrowBackIcon />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ px: 4 }}
              disabled={loading || fetchingOwners}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {loading ? 'Creating...' : 'Add Store'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddStore;