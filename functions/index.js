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
      const { filename, question, manualText } = req.body;
      
      // 🔥 PDF.JS CLIENT-SIDE (90% THERE!)
      if (manualText) {
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

Use ONLY this text.`
              },
              {
                role: 'user',
                content: `${manualText}\n\nQUESTION: ${question}`
              }
            ],
            max_tokens: 1000,
            temperature: 0.1
          })
        });
        
        const deepseekData = await deepseekResponse.json();
        res.json({ answer: deepseekData.choices[0].message.content });
        return;
      }
      
      // YOUR PROVEN SERVER FALLBACK
      const bucket = admin.storage().bucket('car-manual-ai-5c053.firebasestorage.app');
      const file = bucket.file(`manuals/${filename}`);
      const cacheKey = filename;
      
      if (!manualCache[cacheKey]) {
        console.log(`🔄 Caching ${filename}...`);
        const [buffer] = await file.download();
        const data = await pdfParse(buffer);
        manualCache[cacheKey] = data.text;
      }
      
      const fullText = manualCache[cacheKey];
      const smartChunkText = fullText.slice(-48000); // Your working logic
      
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
Use provided text only.`
            },
            {
              role: 'user',
              content: `${smartChunkText}\n\nQUESTION: ${question}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });
      
      const deepseekData = await deepseekResponse.json();
      res.json({ answer: deepseekData.choices[0].message.content });
      
    } catch (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: error.message });
    }
  });
});
















