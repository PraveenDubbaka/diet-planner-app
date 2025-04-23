import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// User Registration with improved error handling and reliability
export const registerUser = async (name, email, password) => {
  try {
    console.log("Registration attempt for email:", email);
    
    if (!email || !password || !name) {
      console.error("Missing required registration fields");
      return {
        success: false,
        message: "Name, email and password are all required",
      };
    }
    
    // Check for network connectivity
    if (!navigator.onLine) {
      console.warn("Registration attempted while offline");
      return {
        success: false,
        message: "You appear to be offline. Please check your internet connection.",
      };
    }
    
    // Clear any previous auth errors
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log("Found existing user session, signing out first");
        await signOut(auth);
      }
    } catch (e) {
      console.log("Error clearing previous auth state:", e);
      // Continue anyway
    }
    
    // Ensure persistence is set before attempting registration
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log("Auth persistence set successfully for registration");
    } catch (persistError) {
      console.warn("Error setting auth persistence:", persistError);
      // Continue anyway
    }
    
    // Create user in Firebase Auth with better error handling
    console.log("Creating new user account in Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("User registered successfully with uid:", user.uid);
    
    // Update profile with display name
    try {
      await updateProfile(user, {
        displayName: name
      });
      console.log("User profile updated with display name");
    } catch (profileError) {
      console.warn("Error updating user profile:", profileError);
      // Continue anyway, we'll store the name in Firestore
    }
    
    // Send email verification
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent");
    } catch (emailError) {
      console.warn("Error sending verification email:", emailError);
      // Continue anyway
    }
    
    // Create user document in Firestore
    try {
      console.log("Creating user document in Firestore...");
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        dietType: 'standard',
        goal: 'maintain',
        isGlutenFree: false,
      });
      console.log("User document created in Firestore");
    } catch (firestoreError) {
      console.error("Error creating user document:", firestoreError);
      // Don't fail registration if only Firestore fails
    }
    
    return { 
      success: true, 
      user: {
        uid: user.uid,
        name,
        email,
        emailVerified: user.emailVerified
      }
    };
  } catch (error) {
    console.error("Firebase Registration Error:", error.code, error.message);
    
    // Provide more specific error messages based on Firebase error codes
    let errorMessage = "Registration failed. Please try again.";
    
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Try logging in instead.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format. Please check your email.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please use a stronger password (at least 6 characters).";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.code === "auth/operation-not-allowed") {
      errorMessage = "Email/password accounts are not enabled. Please contact support.";
    } else if (error.code === "auth/internal-error") {
      errorMessage = "An internal error occurred. Please try again later.";
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code
    };
  }
};

// User Login with improved error handling and reliability
export const loginUser = async (email, password) => {
  try {
    console.log("Login attempt for email:", email);
    
    if (!email || !password) {
      console.error("Missing email or password for login");
      return {
        success: false,
        message: "Email and password are required",
      };
    }
    
    // Check for network connectivity
    if (!navigator.onLine) {
      console.warn("Login attempted while offline");
      return {
        success: false,
        message: "You appear to be offline. Please check your internet connection.",
      };
    }
    
    // Clear any previous auth errors
    try {
      // Sometimes auth can be in a bad state, this helps clear it
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log("Found existing user session, will sign out first to ensure clean login");
        await signOut(auth);
      }
    } catch (e) {
      console.log("Error clearing previous auth state:", e);
      // Don't fail the login if this doesn't work
    }
    
    // Ensure the session persists across refreshes
    try {
      await setPersistence(auth, browserLocalPersistence);
      console.log("Auth persistence set successfully");
    } catch (persistError) {
      console.warn("Error setting auth persistence:", persistError);
      // Continue login attempt even if persistence fails
    }
    
    // Start authentication with a more robust approach
    console.log("Starting Firebase authentication...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Login successful for user:", user.uid);
    
    let userData = {
      uid: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email,
      emailVerified: user.emailVerified,
    };
    
    // Try to fetch Firestore data and include it in the response
    try {
      console.log("Fetching user document from Firestore");
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        console.log("User document exists in Firestore");
        const firestoreData = userDoc.data();
        userData = { 
          ...userData, 
          ...firestoreData,
          uid: user.uid // Ensure uid is preserved from auth
        };
        
        // Cache the full user data
        localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));
        console.log("Complete user profile loaded during login");
      } else {
        // If the user document doesn't exist in Firestore, create it
        console.log("Creating missing user document in Firestore during login");
        const newUserData = {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          createdAt: new Date().toISOString(),
          emailVerified: user.emailVerified,
          dietType: 'standard',
          goal: 'maintain',
          isGlutenFree: false,
        };
        
        // Create the user document
        await setDoc(userRef, newUserData);
        
        // Update our userData object
        userData = { ...userData, ...newUserData, uid: user.uid };
        
        // Cache it
        localStorage.setItem(`user_${user.uid}`, JSON.stringify(userData));
      }
    } catch (error) {
      // Log the error but don't fail the login
      console.error("Error fetching/creating user document during login:", error);
      
      // Try to load from cache if available
      const cachedUserData = localStorage.getItem(`user_${user.uid}`);
      if (cachedUserData) {
        try {
          const parsedData = JSON.parse(cachedUserData);
          userData = { ...userData, ...parsedData };
          console.log("Loaded user data from cache during login");
        } catch (e) {
          console.error("Error parsing cached user data:", e);
        }
      }
    }
    
    return { 
      success: true, 
      user: userData
    };
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    
    // Expanded error handling for Firebase auth errors
    let errorMessage = "Login failed. Please try again.";
    
    if (!navigator.onLine || error.code === "auth/network-request-failed") {
      errorMessage = "You appear to be offline. Please check your internet connection.";
    } else if (
      error.code === "auth/user-not-found" || 
      error.code === "auth/wrong-password" || 
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-email" ||
      error.code === "auth/invalid-login-credentials" || // New Firebase error code
      error.code === "auth/user-disabled" ||
      error.code === "auth/operation-not-allowed" ||
      error.code === "auth/account-exists-with-different-credential"
    ) {
      errorMessage = "Invalid email or password. Please check your credentials.";
      console.log("Authentication error code:", error.code);
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many login attempts. Please try again later or reset your password.";
    } else if (error.message === "Authentication timeout") {
      errorMessage = "Login timed out. Please check your connection and try again.";
    } else if (error.code === "auth/internal-error") {
      errorMessage = "Authentication service error. Please try again later.";
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code
    };
  }
};

