import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  
  // Just save filename, process client-side
  const filename = Date.now() + '-' + file.name;
  
  return NextResponse.json({ 
    success: true, 
    filename, 
    url: `/uploads/${filename}`
  });
}



















