// lib/firebase.ts - YOUR EXACT CONFIG
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCdLNwoizpooBeJwDW2cfHZwrZbTEa2uVk",
  authDomain: "car-manual-ai-5c053.firebaseapp.com",
  projectId: "car-manual-ai-5c053",
  storageBucket: "car-manual-ai-5c053.firebasestorage.app",
  messagingSenderId: "992162097398",
  appId: "1:992162097398:web:00a475a7b67840aa7024d7"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default app;
