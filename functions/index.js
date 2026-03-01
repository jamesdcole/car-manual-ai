const functions = require('firebase-functions');
const admin = require('firebase-admin');
const pdfParse = require('pdf-parse');
const cors = require('cors')({ origin: true });

let manualCache = {};
admin.initializeApp();

exports.ask = functions.https.onRequest((req, res) => {
  // 🔥 CORS HEADERS
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  res.set('Access-Control-Allow-Origin', '*');
  
  cors(req, res, async () => {
    try {
      const { manualId, question, manualText } = req.body;

// 🔥 VALIDATION - Mobile-safe parsing
if (!question?.trim()) {
  return res.status(400).json({ error: 'Question required' });
}

// 🔥 PDF.JS CLIENT-SIDE (Instant, no cold start!)
if (manualText && manualText.trim().length > 100) {
  console.log(`📱 PDF.js HIT: ${manualText.length} chars`);
  
  const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk-12e55ce9f661462a8b1344b7feb0671f',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `Master auto mechanic. EXACT page extract from OEM manual.

TORQUE: "25 ft-lb (34 N·m)"
CAPACITY: "5.8 quarts" 
OIL: "0W-20 synthetic"

Use ONLY this text. Cite page numbers.`
        },
        {
          role: 'user',
          content: `${manualText}\n\nQUESTION: ${question}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.1
    })
  });
  
  const deepseekData = await deepseekResponse.json();
  console.log('📱 Client PDF success');
  return res.json({ answer: deepseekData.choices[0].message.content });
}

// 🔥 SERVER FALLBACK (Desktop/Heavy PDFs)
console.log(`🖥️ Server parsing: ${manualId}`);
const bucket = admin.storage().bucket();
const file = bucket.file(`manuals/${manualId}`);
const cacheKey = manualId;

if (!manualCache[cacheKey]) {
  console.log(`🔄 Caching ${manualId}...`);
  const [buffer] = await file.download();
  const data = await pdfParse(buffer);
  manualCache[cacheKey] = data.text;
}

const fullText = manualCache[cacheKey];
const smartChunkText = fullText.slice(-48000);

const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-12e55ce9f661462a8b1344b7feb0671f',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `Master auto mechanic. Vehicle manual excerpt.

TORQUE: "25 ft-lb"
CAPACITY: "5.8 quarts"
Use provided text only. Cite pages.`
      },
      {
        role: 'user',
        content: `${smartChunkText}\n\nQUESTION: ${question}`
      }
    ],
    max_tokens: 1500,
    temperature: 0.1
  })
});

const deepseekData = await deepseekResponse.json();
res.json({ answer: deepseekData.choices[0].message.content });

    } catch (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: error.message });
    }
  });  // cors END
});
















