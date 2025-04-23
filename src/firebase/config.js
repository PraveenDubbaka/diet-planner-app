// Firebase configuration for your Diet Planner app
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED, connectFirestoreEmulator } from 'firebase/firestore';

// For development/debugging only - direct configuration 
// This ensures the app works even if env vars fail to load
const directConfig = {
  apiKey: "AIzaSyC1qMmxLcw0nx5Xbn42nc28g-Gb2x4RPHg",
  authDomain: "diet-planner-app-16467.firebaseapp.com",
  projectId: "diet-planner-app-16467",
  storageBucket: "diet-planner-app-16467.appspot.com",
  messagingSenderId: "500445862948",
  appId: "1:500445862948:web:620f9d053051cfd7ed0cb1",
  measurementId: "G-PX4T38MWJN"
};

// Use direct config instead of env vars to ensure reliability
const firebaseConfig = directConfig;

console.log("Initializing Firebase with configuration:", 
  Object.keys(firebaseConfig).reduce((acc, key) => {
    acc[key] = firebaseConfig[key] ? `${key} is configured` : `${key} is MISSING`;
    return acc;
  }, {})
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set persistence explicitly 
console.log("Setting Firebase auth persistence to LOCAL");
// Create Promise that main.jsx is waiting for
export const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('✅ Auth persistence enabled (LOCAL)');
    return true;
  })
  .catch(err => {
    console.error('❌ Auth persistence error:', err);
    // Don't completely block the app from loading if persistence fails
    return Promise.resolve(true);
  });

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for Firestore
try {
  enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
    .then(() => console.log('✅ Firestore offline persistence enabled'))
    .catch(err => console.warn('⚠️ Firestore persistence:', err.code, err.message));
} catch (err) {
  console.error('❌ Error enabling Firestore persistence:', err);
}

export { auth, db };