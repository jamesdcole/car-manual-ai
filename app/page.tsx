'use client';
import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const handleUpload = async () => {
    if (!file) return setStatus('❌ Select a PDF first');
    setIsUploading(true);
    setStatus('⏳ Uploading & processing...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      
      if (result.success) {
        setStatus(`✅ ${result.filename} loaded! (${(result.size/1000000).toFixed(1)}MB)`);
      } else {
        setStatus(`❌ ${result.error}`);
      }
    } catch {
      setStatus('❌ Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return setAnswer('❌ Enter your question');
    if (!status.includes('✅')) return setAnswer('❌ Upload PDF first');
    
    setIsAsking(true);
    setAnswer('🤖 DeepSeek analyzing manual...');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: status.split(' ')[1], question }),
      });
      const result = await res.json();
      setAnswer(result.answer || result.error || 'No response');
    } catch {
      setAnswer('❌ Ask failed');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-xl border border-white/50 mb-6">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              🚗 Car Manual AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your vehicle's manual. Ask anything. Get instant expert answers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* UPLOAD */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📁 Upload Manual
              {status.includes('✅') && (
                <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full animate-bounce">Ready!</span>
              )}
            </h2>
            
            <div className="space-y-4">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isUploading}
                className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-2xl text-center text-lg transition-colors hover:border-blue-400 focus:border-blue-500 focus:outline-none file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg disabled:cursor-not-allowed disabled:transform-none"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  '🚀 Upload & Analyze'
                )}
              </button>
            </div>

            {status && (
              <div className={`mt-6 p-6 rounded-2xl ${status.includes('✅') ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                <div className="font-semibold text-lg mb-2 flex items-center">
                  {status.includes('✅') ? '✅ Manual Ready!' : '❌ Upload Status'}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{status}</div>
              </div>
            )}
          </div>

          {/* ASK */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Ask Expert</h2>
            
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What oil type? Brake pad replacement interval? Tire rotation schedule?..."
              disabled={!status.includes('✅') || isAsking}
              rows={4}
              className="w-full px-4 py-3 border-2 rounded-2xl resize-none focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-lg placeholder-gray-500"
            />
            
            <button 
              onClick={handleAsk}
              disabled={!status.includes('✅') || !question.trim() || isAsking}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isAsking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  DeepSeek Thinking...
                </>
              ) : (
                '🤖 Get Answer from Manual'
              )}
            </button>

            {answer && (
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg">
                <div className="font-semibold text-lg text-gray-900 mb-3 flex items-center">
                  📄 Manual Answer
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">DeepSeek AI</span>
                </div>
                <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">{answer}</div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          Powered by Next.js 16 + DeepSeek RAG • Your truck manual, AI-powered
        </div>
      </div>
    </div>
  );
}








