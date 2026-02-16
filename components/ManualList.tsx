"use client";
import { useState, useEffect } from 'react';

interface Manual {
  id: string;
  chunks: number;
  size: number;
}

export default function ManualList() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    fetch('/api/manuals')
      .then(res => res.json())
      .then(setManuals);
  }, []);

  const deleteManual = async (id: string) => {
    await fetch(`/api/manuals/${id}`, { method: 'DELETE' });
    setManuals(manuals.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Manual:</label>
      <div className="space-y-1">
        {manuals.map(manual => (
          <div key={manual.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="manual"
                value={manual.id}
                checked={selected === manual.id}
                onChange={() => setSelected(manual.id)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <p className="font-medium">{manual.id.slice(-12)}</p>
                <p className="text-xs text-gray-500">{manual.chunks} chunks</p>
              </div>
            </div>
            <button
              onClick={() => deleteManual(manual.id)}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {manuals.length === 0 && (
        <p className="text-gray-500 text-sm italic">No manuals uploaded yet</p>
      )}
    </div>
  );
}
