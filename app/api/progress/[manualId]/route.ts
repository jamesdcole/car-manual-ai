import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { manualId: string } }) {
  try {
    const manualFile = path.join(process.cwd(), "data", `manual-${params.manualId}.json`);
    if (fs.existsSync(manualFile)) {
      return NextResponse.json({ status: "complete", progress: 100 });
    }
    return NextResponse.json({ status: "processing", progress: 75 });
  } catch {
    return NextResponse.json({ status: "processing", progress: 50 });
  }
}
