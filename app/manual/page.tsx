'use client';
import '../globals.css';  // ← ADD THIS LINE!

import { useState, useEffect, useRef } from 'react';
export default function Home() {
  const [status, setStatus] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [manualBoxes, setManualBoxes] = useState([
    { id: 1, name: null, content: null, filename: null, active: true },
    { id: 2, name: null, content: null, filename: null, active: false },
    { id: 3, name: null, content: null, filename: null, active: false }
  ]);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<{id: number} | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  // iOS Detector
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent || '');

  // Voice recognition for DESKTOP only
  useEffect(() => {
    if (isIOS) return; // Skip on iOS - use keyboard dictation instead

    let rec: any = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onstart = () => setIsListening(true);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        setIsListening(false);
        setStatus('❌ Voice failed. Check microphone permissions.');
      };
      
      setRecognition(rec);
      setBrowserSupportsSpeech(true);
    }
  }, []);

  const handleVoiceInput = async () => {
    if (isIOS) {
      setStatus('📱 iPhone: Tap keyboard 🎤 mic icon below!');
      return;
    }

    if (!browserSupportsSpeech) {
      setStatus('❌ Voice not supported in this browser');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recognition && !isListening) {
        recognition.start();
      }
    } catch {
      setStatus('❌ Allow microphone access');
    }
  };

  const handleUpload = async () => {
    if (!file) return setStatus('❌ Select a PDF first');
    
    // Find first empty box
    const emptyBoxIndex = manualBoxes.findIndex(box => !box.name);
    if (emptyBoxIndex === -1) {
      setStatus('❌ All 3 slots full! Remove a manual first.');
      return;
    }

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
        const newBoxes = [...manualBoxes];
        newBoxes[emptyBoxIndex] = {
          id: emptyBoxIndex + 1,
          name: manualName,
          content: result.content,
          filename: result.filename,
          active: true
        };
        
        // Deactivate others
        newBoxes.forEach((box, i) => {
          if (i !== emptyBoxIndex) box.active = false;
        });
        
        setManualBoxes(newBoxes);
        setStatus(`✅ ${manualName} added to Box ${emptyBoxIndex + 1}! Ready to ask.`);
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

  const handleAsk = async () => {
    if (!question.trim()) return setAnswer('❌ Enter your question');
    const activeBox = manualBoxes.find(box => box.active);
    if (!activeBox?.filename) return setAnswer('❌ Select a manual box first');
    
    setIsAsking(true);
    setAnswer('🤖 AI analyzing manual...');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: activeBox.filename, 
          question,
          activeManual: activeBox.name 
        }),
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

  // Auto-clear question 10 seconds after successful answer
  useEffect(() => {
    if (answer && !answer.includes('❌') && !answer.includes('Error')) {
      const timer = setTimeout(() => {
        setQuestion('');
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [answer]);

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 safe-pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-8 md:mb-12 pt-4 md:pt-0">
            <div className="inline-flex items-center px-4 sm:px-6 py-3 rounded-full bg-white/95 backdrop-blur-xl shadow-2xl border border-white/60 mb-4 md:mb-6">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
                🚗 Car Manual AI
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-2xl mx-auto leading-relaxed font-medium">
              Upload your vehicle's manual. Ask anything. Get instant expert answers powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* UPLOAD SECTION */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500 lg:sticky lg:top-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
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
                  className="w-full px-6 py-10 sm:py-8 border-2 border-dashed border-gray-300 rounded-xl text-center text-lg sm:text-xl font-semibold text-gray-700 transition-all duration-300 hover:border-emerald-400 focus:border-emerald-500 focus:outline-none file:mr-4 sm:file:mr-6 file:py-4 file:px-6 sm:file:px-8 file:rounded-xl file:border-0 file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 hover:cursor-pointer block h-14 sm:h-auto"
                />
                
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm sm:text-base text-gray-700 font-medium">
                      <span>{uploadProgress}%</span>
                      <span>{file ? `${(file.size/1000000).toFixed(1)}MB` : ''}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 sm:h-4 rounded-full transition-all duration-500 shadow-md" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full h-14 sm:h-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base sm:text-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-h-[58px]"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24">
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
                  <div className="font-bold text-lg sm:text-xl mb-2 flex items-center text-gray-900">
                    {status.includes('✅') ? '✅ Manual Ready!' : '⚠️ Status'}
                  </div>
                  <div className="text-gray-800 text-base sm:text-lg whitespace-pre-wrap leading-relaxed">{status}</div>
                </div>
              )}
            </div>

            {/* ASK + MANUALS SECTION */}
            <div className="space-y-6">
              {/* NEW 3-BOX GARAGE SELECTOR */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">📦 Your Garage (Max 3)</h3>
                
                <div className="space-y-3">
                  {manualBoxes.map((box) => (
                    <div key={box.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        id={`box-${box.id}`}
                        checked={box.active}
                        onChange={() => {
                          const newBoxes = manualBoxes.map(b => ({
                            ...b,
                            active: b.id === box.id
                          }));
                          setManualBoxes(newBoxes);
                          setStatus(`${box.name || 'Box ' + box.id} selected`);
                        }}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 mr-3"
                      />
                      
                      {/* Box Content */}
                      <div className="flex-1 min-w-0">
                        {box.name ? (
                          <>
                            <div className="font-semibold text-gray-900 truncate">{box.name.split(' (')[0]}</div>
                            <div className="text-sm text-gray-500">{box.name.split('(')[1]?.replace(')', '')}</div>
                          </>
                        ) : (
                          <div className="text-gray-500 italic">Box {box.id} - Empty</div>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      {box.name && (
                        <button
                          onClick={() => setShowRemoveConfirm({id: box.id})}
                          className="ml-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-lg transition-all hover:shadow-sm whitespace-nowrap"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ASK SECTION */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-500">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  💬 Ask Expert
                  {(() => {
                    const activeBox = manualBoxes.find(box => box.active);
                    return activeBox?.name && (
                      <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {activeBox.name.split('(')[0].trim()}
                      </span>
                    );
                  })()}
                </h2>

              {/* 🎯 PERFECT iOS DETECTION + INSTRUCTIONS */}
              <div className="mb-6">
                {isIOS ? (
                  /* iPHONE USERS: Clear keyboard dictation instructions */
                  <div className="p-5 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-2xl shadow-lg mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎤</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-emerald-900 mb-1">iPhone Voice (100% Reliable)</h3>
                        <p className="text-emerald-800 text-sm font-medium">Tap below → keyboard → 🎤 mic icon</p>
                      </div>
                    </div>
                    <ol className="text-sm text-gray-800 space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                        Tap the question box below 👇
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                        Tap <span className="font-bold text-lg">🎤</span> (Right of spacebar)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                        Speak → text appears automatically!
                      </li>
                    </ol>
                  </div>
                ) : browserSupportsSpeech ? (
                  /* DESKTOP USERS: Fancy voice button */
                  <>
                    <button
                      ref={micButtonRef}
                      onClick={handleVoiceInput}
                      disabled={isAsking || isUploading}
                      className={`w-full h-16 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                        isListening 
                          ? 'animate-pulse ring-4 ring-purple-200/50 bg-purple-600 scale-105 shadow-2xl' 
                          : 'hover:shadow-2xl hover:-translate-y-0.5 hover:scale-102'
                      }`}
                      title={isListening ? '🔴 Listening... Click to stop' : '🎤 Click & speak your question'}
                    >
                      <span className="text-2xl">🎤</span>
                      {isListening ? '🔴 Listening...' : 'Speak Your Question'}
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-2">Hold and speak clearly ✨</p>
                  </>
                ) : (
                  /* NO VOICE SUPPORT */
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center mb-4">
                    <p className="text-sm text-yellow-800 font-medium">🎤 Voice input not supported</p>
                    <p className="text-xs text-yellow-700 mt-1">Type your question below</p>
                  </div>
                )}

                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isIOS ? "👆 Tap here → keyboard → 🎤 mic (left of spacebar) → speak!" : "What oil type? Brake schedule? Tire rotation? Press ENTER to ask..."}
                  disabled={isAsking || isUploading || !manualBoxes.find(box => box.active && box.filename)}
                  rows={4}
                  className="w-full px-5 py-5 border-2 rounded-2xl resize-vertical focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 text-base sm:text-lg placeholder-gray-600 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-75 leading-relaxed bg-white/80 text-gray-900 min-h-[120px] h-auto"
                />
              </div>

              <button 
                onClick={handleAsk}
                disabled={!question.trim() || isAsking || isUploading || !manualBoxes.find(box => box.active && box.filename)}
                className="w-full h-14 sm:h-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-6 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-base sm:text-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 min-h-[58px]"
              >
                {isAsking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    AI Thinking...
                  </>
                ) : (
                  '🚀 Ask the Manual'
                )}
              </button>

              {/* ANSWER + THUMBS */}
              {answer && (
  <>
    {/* Answer Box */}
    <div className="mt-6 sm:mt-8 p-6 sm:p-8 max-h-96 lg:max-h-none overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl border-2 border-blue-200 shadow-xl backdrop-blur-sm">
      {/* Header with AI label */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="font-bold text-lg sm:text-xl text-gray-900 flex items-center gap-2 flex-wrap">
          📄 Answer from Manual
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 text-sm font-semibold rounded-full shadow-sm">
            AI
          </span>
        </div>
        {(() => {
          const activeBox = manualBoxes.find(box => box.active);
          return activeBox?.name && (
            <span className="text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-lg backdrop-blur-sm">
              {activeBox.name.split(' ')[0]}
            </span>
          );
        })()}
      </div>

      {/* Answer Text */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap prose-headings:font-bold prose-p:mb-4 text-base sm:text-lg">
        {answer}
      </div>

      {/* Speak Answer Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            if (!answer) return;
            // Stop any previous speech
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(answer);
            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
          }}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <span className="text-2xl">🗣️</span>
          Speak Answer
        </button>
      </div>
    </div>

    {/* Feedback Thumbs */}
    <div className="mt-6 flex gap-3 justify-center">
      <button
        onClick={() => {
          console.log('👍 Good answer:', question, '→', answer);
          setStatus('✅ Thanks! This helps improve answers');
          setTimeout(() => setStatus(''), 2000);
        }}
        className="p-3 rounded-xl bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 hover:text-green-800 text-xl font-semibold transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
        title="Great answer!"
      >
        👍
      </button>
      <button
        onClick={() => {
          console.log('👎 Needs improvement:', question, '→', answer);
          setStatus('📝 Thanks! We\'ll make this better');
          setTimeout(() => setStatus(''), 2000);
        }}
        className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 hover:text-red-800 text-xl font-semibold transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
        title="Needs improvement"
      >
        👎
      </button>
    </div>
  </>
)}
            </div>

            {/* End ASK SECTION */}
          </div>

          {/* End ASK + MANUALS SECTION */}
        </div>

        {/* End GRID */}
      </div>

      {/* End MAX-W CONTAINER */}
    </div>

    {/* End MAIN CONTAINER */}

    {/* REMOVE CONFIRMATION MODAL */}
    {showRemoveConfirm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Remove Manual?</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Are you sure you wish to remove this manual? 
            You'll need to upload it again to use it.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowRemoveConfirm(null)}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
  onClick={() => {
    const boxId = showRemoveConfirm.id;
    const newBoxes = manualBoxes.map(box => 
      box.id === boxId 
        ? { id: box.id, name: null, content: null, filename: null, active: false }
        : box
    );
    // Activate first non-empty box or box 1
    const firstBox = newBoxes.find(box => box.name) || newBoxes[0];
    firstBox.active = true;
    setManualBoxes(newBoxes);
    setShowRemoveConfirm(null);
    setStatus('🗑️ Manual removed');
  }}
  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
Remove Manual
</button>
      </div>
    </div>
  </div>
)}

    </>
  );
}