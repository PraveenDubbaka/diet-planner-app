import { createContext, useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from '../firebase/config';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetPassword, 
  updateUserProfile, 
  changePassword, 
  saveDietChart as saveDietChartToFirebase,
  deleteDietChart as deleteDietChartFromFirebase 
} from '../services/firebaseAuthService';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';

export const UserContext = createContext({
  userData: null,
  setUserData: () => {},
  isAuthenticated: false,
  isAuthLoading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
  resetPassword: () => {},
  changeUserPassword: () => {},
  saveDietChart: () => {},
  deleteDietChart: () => {},
  dietCharts: [],
  isLoadingCharts: false,
  isOffline: false,
  syncLocalDietCharts: () => {},
  syncStatus: null, // New property to track sync status
  retrySync: () => {}, // New function to manually retry sync
  pendingSyncCount: 0, // New property to track pending sync count
});

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dietCharts, setDietCharts] = useState([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSyncs, setPendingSyncs] = useState([]);
  const [syncStatus, setSyncStatus] = useState(null); // Track the status of sync operations
  const [syncRetryCount, setSyncRetryCount] = useState(0); // Track number of sync retries
  const [lastSyncAttempt, setLastSyncAttempt] = useState(null); // Track time of last sync attempt

  // Load pending syncs from local storage on component mount
  useEffect(() => {
    try {
      const storedPendingSyncs = localStorage.getItem('pendingSyncs');
      if (storedPendingSyncs) {
        setPendingSyncs(JSON.parse(storedPendingSyncs));
      }
    } catch (error) {
      console.error('Error loading pending syncs from local storage:', error);
    }
  }, []);

  // Update local storage when pending syncs change
  useEffect(() => {
    try {
      localStorage.setItem('pendingSyncs', JSON.stringify(pendingSyncs));
    } catch (error) {
      console.error('Error saving pending syncs to local storage:', error);
    }
  }, [pendingSyncs]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log("App is back online");
      setIsOffline(false);
      setSyncStatus({
        status: 'ready',
        message: 'Connected to network. Ready to sync.'
      });
      
      // When coming back online, try to sync any pending diet charts
      if (userData?.id && pendingSyncs.length > 0) {
        // Add a small delay to ensure connection is stable
        setTimeout(() => {
          syncLocalDietCharts();
        }, 1500);
      }
    };
    
    const handleOffline = () => {
      console.log("App is offline");
      setIsOffline(true);
      setSyncStatus({
        status: 'offline',
        message: 'You are offline. Changes will be saved locally.'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initialize sync status based on current network state
    if (navigator.onLine) {
      setSyncStatus({
        status: 'ready',
        message: 'Connected to network.'
      });
    } else {
      setSyncStatus({
        status: 'offline',
        message: 'You are offline. Changes will be saved locally.'
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [userData, pendingSyncs]);
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get additional user data from Firestore
          const userRef = doc(db, "users", user.uid);
          
          if (isOffline) {
            // If offline, use basic authentication data without Firestore
            const cachedUserData = JSON.parse(localStorage.getItem(`user_${user.uid}`)) || {};
            setUserData({
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              emailVerified: user.emailVerified,
              offlineMode: true,
              ...cachedUserData
            });
            setIsAuthenticated(true);
            setIsAuthLoading(false);
            
            // Load cached diet charts from local storage
            loadCachedDietCharts(user.uid);
            
            console.log("User authenticated in offline mode. Limited functionality available.");
            return;
          }
          
          // Check if user document exists in Firestore
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const firestoreUserData = userDoc.data();
            const userData = {
              id: user.uid,
              name: user.displayName || firestoreUserData.name,
              email: user.email,
              emailVerified: user.emailVerified,
              ...firestoreUserData
            };
            
            // Cache user data in localStorage for offline use
            localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));
            
            setUserData(userData);
            setIsAuthenticated(true);
          } else {
            // If user exists in Auth but not in Firestore, create the document
            console.log("User document missing in Firestore. Creating new document.");
            const newUserData = {
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              emailVerified: user.emailVerified,
              createdAt: new Date().toISOString(),
              dietType: 'standard',
              goal: 'maintain',
              isGlutenFree: false,
            };
            
            // Create the user document in Firestore
            await setDoc(userRef, newUserData);
            
            setUserData(newUserData);
            setIsAuthenticated(true);
            
            // Cache the data
            localStorage.setItem(`user_${user.uid}`, JSON.stringify(newUserData));
          }
          
          // Load pending syncs from localStorage
          const storedPendingSyncs = JSON.parse(localStorage.getItem(`pending_syncs_${user.uid}`)) || [];
          setPendingSyncs(storedPendingSyncs);
          
          // Load user's diet charts
          loadUserDietCharts(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
          
          // Handle offline scenario or other error - still authenticate the user with basic info
          if (!navigator.onLine || error.code === "unavailable" || 
              error.message?.includes("offline") || error.message?.includes("network")) {
            
            // Try to get cached user data
            const cachedUserData = JSON.parse(localStorage.getItem(`user_${user.uid}`)) || {};
            
            setUserData({
              id: user.uid,
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              emailVerified: user.emailVerified,
              offlineMode: true,
              ...cachedUserData
            });
            setIsAuthenticated(true);
            
            // Load cached diet charts
            loadCachedDietCharts(user.uid);
            
            console.log("App is in offline mode. Limited functionality available.");
          }
        }
      } else {
        // User is signed out
        setUserData(null);
        setIsAuthenticated(false);
        setDietCharts([]);
        setPendingSyncs([]);
      }
      setIsAuthLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [isOffline]);
  
  // Load cached diet charts from localStorage
  const loadCachedDietCharts = (userId) => {
    try {
      const cachedCharts = JSON.parse(localStorage.getItem(`diet_charts_${userId}`)) || [];
      setDietCharts(cachedCharts);
      console.log("Loaded cached diet charts from local storage");
    } catch (error) {
      console.error("Error loading cached diet charts:", error);
      setDietCharts([]);
    }
  };
  
  // Load user's diet charts from Firestore
  const loadUserDietCharts = async (userId) => {
    setIsLoadingCharts(true);
    try {
      // Check for connectivity before attempting to load
      if (!navigator.onLine) {
        console.log("Cannot load diet charts from Firestore: device is offline");
        loadCachedDietCharts(userId);
        setIsLoadingCharts(false);
        return;
      }
      
      const q = query(
        collection(db, "dietCharts"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const chartsData = [];
      
      querySnapshot.forEach((doc) => {
        chartsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Cache diet charts in localStorage
      localStorage.setItem(`diet_charts_${userId}`, JSON.stringify(chartsData));
      
      setDietCharts(chartsData);
    } catch (error) {
      console.error("Error loading diet charts:", error);
      // If it's a connectivity issue, provide clearer logging and load from cache
      if (error.code === "unavailable" || !navigator.onLine || 
          error.message?.includes("offline") || error.message?.includes("network")) {
        console.log("Network issue prevented loading diet charts. Using cached data.");
        loadCachedDietCharts(userId);
      }
    } finally {
      setIsLoadingCharts(false);
    }
  };
  
  // Enhanced sync function with exponential backoff retry
  const syncLocalDietCharts = async () => {
    if (!navigator.onLine || !userData?.id) {
      return;
    }

    if (pendingSyncs.length === 0) {
      setSyncStatus({
        status: 'success',
        message: 'All changes are synced.'
      });
      return;
    }

    setSyncStatus({
      status: 'syncing',
      message: `Syncing ${pendingSyncs.length} changes...`
    });

    // Process each pending sync operation
    const remainingSyncs = [...pendingSyncs];
    let syncErrors = [];

    for (let i = 0; i < pendingSyncs.length; i++) {
      const syncOp = pendingSyncs[i];
      try {
        if (syncOp.type === 'save') {
          // Attempt to save to Firebase - make sure we're passing userId correctly
          await saveDietChartToFirebase(userData.id, syncOp.chart);
        } else if (syncOp.type === 'delete') {
          // Attempt to delete from Firebase
          await deleteDietChartFromFirebase(syncOp.chartId);
        }
        
        // If successful, remove from the pending list
        remainingSyncs.shift();
        
        // Update the status
        setSyncStatus({
          status: 'syncing',
          message: `Successfully synced ${i+1}/${pendingSyncs.length} changes. ${remainingSyncs.length} remaining...`
        });
      } catch (error) {
        console.error(`Error syncing chart (operation ${syncOp.type}):`, error);
        syncErrors.push({
          operation: syncOp,
          error: error.message
        });
        
        // Stop processing on error
        break;
      }
    }

    // Update pending syncs with remaining operations
    setPendingSyncs(remainingSyncs);
    
    // Update sync status based on results
    if (remainingSyncs.length === 0) {
      setSyncStatus({
        status: 'success',
        message: 'All changes successfully synced.'
      });
      setSyncRetryCount(0);
      setLastSyncAttempt(null);
      loadUserDietCharts(userData.id); // Refresh the charts after successful sync
    } else {
      const newRetryCount = syncRetryCount + 1;
      setSyncRetryCount(newRetryCount);
      setLastSyncAttempt(new Date());
      
      // Apply exponential backoff for retries
      const backoffTime = Math.min(30000, Math.pow(2, newRetryCount) * 1000); // Max 30 seconds
      
      setSyncStatus({
        status: 'error',
        message: `Sync partially completed. ${remainingSyncs.length} changes pending. Will retry in ${Math.round(backoffTime/1000)} seconds.`,
        errors: syncErrors
      });
      
      // Schedule retry with exponential backoff
      setTimeout(() => {
        if (navigator.onLine && userData?.id) {
          syncLocalDietCharts();
        }
      }, backoffTime);
    }
  };

  // Function to manually retry sync
  const retrySync = () => {
    if (navigator.onLine && userData?.id) {
      setSyncRetryCount(0); // Reset retry count for manual retry
      syncLocalDietCharts();
    } else {
      setSyncStatus({
        status: 'offline',
        message: 'Cannot sync while offline. Please connect to the internet.'
      });
    }
  };

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        // Set basic user data first for immediate feedback
        setUserData(result.user);
        setIsAuthenticated(true);
        
        // Then fetch complete user data from Firestore
        if (navigator.onLine && result.user?.id) {
          try {
            const userRef = doc(db, "users", result.user.id);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const firestoreUserData = userDoc.data();
              const fullUserData = {
                ...result.user,
                ...firestoreUserData
              };
              
              // Update state with complete user data
              setUserData(fullUserData);
              
              // Cache full user data
              localStorage.setItem(`user_${result.user.id}`, JSON.stringify(fullUserData));
              
              console.log("Complete user profile loaded successfully");
            }
          } catch (error) {
            console.error("Error fetching complete user data after login:", error);
            // Even if this fails, the user is still logged in with basic data
          }
        }
        
        return result;
      } else {
        return result; // Return the error result directly
      }
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.message || "An unexpected error occurred during login"
      };
    }
  };
  
  const register = async (name, email, password) => {
    try {
      const result = await registerUser(name, email, password);
      
      if (result.success) {
        setUserData(result.user);
        setIsAuthenticated(true);
        return { 
          success: true, 
          message: "Registration successful! A verification email has been sent." 
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  const logout = async () => {
    try {
      await logoutUser();
      setUserData(null);
      setIsAuthenticated(false);
      setDietCharts([]);
      setPendingSyncs([]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  
  const updateUserProfileData = async (updatedData) => {
    if (!userData) return { success: false, message: "No user is logged in" };
    
    try {
      // Always update the local state immediately for better UX
      const updatedUserData = { ...userData, ...updatedData };
      setUserData(updatedUserData);
      
      // Save to localStorage to ensure we don't lose data
      localStorage.setItem(`user_${userData.id}`, JSON.stringify(updatedUserData));
      
      // If we're offline, just return success with offline flag
      if (isOffline || !navigator.onLine) {
        return { 
          success: true, 
          message: "Profile updated locally. Changes will sync when you're back online.",
          offlineMode: true
        };
      }
      
      // Use the service function that now has its own timeout handling
      const result = await updateUserProfile(userData.id, updatedData);
      
      if (result.success) {
        // Already updated local state above, just return the success
        return { success: true, message: "Profile updated successfully" };
      } else {
        // Even if server update failed, we keep the local changes
        // but inform the user of the error
        return { 
          success: true, 
          message: "Profile saved locally, but server update failed: " + result.message,
          offlineMode: true
        };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Always keep local changes even if there was an error
      // This ensures user doesn't lose work
      return { 
        success: true, 
        message: "Profile saved locally, but server update failed: " + (error.message || "Unknown error"),
        offlineMode: true
      };
    }
  };
  
  const requestPasswordReset = async (email) => {
    if (!navigator.onLine) {
      return {
        success: false,
        message: "Cannot reset password while offline. Please connect to the internet and try again."
      };
    }
    return await resetPassword(email);
  };
  
  const changeUserPassword = async (currentPassword, newPassword) => {
    if (!navigator.onLine) {
      return {
        success: false,
        message: "Cannot change password while offline. Please connect to the internet and try again."
      };
    }
    return await changePassword(currentPassword, newPassword);
  };
  
  const saveDietChart = async (chartData) => {
    try {
      if (!userData || !userData.id) {
        return { 
          success: false, 
          message: "User not authenticated" 
        };
      }
      
      // Format the chart data correctly
      const newChart = {
        userId: userData.id,
        date: new Date().toISOString(),
        dietType: userData.dietType || 'standard',
        goal: userData.goal || 'maintain',
        isGlutenFree: userData.isGlutenFree || false,
        data: chartData
      };
      
      // Always save to local storage first for instant feedback
      const localChartId = `local_${Date.now()}`;
      const localChart = {
        ...newChart,
        id: localChartId,
        localId: localChartId,
        createdAt: new Date().toISOString(),
        syncStatus: navigator.onLine ? 'syncing' : 'pending'
      };
      
      // Update local state with new chart
      const updatedCharts = [localChart, ...dietCharts];
      setDietCharts(updatedCharts);
      
      // Save to local storage cache
      localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify(updatedCharts));
      
      // If offline, add to pending syncs and return success
      if (!navigator.onLine) {
        const syncOperation = {
          type: 'save',
          chart: newChart,
          timestamp: new Date().toISOString()
        };
        
        setPendingSyncs(prev => [...prev, syncOperation]);
        
        return { 
          success: true, 
          message: "Diet plan saved locally. Will sync when online.",
          offlineMode: true
        };
      }
      
      // If online, try to save directly to Firebase
      try {
        const result = await saveDietChartToFirebase(userData.id, newChart);
        
        if (result.success) {
          // Update the local chart with the real ID
          const updatedChartsWithId = updatedCharts.map(chart => 
            chart.localId === localChartId 
              ? { ...chart, id: result.chartId, syncStatus: 'synced' } 
              : chart
          );
          
          setDietCharts(updatedChartsWithId);
          localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify(updatedChartsWithId));
          
          return { 
            success: true, 
            message: "Diet plan saved successfully!",
            chartId: result.chartId 
          };
        } else {
          // Firebase save failed, add to pending syncs
          const syncOperation = {
            type: 'save',
            chart: newChart,
            timestamp: new Date().toISOString()
          };
          
          setPendingSyncs(prev => [...prev, syncOperation]);
          
          return { 
            success: true, 
            message: "Diet plan saved locally, but server sync failed. Will retry later.",
            offlineMode: true
          };
        }
      } catch (error) {
        // Firebase operation failed, add to pending syncs
        const syncOperation = {
          type: 'save',
          chart: newChart,
          timestamp: new Date().toISOString()
        };
        
        setPendingSyncs(prev => [...prev, syncOperation]);
        
        return { 
          success: true, 
          message: "Diet plan saved locally, but server sync failed. Will retry later.",
          offlineMode: true,
          error: error.message 
        };
      }
    } catch (error) {
      console.error("Error saving diet chart:", error);
      return { 
        success: false, 
        message: "Failed to save diet plan. Please try again.",
        error: error.message 
      };
    }
  };
  
  const deleteDietChart = async (chartId, allChartIds) => {
    // Handle bulk deletion
    if (chartId === 'DELETE_ALL' && Array.isArray(allChartIds)) {
      try {
        // Remove all charts locally
        setDietCharts([]);
        localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify([]));
        
        // Remove any pending syncs for deletions of these charts
        const filteredSyncs = pendingSyncs.filter(sync => 
          !(sync.type === 'delete' && allChartIds.includes(sync.chartId))
        );
        setPendingSyncs(filteredSyncs);
        localStorage.setItem(`pending_syncs_${userData.id}`, JSON.stringify(filteredSyncs));

        // If online, delete from Firebase
        if (navigator.onLine) {
          allChartIds.forEach(id => {
            deleteDietChartFromFirebase(id).catch(err => console.error('Bulk delete error:', err));
          });
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error bulk deleting diet charts:', error);
        return { success: false, message: error.message };
      }
    }
    
    // Existing single-delete logic
    if (!userData) return { success: false, message: 'User not authenticated' };
    
    const isLocalChart = chartId.startsWith('local_');
    try {
      if (isOffline || !navigator.onLine || isLocalChart) {
        // Remove from local charts
        const updatedCharts = dietCharts.filter(chart => chart.id !== chartId && chart.localId !== chartId);
        setDietCharts(updatedCharts);
        localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify(updatedCharts));
        
        if (isLocalChart) {
          const updatedPendingSyncs = pendingSyncs.filter(sync => sync.chartId !== chartId);
          setPendingSyncs(updatedPendingSyncs);
          localStorage.setItem(`pending_syncs_${userData.id}`, JSON.stringify(updatedPendingSyncs));
        }
        
        return { success: true, offlineMode: isOffline || !navigator.onLine };
      }
      
      const result = await deleteDietChartFromFirebase(chartId);
      if (result.success) {
        const updated = dietCharts.filter(chart => chart.id !== chartId);
        setDietCharts(updated);
        const cache = JSON.parse(localStorage.getItem(`diet_charts_${userData.id}`)) || [];
        localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify(cache.filter(c => c.id !== chartId)));
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error deleting diet chart:', error);
      if (!navigator.onLine) {
        const updated = dietCharts.filter(chart => chart.id !== chartId);
        setDietCharts(updated);
        localStorage.setItem(`diet_charts_${userData.id}`, JSON.stringify(updated));
        return { success: true, offlineMode: true };
      }
      return { success: false, message: error.message };
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        setUserData: updateUserProfileData, 
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        register,
        resetPassword: requestPasswordReset,
        changeUserPassword,
        saveDietChart,
        deleteDietChart,
        dietCharts,
        isLoadingCharts,
        isOffline,
        syncLocalDietCharts,
        syncStatus,
        retrySync,
        pendingSyncCount: pendingSyncs.length
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;