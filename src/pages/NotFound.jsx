import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      textAlign: 'center',
      py: 4
    }}>
      <Box
        component="img"
        src="https://webhostingmedia.net/wp-content/uploads/2018/01/http-error-404-not-found.png"
        alt="404 Not Found"
        sx={{ 
          maxWidth: '100%', 
          height: 'auto',
          mb: 4,
          borderRadius: 2,
          boxShadow: 3
        }}
      />
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Oops! Page Not Found
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Go Back Home
      </Button>
    </Container>
  );
};

export default NotFound;