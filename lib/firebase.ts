// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdLNwoizpooBeJwDW2cfHZwrZbTEa2uVk",
  authDomain: "car-manual-ai-5c053.firebaseapp.com",
  projectId: "car-manual-ai-5c053",
  storageBucket: "car-manual-ai-5c053.firebasestorage.app",
  messagingSenderId: "992162097398",
  appId: "1:992162097398:web:00a475a7b67840aa7024d7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);     // ← ADD THIS
export const storage = getStorage(app); // ← ADD THIS
export default app;