// User Logout
export const logoutUser = async () => {
  try {
    const user = auth.currentUser;
    // Remove diet chart from localStorage for this user
    if (user && user.uid) {
      localStorage.removeItem(`dietChart_${user.uid}`);
    }
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Firebase Logout Error:", error.code, error.message);
    return {
      success: false,
      message: "Logout failed. Please try again.",
      errorCode: error.code
    };
  }
};

// Reset Password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      success: true,
      message: "Password reset email sent. Check your inbox."
    };
  } catch (error) {
    console.error("Firebase Reset Password Error:", error.code, error.message);
    
    // Provide more specific error messages based on Firebase error codes
    let errorMessage = "Failed to send password reset email. Please try again.";
    
    if (error.code === "auth/user-not-found") {
      errorMessage = "No user found with this email. Please check your email.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format. Please check your email.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code
    };
  }
};

// Update User Profile in Firestore
export const updateUserProfile = async (userId, userData) => {
  try {
    // Check if we're online
    if (!navigator.onLine) {
      throw new Error("You appear to be offline. Changes will be saved locally.");
    }
    
    const userRef = doc(db, "users", userId);
    
    // Use Promise.race with a timeout promise instead of AbortController
    const updatePromise = async () => {
      // First check if the user document exists
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Document exists, update it
        await updateDoc(userRef, userData);
      } else {
        // Document doesn't exist, create it with setDoc instead
        // This handles edge cases where the user document might be missing
        console.log("User document doesn't exist in Firestore. Creating new document.");
        
        // Include any fields that should always be present in a user document
        const completeUserData = {
          id: userId,
          createdAt: new Date().toISOString(),
          ...userData
        };
        
        await setDoc(userRef, completeUserData);
      }
      
      // If name is being updated, also update Auth profile
      if (userData.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: userData.name
        });
      }
      
      return { 
        success: true,
        message: "Profile updated successfully" 
      };
    };
    
    // Create a timeout promise that rejects after 30 seconds (increased from 20)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Profile update request timed out")), 30000));
    
    // Race the promises
    return await Promise.race([updatePromise(), timeoutPromise]);
    
  } catch (error) {
    console.error("Firebase Update Profile Error:", error.code, error.message);
    
    // Provide more specific error messages based on Firebase error codes
    let errorMessage = "Failed to update profile. Please try again.";
    
    if (!navigator.onLine || error.code === "unavailable" || 
        error.message?.includes("offline") || error.message?.includes("network")) {
      errorMessage = "You appear to be offline. Your changes will be saved locally.";
    } else if (error.code === "permission-denied") {
      errorMessage = "You don't have permission to update this profile.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code,
      offline: !navigator.onLine
    };
  }
};

