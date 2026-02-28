import { NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const maxDuration = 30;  // ✅ 30s for big PDFs
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    console.log(`📤 Uploading ${file.name} (${Math.round(file.size/1000000)}MB)`);
    
    const manualId = file.name.replace(/[^a-z0-9.]/gi, '_');
    const storageRef = ref(storage, `manuals/${manualId}`);

    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      manualId,
      url,
      message: `✅ ${file.name} (${Math.round(file.size/1000000)}MB) added!`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}












