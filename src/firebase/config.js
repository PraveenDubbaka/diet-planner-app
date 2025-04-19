// Firebase configuration for your Diet Planner app
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1qMmxLcw0nx5Xbn42nc28g-Gb2x4RPHg",
  authDomain: "diet-planner-app-16467.firebaseapp.com",
  projectId: "diet-planner-app-16467",
  storageBucket: "diet-planner-app-16467.appspot.com",
  messagingSenderId: "500445862948",
  appId: "1:500445862948:web:620f9d053051cfd7ed0cb1",
  measurementId: "G-PX4T38MWJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Track persistence status globally
let persistenceEnabled = false;
let persistenceError = null;

// Set persistence for authentication - more reliable approach
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence enabled successfully");
  })
  .catch((error) => {
    console.error("Firebase auth persistence error:", error.code, error.message);
  });

// Function to enable Firestore persistence with improved error handling
const enablePersistence = async () => {
  if (persistenceEnabled || persistenceError) return;
  
  try {
    await enableIndexedDbPersistence(db, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
    persistenceEnabled = true;
    console.log("Firestore offline persistence enabled successfully");
  } catch (err) {
    persistenceError = err;
    
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firestore persistence unavailable: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence unavailable: Browser doesn\'t support required features.');
    } else {
      console.error('Firestore persistence error:', err);
    }
  }
};

// Improved persistence initialization - wrapped in a Promise
const initializeOfflineCapabilities = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
          enablePersistence().then(() => resolve({
            persistenceEnabled,
            persistenceError
          }));
        });
      } else {
        // DOM already loaded, enable persistence now
        enablePersistence().then(() => resolve({
          persistenceEnabled,
          persistenceError
        }));
      }
    } else {
      resolve({ persistenceEnabled: false, persistenceError: new Error('Not in browser environment') });
    }
  });
};

// Export a function to check if app is in offline mode
const isOffline = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return !navigator.onLine;
  }
  return false;
};

// Initialize persistence right away
initializeOfflineCapabilities();

export { auth, db, enablePersistence, initializeOfflineCapabilities, isOffline };