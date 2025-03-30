import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Container } from '@mui/material';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" paragraph>
          This is your dashboard. Here you can display your content.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;