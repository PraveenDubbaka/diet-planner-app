import { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// Import the actual service functions
import { loginUser, logoutUser, registerUser, updateUserProfile, loadDietChartsFromFirebase, saveDietChart as serviceSaveDietChart, deleteDietChart as serviceDeleteDietChart } from '../services/firebaseAuthService';

export const UserContext = createContext({
  userData: null,
  isAuthenticated: false,
  isAuthLoading: true,
  dietCharts: [],
  isLoadingCharts: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserProfileData: async () => {},
  loadUserDietCharts: async () => {},
  saveDietChart: async () => {},
  deleteDietChart: async () => {}
});

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dietCharts, setDietCharts] = useState([]);
  const [isLoadingCharts, setIsLoadingCharts] = useState(false);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state and preserve user on refresh
  useEffect(() => {
    console.log('Setting up auth state listener');
    let isMounted = true;
    setIsAuthLoading(true);
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
        
        if (!isMounted) return;
        
        if (user) {
          // Optionally fetch additional user info from Firestore
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            const profile = userSnap.exists() 
              ? { ...userSnap.data(), uid: user.uid } 
              : { uid: user.uid, email: user.email };
            
            if (isMounted) {
              setUserData(profile);
              setIsAuthenticated(true);
              // Load diet charts after user is authenticated and profile is set
              loadUserDietCharts(user.uid).catch(err => 
                console.error('Failed to load diet charts on auth change:', err)
              );
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            if (isMounted) {
              setUserData({ uid: user.uid, email: user.email });
              setIsAuthenticated(true);
            }
          }
        } else {
          if (isMounted) {
            setUserData(null);
            setIsAuthenticated(false);
            setDietCharts([]);
          }
        }
        
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }, (error) => {
        console.error('Auth state observer error:', error);
        if (isMounted) {
          setError(error);
          setIsAuthLoading(false);
        }
      });
      
      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setError(error);
      setIsAuthLoading(false);
    }
  }, []);

  // Function to load diet charts from Firestore with better error handling
  const loadUserDietCharts = async (userId) => {
    console.log('Context: loadUserDietCharts called for uid=', userId);
    if (!userId) {
      console.warn('Cannot load diet charts: No user ID provided');
      return;
    }
    
    setIsLoadingCharts(true);
    
    try {
      const charts = await loadDietChartsFromFirebase(userId);
      console.log('Context: Loaded charts from Firebase:', charts);
      setDietCharts(Array.isArray(charts) ? charts : []);
    } catch (error) {
      console.error("Failed to load diet charts in context:", error);
      setDietCharts([]);
    } finally {
      setIsLoadingCharts(false);
    }
  };

  // Save diet chart wrapper to include userId
  const handleSaveDietChart = async (chartData) => {
    if (!userData?.uid) return { success: false, message: 'User not authenticated' };
    
    try {
      const result = await serviceSaveDietChart({ ...chartData, userId: userData.uid });
      
      if (result.success) {
        // Refresh the list after save
        await loadUserDietCharts(userData.uid);
      }
      
      return result;
    } catch (error) {
      console.error('Error saving diet chart:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to save diet chart' 
      };
    }
  };

  // Delete diet chart wrapper
  const handleDeleteDietChart = async (chartId, allChartIds) => {
    try {
      // Support bulk deletion
      if (chartId === 'DELETE_ALL' && Array.isArray(allChartIds)) {
        await Promise.all(allChartIds.map(id => serviceDeleteDietChart(id)));
      } else {
        await serviceDeleteDietChart(chartId);
      }
      
      // Refresh the list after delete
      if (userData?.uid) {
        await loadUserDietCharts(userData.uid);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting diet chart:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to delete diet chart' 
      };
    }
  };

  // Implement the actual logout function
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      
      if (!result.success) {
        console.error("Logout failed:", result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Unexpected logout error:', error);
      return {
        success: false,
        message: error.message || 'Logout failed due to an unexpected error'
      };
    }
  };

  // Implement login function
  const handleLogin = async (email, password) => {
    try {
      return await loginUser(email, password);
    } catch (error) {
      console.error('Unexpected login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed due to an unexpected error'
      };
    }
  };

  // Implement register function
  const handleRegister = async (name, email, password) => {
    try {
      return await registerUser(name, email, password);
    } catch (error) {
      console.error('Unexpected registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed due to an unexpected error'
      };
    }
  };

  // Update user profile data
  const updateUserProfileData = async (updatedData) => {
    if (!userData) return { success: false, message: "No user is logged in" };
    
    try {
      const updatedUserData = { ...userData, ...updatedData };
      setUserData(updatedUserData);
      localStorage.setItem(`user_${userData.uid}`, JSON.stringify(updatedUserData));
      
      if (!navigator.onLine) {
        // Offline: save locally and exit early
        return { 
          success: true, 
          message: "Profile updated locally. Changes will sync when you're back online.",
          offlineMode: true
        };
      }
      
      // Call the service function
      return await updateUserProfile(userData.uid, updatedData);
    } catch (error) {
      console.error("Profile update error:", error);
      return { 
        success: false, 
        message: error.message || "An unexpected error occurred during profile update."
      };
    }
  };

  // If there was an error setting up the auth state listener, render an error message
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        margin: '20px', 
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        backgroundColor: '#f8d7da', 
        color: '#721c24'
      }}>
        <h2>Authentication Error</h2>
        <p>There was a problem setting up the authentication system.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
        <button
          onClick={() => window.location.reload()}
          style={{ 
            marginTop: '15px',
            padding: '8px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <UserContext.Provider 
      value={{
        userData, 
        isAuthenticated, 
        isAuthLoading, 
        dietCharts,
        isLoadingCharts,
        // Pass the implemented functions
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        updateUserProfileData,
        loadUserDietCharts,
        saveDietChart: handleSaveDietChart,
        deleteDietChart: handleDeleteDietChart
      }}
    >
      {children}
    </UserContext.Provider>
  );
};