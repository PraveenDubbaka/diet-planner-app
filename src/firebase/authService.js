// Firebase authentication service for the Diet Planner app
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './config';

// User registration
export const registerUser = async (email, password, name) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: name
    });
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: name
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    // Check network connectivity first
    if (!navigator.onLine) {
      console.log("Login attempted while offline");
      return {
        success: false,
        error: "You appear to be offline. Please check your internet connection and try again.",
        isOffline: true
      };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    try {
      // Update last login timestamp
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      
      // Get user data from Firestore
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: user.displayName || userDoc.data().name,
            ...userDoc.data()
          }
        };
      } else {
        // If for some reason user document doesn't exist, create it
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
        
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: user.displayName || ''
          }
        };
      }
    } catch (firestoreError) {
      // If we can authenticate but can't reach Firestore, return limited user data
      if (!navigator.onLine || firestoreError.code === "unavailable" || 
          firestoreError.message?.includes("offline") || firestoreError.message?.includes("network")) {
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: user.displayName || email.split('@')[0],
            offlineMode: true
          },
          message: "Logged in with limited functionality due to connectivity issues."
        };
      }
      
      // Re-throw if it's a different type of error
      throw firestoreError;
    }
  } catch (error) {
    // Check for specific offline error codes
    if (!navigator.onLine || error.code === "auth/network-request-failed" || 
        error.message?.includes("offline") || error.message?.includes("network")) {
      return {
        success: false,
        error: "You appear to be offline. Please check your internet connection and try again.",
        isOffline: true
      };
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Change password (requires reauthentication)
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: 'No user is currently signed in.'
      };
    }
    
    // Create credential with current password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    
    // Reauthenticate user
    await reauthenticateWithCredential(user, credential);
    
    // Change password
    await updatePassword(user, newPassword);
    
    return {
      success: true,
      message: 'Password updated successfully!'
    };
  } catch (error) {
    let errorMessage = error.message;
    
    // Friendly error messages for common errors
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Your current password is incorrect. Please try again.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Your new password is too weak. Please choose a stronger password.';
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: 'No user is currently signed in.'
      };
    }
    
    // Update user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
    
    // Update display name if provided
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }
    
    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Delete user account
export const deleteUserAccount = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        message: 'No user is currently signed in.'
      };
    }
    
    // Create credential with current password
    const credential = EmailAuthProvider.credential(
      user.email,
      password
    );
    
    // Reauthenticate user
    await reauthenticateWithCredential(user, credential);
    
    // Delete user document from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await deleteDoc(userDocRef);
    
    // Delete user account
    await user.delete();
    
    return {
      success: true,
      message: 'Your account has been deleted successfully!'
    };
  } catch (error) {
    let errorMessage = error.message;
    
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'The password you entered is incorrect. Please try again.';
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Save user data to Firestore
export const saveUserData = async (userId, data) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      message: 'User data saved successfully!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};