// app/api/status/[manualId]/route.ts
import { NextResponse } from 'next/server';

// Define STATUS here instead of importing
const STATUS: Record<string, any> = {};

export async function GET(
  { params }: { params: { manualId: string } }
) {
  const status = STATUS[params.manualId];
  if (!status) return NextResponse.json({ error: 'Manual not found' }, { status: 404 });
  return NextResponse.json(status);
}

