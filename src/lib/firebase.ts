import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

let rawApiKey = process.env.PUBLIC_FIREBASE_API_KEY || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_API_KEY) || "AIzaSyAPEpHo8eLLArr1WnkxsjA4s_UByRzXaf4";
if (rawApiKey.includes("AIzaSyAPEPho8eLLArr1WnkxsjA4s_UByRzXaf4")) {
  rawApiKey = "AIzaSyAPEpHo8eLLArr1WnkxsjA4s_UByRzXaf4";
}

const firebaseConfig = {
  apiKey: rawApiKey,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN) || "unilka.firebaseapp.com",
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_PROJECT_ID) || "unilka",
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET) || "unilka.firebasestorage.app",
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || "980625042877",
  appId: process.env.PUBLIC_FIREBASE_APP_ID || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_APP_ID) || "1:980625042877:web:9a67cea6a73a275a31f6d4",
  measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID || (import.meta.env && import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID) || "G-V286JM8WNK"
};

// Singleton pour éviter les ré-initialisations multiples
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default db;
