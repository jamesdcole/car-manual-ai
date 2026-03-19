const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const pdfParse = require('pdf-parse');

admin.initializeApp();

let manualCache = {};
const PRICE_ID = 'price_1T7T9k6K0DZonXi3c0UX6I6k';

// 🔥 STRIPE HELPER - Fixes cold start crash
let stripeInstance = null;
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe('sk_test_51T7Swu6K0DZonXi3HeCtWpNzwUWIki0Ri5zpO8IJ4jHV5MlZ0XmH8gCkORfAV0dbxEROzNr5N81mla962kK5IMcg00Zjgajvdf', {
      apiVersion: '2024-06-20',  // Updated API version
    });
  }
  return stripeInstance;
}

// 🔥 FIXED: createCheckout - Returns URL (not sessionId)
exports.createCheckout = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const stripe = getStripe();
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: PRICE_ID,  // ✅ Your test price: price_1T7T9k6K0DZonXi3c0UX6I6k
        quantity: 1,
      }],
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      metadata: { firebase_uid: uid }
    });

    res.json({ url: session.url });  // Frontend expects sessionId
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🔥 FUNCTION 1: Rusty AI Mechanic (ALL YOUR RUSTY CODE PRESERVED)
exports.ask = functions.https.onRequest((req, res) => {
  // CORS HEADERS
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

      if (!question?.trim()) {
        return res.status(400).json({ error: 'Question required' });
      }

      // 🔥 PDF.JS CLIENT-SIDE - FULL RUSTY
      if (manualText && manualText.trim().length > 100) {
        console.log(`📱 PDF.js HIT: ${manualText.length} chars`);

        const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer sk-12e55ce9f661462a8b1344b7feb0671f',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: `You're Rusty, a grizzled 30-year master mechanic who's seen every engine failure possible. 
Talk like you're covered in grease, leaning over the hood with a ratchet in hand. Smell of Pennzoil and brake cleaner.

✅ EXTRACT from OEM manual FIRST - exact specs in **BOLD**:
**TORQUE: 25 ft-lb (34 N·m)**
**CAPACITY: 5.8 quarts** 
**OIL: 0W-20 synthetic**

✅ THEN mechanic wisdom:
- "That spec's straight from factory - don't overthink it"
- "Backyard mechanics always strip those bolts at 35..."
- "Dealership charges $200 for 5 minutes work" 
- "Your uncle's advice? Wrong. Manual's right."
- "Seen that fail 10,000 times - trust me"

✅ Personality: Gruff but helpful. Short sentences. Calls out BS. 
Mild swears when frustrated. Uses shop lingo: "torque wrench", "blue Loctite", "snap-on tools".

Example: "**TORQUE: 25 ft-lb (34 N·m)** - factory spec. Don't crank past that or you'll be buying heads. Blue Loctite. Done it 10k times."

Use ONLY this text. Cite page numbers.`,
              },
              {
                role: 'user',
                content: `${manualText}\\n\\nQUESTION: ${question}`,
              },
            ],
            max_tokens: 1500,
            temperature: 0.1,
          }),
        });

        const deepseekData = await deepseekResponse.json();
        console.log('📱 Client PDF success');
        return res.json({ answer: deepseekData.choices[0].message.content });
      }

      // 🔥 SERVER FALLBACK - FULL RUSTY (your exact code)
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You're Rusty, a grizzled 30-year master mechanic who's seen every engine failure possible. 
Talk like you're covered in grease, leaning over the hood with a ratchet in hand. Smell of Pennzoil and brake cleaner.

✅ EXTRACT from OEM manual FIRST - exact specs in **BOLD**:
**TORQUE: 25 ft-lb (34 N·m)**
**CAPACITY: 5.8 quarts** 
**OIL: 0W-20 synthetic**

✅ THEN mechanic wisdom:
- "That spec's straight from factory - don't overthink it"
- "Backyard mechanics always strip those bolts at 35..."
- "Dealership charges $200 for 5 minutes work" 
- "Your uncle's advice? Wrong. Manual's right."
- "Seen that fail 10,000 times - trust me"

✅ Personality: Gruff but helpful. Short sentences. Calls out BS. 
Mild swears when frustrated. Uses shop lingo: "torque wrench", "blue Loctite", "snap-on tools".

Example: "**TORQUE: 25 ft-lb (34 N·m)** - factory spec. Don't crank past that or you'll be buying heads. Blue Loctite. Done it 10k times."

Use ONLY this text. Cite page numbers.`,
            },
            {
              role: 'user',
              content: `${smartChunkText}\\n\\nQUESTION: ${question}`,
            },
          ],
          max_tokens: 1500,
          temperature: 0.1,
        }),
      });

      const deepseekData = await deepseekResponse.json();
      res.json({ answer: deepseekData.choices[0].message.content });
    } catch (error) {
      console.error('ERROR:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

// 🔥 FUNCTION 2: Stripe Checkout (FIXED)
exports.createCheckout = functions.https.onRequest({ cors: true }, async (req, res) => {
  try {
    const stripe = getStripe(); // ✅ SAFE - no cold start crash
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata: { firebase_uid: uid },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});
















