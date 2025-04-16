import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: 2,
          color: 'text.primary',
          mb: 4,
          py: 6,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography component="h1" variant="h3" color="primary" gutterBottom fontWeight="bold">
            Personalized Diet Plans
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Create customized meal plans based on your body metrics, activity level, and wellness goals.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/profile"
            sx={{ mt: 2 }}
          >
            Get Your Diet Plan
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
              <MonitorWeightIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                BMI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculate your Body Mass Index (BMI) and understand what it means for your health and nutrition needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
              <RestaurantMenuIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                Custom Meal Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive personalized meal suggestions with detailed nutritional information to meet your calorie and macronutrient goals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', color: 'primary.main' }}>
              <FitnessCenterIcon sx={{ fontSize: 60 }} />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography gutterBottom variant="h5" component="h2">
                Goal-Based Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Whether you want to lose weight, maintain your current weight, or gain muscle mass, we have a plan for you.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.light" fontWeight="bold">
                1
              </Typography>
              <Typography variant="h6" gutterBottom>
                Enter Your Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Provide information about your height, weight, age, gender, and activity level.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.light" fontWeight="bold">
                2
              </Typography>
              <Typography variant="h6" gutterBottom>
                Set Your Goal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose whether you want to lose, maintain, or gain weight.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.light" fontWeight="bold">
                3
              </Typography>
              <Typography variant="h6" gutterBottom>
                Get Your Plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive a personalized diet plan tailored to your body and goals.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to transform your diet?
        </Typography>
        <Typography variant="body1" paragraph>
          Start your journey to better health with a personalized diet plan.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/profile"
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            }
          }}
        >
          Create Your Diet Plan
        </Button>
      </Box>
    </Box>
  );
};

export default Home;