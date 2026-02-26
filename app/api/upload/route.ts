import { NextResponse } from 'next/server';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { cert } from 'firebase-admin/app';
import { getApps, initializeApp as adminInit } from 'firebase-admin/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  
  const manualId = `manual-${Date.now()}-${file.name}`;
  const storageRef = ref(storage, manualId);
  
  // REAL UPLOAD
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return NextResponse.json({
    success: true,
    manualId,
    url,  // Permanent PDF URL!
    message: `✅ ${file.name} (${Math.round(file.size/1000000)}MB) added to garage!`
  });
}










