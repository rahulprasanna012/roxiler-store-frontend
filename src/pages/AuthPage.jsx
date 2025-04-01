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
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
    console.log('AuthPage useEffect - full user:', user, 'loading:', loading);
    
    if (!loading && user) {
      console.log('User role:', user.role);
      console.log('User object structure:', user);
      redirectBasedOnRole(user.role);
    }
  }, [user, loading, navigate]);

  const redirectBasedOnRole = (role) => {
    // Temporary fallback to 'user' if role is undefined
    const effectiveRole = role || 'user';
    console.log('Redirecting with role:', effectiveRole);
    
    switch (effectiveRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'user':
        navigate('/user');
        break;
      case 'store_owner':
        navigate('/store');
        break;
      default:
        navigate('/');
    }
  };


  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
    setAuthError('');
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerForm.name || registerForm.name.length < 20 || registerForm.name.length > 60) {
      newErrors.name = 'Name must be 20-60 characters';
    }
    
    if (!registerForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (registerForm.address.length > 400) {
      newErrors.address = 'Address must be ≤400 characters';
    }
    
    if (!registerForm.password || !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(registerForm.password)) {
      newErrors.password = 'Password must be 8-16 chars with 1 uppercase and 1 special character';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginForm.email, loginForm.password);
      // Navigation will be handled by the useEffect
    } catch (error) {
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
  
    try {
      await register({
        name: registerForm.name,
        email: registerForm.email,
        address: registerForm.address,
        password: registerForm.password,
        role: registerForm.role
      });
      // Navigation will be handled by the useEffect
    } catch (error) {
      setAuthError(error.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {authError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setAuthError('')}>
            {authError}
          </Alert>
        )}

        {activeTab === 0 ? (
          <Box component="form" onSubmit={handleLogin}>
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
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Button 
                color="primary"
                onClick={() => setActiveTab(1)}
                sx={{ textTransform: 'none' }}
              >
                Register here
              </Button>
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister}>
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
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Button 
                color="primary"
                onClick={() => setActiveTab(0)}
                sx={{ textTransform: 'none' }}
              >
                Login here
              </Button>
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;
