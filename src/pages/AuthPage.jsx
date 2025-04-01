import React, { useState, useEffect } from 'react';
import { 
  Container,
  Tabs,
  Tab,
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
  IconButton
} from '@mui/material';
import { 
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    password: '', 
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Get role from nested user object if it exists
      const userRole = user?.role || user?.user?.role || 'user';
      redirectBasedOnRole(userRole);
    }
  }, [user, loading, navigate]);


  const redirectBasedOnRole = (role) => {
    // Prevent multiple redirects
    if (window.location.pathname !== getPathForRole(role)) {
      navigate(getPathForRole(role));
    }
  };

  const getPathForRole = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'user': return '/user';
      case 'store_owner': return '/store';
      default: return '/';
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
    setAuthError('');
  };

 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      showToast('Login successful!');
      // Navigation will be handled by the useEffect
    } catch (error) {
      setAuthError(error.message || 'Login failed');
    }
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Name validation
    if (!registerForm.name || registerForm.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (registerForm.name.length < 20 || registerForm.name.length > 60) {
      newErrors.name = 'Name must be 20-60 characters';
      isValid = false;
    }
    
    // Email validation
    if (!registerForm.email || registerForm.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Address validation
    if (registerForm.address.length > 400) {
      newErrors.address = 'Address must be ≤400 characters';
      isValid = false;
    }
    
    // Password validation
    if (!registerForm.password || registerForm.password.trim() === '') {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(registerForm.password)) {
      newErrors.password = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
      isValid = false;
    }
    
    // Confirm Password validation
    if (!registerForm.confirmPassword || registerForm.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateRegisterForm()) {
      toast.error('Please fix all validation errors before submitting');
      return;
    }
  
    try {
      const response = await register({
        name: registerForm.name,
        email: registerForm.email,
        address: registerForm.address,
        password: registerForm.password,
        role: registerForm.role
      });
      
      if (response) {
        toast.success('Registration successful!');
        // Reset form after successful registration
        setRegisterForm({
          name: '',
          email: '',
          address: '',
          password: '',
          confirmPassword: '',
          role: 'user'
        });
        setErrors({});
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setAuthError(errorMessage);
      toast.error(errorMessage);
    }
  };


  return (
    <Container 
  maxWidth="sm" // Changed to 'sm' for a more centered, compact form
  sx={{ 
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Add this to center horizontally
    minHeight: '100vh',
    py: 4,
  }}
>

<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      


  <Paper 
    elevation={3} 
    sx={{ 
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', // Takes full width of container
    }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3,
            width: '100%'
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {authError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              width: '100%'
            }} 
            onClose={() => setAuthError('')}
          >
            {authError}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={activeTab === 0 ? handleLogin : handleRegister}
          sx={{
            width: '100%',
            maxWidth: '400px',
            mt: 1
          }}
        >
          {activeTab === 0 ? (
            <>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                required
              />
              <TextField
                fullWidth
                label="Password"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Full Name (20-60 characters)"
                margin="normal"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                required
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
                required
              />
              <TextField
                fullWidth
                label="Address (max 400 characters)"
                margin="normal"
                multiline
                rows={3}
                value={registerForm.address}
                onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  startAdornment: <HomeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">Role</Typography>
                <RadioGroup
                  row
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                  sx={{ justifyContent: 'center' }}
                >
                  <FormControlLabel value="user" control={<Radio />} label="User" />
                  <FormControlLabel value="store_owner" control={<Radio />} label="Store Owner" />
                  <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
              </Box>
              <TextField
                fullWidth
                label="Password (8-16 chars with uppercase and special char)"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                error={!!errors.password}
                helperText={errors.password || "Must include 1 uppercase and 1 special character"}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              <TextField
                fullWidth
                label="Confirm Password"
                margin="normal"
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Register
              </Button>
            </>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" align="center">
            {activeTab === 0 ? "Don't have an account?" : "Already have an account?"}{' '}
            <Button 
              color="primary"
              onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
              sx={{ textTransform: 'none' }}
            >
              {activeTab === 0 ? "Register here" : "Login here"}
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};



export default AuthPage;