// Change Password (requires re-authentication)
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        message: "No user is currently logged in."
      };
    }
    
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Change password
    await updatePassword(user, newPassword);
    
    return { 
      success: true,
      message: "Password changed successfully" 
    };
  } catch (error) {
    console.error("Firebase Change Password Error:", error.code, error.message);
    
    // Provide more specific error messages based on Firebase error codes
    let errorMessage = "Failed to change password. Please try again.";
    
    if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect current password. Please try again.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "New password is too weak. Please use a stronger password.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    return {
      success: false,
      message: errorMessage,
      errorCode: error.code
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Save Diet Chart to Firestore
export const saveDietChart = async (dietChartData) => {
  try {
    console.log("saveDietChart called with data:", dietChartData);
    
    // Ensure required fields like userId are present
    if (!dietChartData || !dietChartData.userId) {
      console.error("Missing required userId in diet chart data");
      throw new Error("User ID is required to save diet chart.");
    }
    
    // Generate a new ID or use one if provided (e.g., from local state before sync)
    const chartId = dietChartData.id || Date.now().toString();
    console.log("Using chart ID:", chartId);
    
    const chartRef = doc(db, "dietCharts", chartId);
    
    // Ensure we have all the required fields in the correct format
    const dataToSave = {
      id: chartId, // Ensure the ID is part of the document data
      userId: dietChartData.userId,
      date: dietChartData.dateCreated || new Date().toISOString(),
      createdAt: dietChartData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      data: {
        mealPlan: dietChartData.mealPlan || {},
        mealDisplayNames: dietChartData.mealDisplayNames || {},
        totalNutrients: dietChartData.totalNutrients || {},
        mealOrder: dietChartData.mealOrder || []
      },
      // Add any diet preferences to the top level
      dietType: dietChartData.dietType || 'standard',
      goal: dietChartData.goal || 'maintain',
      isGlutenFree: dietChartData.isGlutenFree || false
    };
    
    console.log("Saving diet chart with formatted data:", dataToSave);
    await setDoc(chartRef, dataToSave, { merge: true }); // Use setDoc with merge to handle create/update
    console.log("Diet chart saved successfully with ID:", chartId);
    
    return { 
      success: true, 
      chartId: chartId
    };
  } catch (error) {
    console.error("Firebase Save Diet Chart Error:", error);
    return {
      success: false,
      message: `Failed to save diet chart: ${error.message}`,
      errorCode: error.code
    };
  }
};

// Delete Diet Chart from Firestore
export const deleteDietChart = async (chartId) => {
  try {
    if (!chartId) {
        throw new Error("Chart ID is required to delete.");
    }
    await deleteDoc(doc(db, "dietCharts", chartId));
    return { success: true };
  } catch (error) {
    console.error("Firebase Delete Diet Chart Error:", error);
    return {
      success: false,
      message: "Failed to delete diet chart.",
      errorCode: error.code
    };
  }
};

// Fetch diet charts for the authenticated user
export const loadDietChartsFromFirebase = async (userId) => {
  if (!userId) {
    console.warn("loadDietChartsFromFirebase called without userId");
    return []; // Return empty array if no userId
  }
  
  try {
    console.log(`Attempting to load diet charts for user: ${userId}`);
    const chartsRef = collection(db, "dietCharts");
    
    // Create a simpler query without orderBy
    const q = query(chartsRef, where("userId", "==", userId));
    console.log("Executing Firestore query");
    
    const querySnapshot = await getDocs(q);
    
    // Check if empty
    if (querySnapshot.empty) {
      console.log(`No diet charts found for user ${userId}`);
      return [];
    }
    
    const charts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Handle serverTimestamp objects properly
      let processedData = {
        ...data,
        // Convert Firebase timestamp to standard date if it exists
        createdAt: data.createdAt instanceof Object && typeof data.createdAt.toDate === 'function' 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt || data.date || new Date().toISOString(),
        // Make sure the document ID is included
        id: doc.id
      };
      
      console.log(`Found chart with ID: ${doc.id}, date: ${processedData.date || processedData.createdAt}`);
      charts.push(processedData);
    });
    
    // Sort the charts by date (newest first) in JavaScript
    charts.sort((a, b) => {
      // Try to get a valid date for comparison
      const getValidDate = (item) => {
        if (item.createdAt) {
          return new Date(item.createdAt);
        } else if (item.date) {
          return new Date(item.date);
        }
        return new Date(0); // Fallback to epoch start
      };
      
      const dateA = getValidDate(a);
      const dateB = getValidDate(b);
      
      return dateB - dateA; // Sort newest first
    });
    
    console.log(`Successfully loaded ${charts.length} diet charts for user ${userId}`);
    return charts;
  } catch (error) {
    console.error("Error loading diet charts:", error);
    // Return empty array on error
    return []; 
  }
};