import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  userData: null,
  setUserData: () => {},
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  register: () => {},
  saveDietChart: () => {},
  deleteDietChart: () => {},
  dietCharts: [],
});

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dietCharts, setDietCharts] = useState([]);
  
  // Load user data from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        setIsAuthenticated(true);
        
        // Also load user's diet charts
        const userCharts = localStorage.getItem(`dietCharts_${parsedUser.id}`);
        if (userCharts) {
          setDietCharts(JSON.parse(userCharts));
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userData'); // Remove invalid data
      }
    }
    
    const storedCharts = localStorage.getItem('dietCharts');
    if (storedCharts && !storedUser) { // Only load general charts if no user is logged in
      try {
        setDietCharts(JSON.parse(storedCharts));
      } catch (error) {
        console.error('Error parsing stored charts:', error);
      }
    }
  }, []);
  
  // Save userData to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);
  
  // Save dietCharts to localStorage whenever they change
  useEffect(() => {
    if (dietCharts.length > 0) {
      localStorage.setItem('dietCharts', JSON.stringify(dietCharts));
    }
  }, [dietCharts]);
  
  const login = (email, password) => {
    // In a real app, you'd validate against a backend
    // For now, we'll check against localStorage
    const storedUsers = localStorage.getItem('users');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const user = users.find(u => u.email === email);
      
      if (user && user.password === password) {
        setUserData(user);
        setIsAuthenticated(true);
        
        // Load user's diet charts
        const storedCharts = localStorage.getItem(`dietCharts_${user.id}`);
        if (storedCharts) {
          setDietCharts(JSON.parse(storedCharts));
        } else {
          setDietCharts([]);
        }
        
        return { success: true };
      }
    }
    
    return { success: false, message: 'Invalid email or password' };
  };
  
  const register = (name, email, password) => {
    // In a real app, you'd send this to a backend
    // For now, we'll just store in localStorage
    
    // Initialize users array if it doesn't exist
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    setUserData(newUser);
    setIsAuthenticated(true);
    setDietCharts([]);
    
    return { success: true };
  };
  
  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    setDietCharts([]);
    // We don't clear localStorage on logout for this app
    // This way the user's data is still there when they log back in
  };
  
  const updateUserData = (updatedData) => {
    if (!userData) return;
    
    const newUserData = { ...userData, ...updatedData };
    setUserData(newUserData);
    
    // Update user in users array
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map(user => 
        user.id === userData.id ? { ...user, ...updatedData } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };
  
  const saveDietChart = (dietChartData) => {
    if (!userData) return { success: false, message: 'User not authenticated' };
    
    const newDietChart = {
      id: Date.now().toString(),
      userId: userData.id,
      date: new Date().toISOString(),
      dietType: userData.dietType || 'standard',
      goal: userData.goal || 'maintain',
      isGlutenFree: userData.isGlutenFree || false,
      data: dietChartData
    };
    
    const updatedCharts = [newDietChart, ...dietCharts];
    setDietCharts(updatedCharts);
    
    // Save to user-specific storage
    localStorage.setItem(`dietCharts_${userData.id}`, JSON.stringify(updatedCharts));
    
    return { success: true, chartId: newDietChart.id };
  };
  
  const deleteDietChart = (chartId) => {
    if (!userData) return { success: false, message: 'User not authenticated' };
    
    const updatedCharts = dietCharts.filter(chart => chart.id !== chartId);
    setDietCharts(updatedCharts);
    
    // Update storage
    localStorage.setItem(`dietCharts_${userData.id}`, JSON.stringify(updatedCharts));
    
    return { success: true };
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        setUserData: updateUserData, 
        isAuthenticated,
        login,
        logout,
        register,
        saveDietChart,
        deleteDietChart,
        dietCharts
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;