'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [manuals, setManuals] = useState<string[]>([]);
  const [selectedManual, setSelectedManual] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load existing manuals
  useEffect(() => {
    setManuals([
      '1771198854684-046a6b.pdf (Ford F-150)',
      '1771199144702-046a6b.pdf (Backup)',
    ]);
  }, []);

  const handleUpload = async () => {
    if (!file) return setStatus('❌ Select a PDF first');
    
    setIsUploading(true);
    setUploadProgress(10);
    setStatus(`⏳ ${(file.size/1000000).toFixed(1)}MB uploading...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(50);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      
      setUploadProgress(90);
      
      if (result.success) {
        const manualName = `${result.filename} (${(result.size/1000000).toFixed(1)}MB)`;
        setManuals(prev => [manualName, ...prev]);
        setSelectedManual(manualName);
        setStatus(`✅ ${manualName} loaded! Ready to ask.`);
      } else {
        setStatus(`❌ ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ Upload failed');
    } finally {
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const deleteManual = (manualName: string) => {
    setManuals(prev => prev.filter(name => name !== manualName));
    if (selectedManual === manualName) {
      setSelectedManual('');
      setStatus('');
    }
    setAnswer('');
  };

  const handleAsk = async () => {
    if (!question.trim()) return setAnswer('❌ Enter your question');
    if (!selectedManual && !status.includes('✅')) return setAnswer('❌ Upload/select manual first');
    
    setIsAsking(true);
    setAnswer('🤖 AI analyzing manual...');

    try {
      const filename = selectedManual.split(' ')[0] || status.split(' ')[1];
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, question }),
      });
      const result = await res.json();
      setAnswer(result.answer || result.error || 'No response');
    } catch (error) {
      setAnswer('❌ Ask failed - check console');
    } finally {
      setIsAsking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAsking) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 mb-6">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              🚗 Car Manual AI
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Upload your vehicle's manual. Ask anything. Get instant expert answers powered by AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* UPLOAD SECTION */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 lg:sticky lg:top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📁 Upload Manual
              {status.includes('✅') && (
                <span className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full animate-pulse">Loaded!</span>
              )}
            </h2>
            
            <div className="space-y-4">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isUploading}
                className="w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-2xl text-center text-lg transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:outline-none file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:cursor-pointer hover:file:bg-emerald-100"
              />
              
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{uploadProgress}%</span>
                    <span>{file ? `${(file.size/1000000).toFixed(1)}MB` : ''}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500 shadow-md" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 text-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  '🚀 Upload & Analyze Manual'
                )}
              </button>
            </div>

            {status && (
              <div className={`mt-6 p-6 rounded-2xl ${
                status.includes('✅') 
                  ? 'bg-emerald-50 border-2 border-emerald-200 shadow-emerald-100/50' 
                  : 'bg-red-50 border-2 border-red-200 shadow-red-100/50'
              } shadow-lg backdrop-blur-sm`}>
                <div className="font-bold text-lg mb-2 flex items-center">
                  {status.includes('✅') ? '✅ Manual Ready!' : '⚠️ Status'}
                </div>
                <div className="text-gray-800 whitespace-pre-wrap">{status}</div>
              </div>
            )}
          </div>

          {/* ASK + MANUALS SECTION */}
          <div className="space-y-6">
            {/* MANUAL SELECTOR - FIXED */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📚 Active Manual</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={selectedManual} 
                  onChange={(e) => {
                    setSelectedManual(e.target.value);
                    setStatus(e.target.value ? `✅ ${e.target.value} selected` : '');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                  disabled={isAsking}
                >
                  <option value="">Select manual...</option>
                  {manuals.map((manual, i) => (
                    <option key={i} value={manual}>{manual}</option>
                  ))}
                </select>
                {manuals.length > 0 && (
                  <button
                    onClick={() => {
                      if (selectedManual) {
                        deleteManual(selectedManual);
                        setStatus('🗑️ Selected manual removed');
                      } else {
                        setStatus('⚠️ Select a manual first');
                      }
                    }}
                    className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-xl transition-all border border-red-200 hover:shadow-md whitespace-nowrap"
                  >
                    🗑️ Remove Selected
                  </button>
                )}
              </div>
            </div>

            {/* ASK SECTION */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                💬 Ask Expert
                {selectedManual && (
                  <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {selectedManual.split('(')[0].trim()}
                  </span>
                )}
              </h2>
              
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What oil type? Brake schedule? Tire rotation? Press ENTER to ask..."
                disabled={!selectedManual && !status.includes('✅') || isAsking}
                rows={4}
                className="w-full px-5 py-4 border-2 rounded-2xl resize-vertical focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 text-lg placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-75 leading-relaxed"
              />
              
              <button 
                onClick={handleAsk}
                disabled={!question.trim() || (!selectedManual && !status.includes('✅')) || isAsking}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 text-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isAsking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    AI Thinking...
                  </>
                ) : (
                  <>
                    <span className="text-xl">🤖</span>
                    Get Answer from Manual
                  </>
                )}
              </button>

              {answer && (
                <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-xl text-gray-900 flex items-center gap-2">
                      📄 Answer from Manual
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-xs font-semibold rounded-full shadow-sm">
                        AI
                      </span>
                    </div>
                    {selectedManual && (
                      <span className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                        {selectedManual.split(' ')[0]}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap prose-headings:font-bold prose-p:mb-4">
                    {answer}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-20 pt-12 border-t border-gray-200/50">
          <p className="text-lg text-gray-600 mb-2">
            Powered by <span className="font-semibold text-blue-600">Next.js 16</span> + <span className="font-semibold text-indigo-600">AI RAG</span>
          </p>
          <p className="text-sm text-gray-500">
            Your truck manuals, AI-powered • Production ready • GitHub safe 🚀
          </p>
        </div>
      </div>
    </div>
  );
}









