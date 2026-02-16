"use client";
import { useEffect, useState } from 'react';

interface ProgressProps {
  manualId: string;
}

export default function UploadProgress({ manualId }: ProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
      
      const statuses = ['Uploading...', 'OCR Processing...', 'Extracting text...', 'Almost done!'];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, [manualId]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-6 border max-w-sm">
      <div className="flex justify-between mb-3">
        <span className="font-medium">{status}</span>
        <span className="text-sm font-mono">{manualId.slice(-8)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-2">{Math.round(progress)}%</div>
    </div>
  );
}
