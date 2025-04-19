import React, { useContext, useState, useEffect } from 'react';
import { 
  Alert, 
  AlertTitle, 
  Box, 
  Button, 
  Collapse, 
  IconButton, 
  Snackbar, 
  Typography,
  LinearProgress,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { UserContext } from '../contexts/UserContext';

const OfflineStatusBar = () => {
  const { isOffline, syncLocalDietCharts, userData, pendingSyncs } = useContext(UserContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [networkChecking, setNetworkChecking] = useState(false);

  // Reset alert visibility when offline status changes
  useEffect(() => {
    if (isOffline) {
      setShowAlert(true);
    }
  }, [isOffline]);

  // If online and no sync result, don't show anything
  if (!isOffline && !syncResult && !isSyncing) return null;

  const checkNetworkAndSync = async () => {
    setNetworkChecking(true);
    
    try {
      // Try to make a lightweight network request to check actual connectivity
      const response = await fetch('https://www.google.com/generate_204', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        timeout: 5000
      });
      
      // If we got here, we have actual connectivity, try to sync
      handleSync();
    } catch (error) {
      // Network is still not available
      setSyncResult({
        success: false,
        message: "Network is still unavailable. Please check your internet connection."
      });
    } finally {
      setNetworkChecking(false);
    }
  };

  const handleSync = async () => {
    if (!userData?.id) return;
    
    setIsSyncing(true);
    try {
      const result = await syncLocalDietCharts();
      setSyncResult(result);
      
      // Auto-hide success message after 5 seconds
      if (result.success) {
        setTimeout(() => {
          setSyncResult(null);
        }, 5000);
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: error.message || "Failed to sync data"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getPendingSyncCount = () => {
    return pendingSyncs?.length || 0;
  };

  return (
    <>
      {/* Offline status banner */}
      <Collapse in={isOffline && showAlert}>
        <Alert 
          severity="warning"
          icon={<WifiOffIcon />}
          action={
            <>
              <Button 
                color="inherit" 
                size="small"
                startIcon={<SyncIcon />}
                onClick={checkNetworkAndSync}
                disabled={isSyncing || networkChecking}
              >
                {isSyncing ? 'Syncing...' : networkChecking ? 'Checking...' : 'Try Sync'}
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setShowAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </>
          }
          sx={{ mb: 2 }}
        >
          <AlertTitle>You're offline</AlertTitle>
          <Typography variant="body2">
            Your changes are saved locally and will sync automatically when you're back online.
            {getPendingSyncCount() > 0 && (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 1 }}>
                <Chip 
                  size="small" 
                  label={`${getPendingSyncCount()} pending ${getPendingSyncCount() === 1 ? 'change' : 'changes'}`} 
                  color="warning" 
                  variant="outlined"
                />
              </Box>
            )}
            <Box component="span" sx={{ display: 'block', mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
              Limited functionality is available while offline. Some features may not work.
            </Box>
            <Box component="span" sx={{ display: 'block', mt: 1, fontSize: '0.8rem' }}>
              <strong>Troubleshooting:</strong>
              <ul>
                <li>Check your internet connection</li>
                <li>Try turning Wi-Fi off and on</li>
                <li>If on cellular data, check your signal strength</li>
              </ul>
            </Box>
          </Typography>
          {isSyncing && <LinearProgress sx={{ mt: 1 }} />}
        </Alert>
      </Collapse>

      {/* Sync result message */}
      <Snackbar 
        open={syncResult !== null} 
        autoHideDuration={syncResult?.success ? 5000 : null}
        onClose={() => setSyncResult(null)}
      >
        <Alert 
          onClose={() => setSyncResult(null)} 
          severity={syncResult?.success ? "success" : "error"}
          sx={{ width: '100%' }}
          icon={syncResult?.success ? <CheckCircleIcon /> : <ErrorIcon />}
        >
          <AlertTitle>{syncResult?.success ? "Sync Successful" : "Sync Failed"}</AlertTitle>
          {syncResult?.message}
          {!syncResult?.success && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Your data is still safe locally. Try again when you have a better connection.
            </Typography>
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OfflineStatusBar;