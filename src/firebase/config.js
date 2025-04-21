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

// Initialize Firebase Authentication
const auth = getAuth(app);

// Promise that resolves when auth persistence is configured
export const authReady = setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Auth persistence enabled (LOCAL)'))
  .catch(err => console.error('Auth persistence error:', err));

// Initialize Firestore and enable offline persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
  .catch(err => console.warn('Firestore persistence:', err.code, err.message));

export { auth, db };