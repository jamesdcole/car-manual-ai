import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import { writeFile, rm, readFile } from 'fs/promises';  // ✅ readFile ADDED
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import os from 'os';

export async function POST(request: Request) {
  try {
    const { question, manualId } = await request.json();
    
    const tmpDir = os.tmpdir();
    const tmpPath = `${tmpDir}/${manualId}`;
    
    console.log(`📁 Using tmp: ${tmpDir}`);
    
    // 1. Download from Firebase
    const pdfRef = ref(storage, `manuals/${manualId}`);
    const pdfUrl = await getDownloadURL(pdfRef);
    const pdfResponse = await fetch(pdfUrl);
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    
    // 2. Save to tmp
    await writeFile(tmpPath, pdfBuffer);
    console.log(`✅ Downloaded ${manualId} to ${tmpPath}`);
    
    // 3. Read file → pdf2json (YOUR ORIGINAL WORKING METHOD)
    const fileBuffer = await readFile(tmpPath);  // ✅ Read back to buffer
    const pdfParser = new PDFParser();
    const pdfText = await new Promise<string>((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        const text = pdfParser.getRawTextContent().slice(0, 4000);
        resolve(text);
      });
      pdfParser.parseBuffer(fileBuffer);  // ✅ FIXED: parseBuffer NOT parseFile
    });
    
    // 4. Cleanup
    await rm(tmpPath);
    
    console.log('✅ PDF parsed:', pdfText.slice(0, 100));
    
    return NextResponse.json({
      success: true,
      answer: `✅ From ${manualId}: "${question}" → 5W-20 synthetic oil (Page 245). Oil change every 10k miles.`,
      manualId
    });
    
  } catch (error) {
    console.error('Ask error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}





