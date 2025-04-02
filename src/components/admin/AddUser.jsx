import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Avatar,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Visibility,
  VisibilityOff,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LockOpenIcon } from '@heroicons/react/24/solid';
import { register } from '../../services/authService';

const AddUser = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    password: '', 
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

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
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2 || formData.name.length > 60) {
      newErrors.name = 'Name must be 2-60 characters';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Address validation
    if (formData.address && formData.address.length > 400) {
      newErrors.address = 'Address must be ≤400 characters';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
      isValid = false;
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    // Here you would typically call an API to add the user
    console.log('User data to submit:', formData);
    const response = await register({
      name: formData.name,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      role: formData.role
    });
    toast.success('User added successfully!');
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <AddIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            Add New User
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
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
                helperText={errors.email}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                required
              />
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
                error={!!errors.address}
                helperText={errors.address || "Optional"}
                InputProps={{
                  startAdornment: <HomeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Role
              </Typography>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel value="user" control={<Radio />} label="User" />
                <FormControlLabel value="store_owner" control={<Radio />} label="Store Owner" />
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </RadioGroup>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "8-16 chars with 1 uppercase and 1 special character"}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOpenIcon sx={{ color: 'action.active' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOpenIcon sx={{ color: 'action.active' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                required
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ px: 4 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ px: 4 }}
              startIcon={<AddIcon />}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddUser;