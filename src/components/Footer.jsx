import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  useTheme, 
  useMediaQuery,
  Divider
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align={isMobile ? 'center' : 'left'}
            sx={{ mb: isMobile ? 1 : 0 }}
          >
            © {new Date().getFullYear()} Designed and developed with 
            <FavoriteIcon sx={{ fontSize: 14, mx: 0.5, color: 'error.main', verticalAlign: 'middle' }} />
            by{' '}
            <Link 
              href="https://praveendubbaka.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              color="primary"
              underline="hover"
            >
              Praveen Dubbaka
            </Link>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link 
              href="https://github.com/praveendubbaka" 
              target="_blank" 
              rel="noopener noreferrer" 
              color="inherit"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </Link>
            <Link 
              href="https://www.linkedin.com/in/praveen-dubbaka/" 
              target="_blank" 
              rel="noopener noreferrer" 
              color="inherit"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </Link>
          </Box>
        </Box>
        
        {isMobile && <Divider sx={{ my: 1.5 }} />}
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center" 
          display="block"
          sx={{ mt: isMobile ? 0 : 1 }}
        >
          DietPlanner - Your personalized nutrition planning solution
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;