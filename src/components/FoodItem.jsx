import React from 'react';
import { 
  ListItem, 
  ListItemText, 
  Divider, 
  Grid, 
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FoodItem = ({ food, onEdit, onDelete }) => {
  const { name, quantity, calories, protein, carbs, fats, fat, fiber } = food;
  // Handle both 'fats' and 'fat' properties to ensure consistency
  const fatValue = fats !== undefined ? fats : (fat !== undefined ? fat : 0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <>
      {isMobile ? (
        // Mobile view with stacked layout
        <ListItem disableGutters sx={{ px: 1, flexDirection: 'column', alignItems: 'stretch' }}>
          <Box sx={{ width: '100%', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex' }} className="no-print">
              {onEdit && (
                <IconButton size="small" color="primary" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton size="small" color="error" onClick={onDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Cal</Typography>
                <Chip 
                  label={`${calories}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ width: '100%', bgcolor: 'rgba(76, 175, 80, 0.1)' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">P(g)</Typography>
                <Chip 
                  label={`${protein}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ width: '100%', bgcolor: 'rgba(33, 150, 243, 0.1)' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">C(g)</Typography>
                <Chip 
                  label={`${carbs}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ width: '100%', bgcolor: 'rgba(255, 152, 0, 0.1)' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">F(g)</Typography>
                <Chip 
                  label={`${fatValue}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ width: '100%', bgcolor: 'rgba(244, 67, 54, 0.1)' }} 
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Fiber(g)</Typography>
                <Chip 
                  label={`${fiber || 0}`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ width: '100%', bgcolor: 'rgba(121, 85, 72, 0.1)' }} 
                />
              </Box>
            </Grid>
          </Grid>
        </ListItem>
      ) : (
        // Desktop view with horizontal layout
        <ListItem disableGutters sx={{ px: 1 }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                <ListItemText 
                  primary={
                    <Typography variant="body1" fontWeight="medium">
                      {name}
                    </Typography>
                  } 
                  secondary={quantity} 
                />
                <Box sx={{ display: 'flex', ml: 1 }} className="no-print">
                  {onEdit && (
                    <IconButton size="small" color="primary" onClick={onEdit}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton size="small" color="error" onClick={onDelete}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={1}>
                <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={`${calories}`} 
                    size="small" 
                    variant="outlined" 
                    sx={{ width: '100%', bgcolor: 'rgba(76, 175, 80, 0.1)' }} 
                  />
                </Grid>
                <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={`${protein}g`}
                    size="small" 
                    variant="outlined"
                    sx={{ width: '100%', bgcolor: 'rgba(33, 150, 243, 0.1)' }} 
                  />
                </Grid>
                <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={`${carbs}g`}
                    size="small" 
                    variant="outlined"
                    sx={{ width: '100%', bgcolor: 'rgba(255, 152, 0, 0.1)' }} 
                  />
                </Grid>
                <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={`${fatValue}g`}
                    size="small" 
                    variant="outlined"
                    sx={{ width: '100%', bgcolor: 'rgba(244, 67, 54, 0.1)' }} 
                  />
                </Grid>
                <Grid item xs={2.4} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={`${fiber || 0}g`}
                    size="small" 
                    variant="outlined"
                    sx={{ width: '100%', bgcolor: 'rgba(121, 85, 72, 0.1)' }} 
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ListItem>
      )}
      <Divider component="li" />
    </>
  );
};

export default FoodItem;