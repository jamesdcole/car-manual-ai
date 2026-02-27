// app/api/upload/route.ts - SHARED FIREBASE (No duplicate app!)
import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';  // ✅ Your existing firebase.js!

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const manualId = file.name.replace(/[^a-z0-9.]/gi, '_');
    const storageRef = ref(storage, `manuals/${manualId}`);

    // REAL FIREBASE UPLOAD
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      manualId,
      url,
      message: `✅ ${file.name} (${Math.round(file.size/1000000)}MB) added to garage!`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}











