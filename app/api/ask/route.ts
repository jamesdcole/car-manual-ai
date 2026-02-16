import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { filename, question } = await req.json();
    
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ 
        error: 'DeepSeek API key missing from .env.local',
        answer: 'Mock: Add DEEPSEEK_API_KEY to .env.local'
      }, { status: 500 });
    }

    // Mock PDF content (real parsing next)
    const pdfContent = `Car manual: ${filename} loaded (20MB)`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are Perplexity AI - a conversational research assistant. User uploaded document: "${filename}". 

**INSTRUCTIONS:**
- Answer "${question}" using ONLY this document's content
- Write naturally like a human expert explaining clearly
- Use bullet points for lists and key facts
- Bold important terms like **SAE 5W-30** or **WSS-M2C946-B1**
- Add helpful notes like "Important:", "Capacity:", "Note:"
- Be precise, concise, and actionable
- Sound confident but approachable`
          },
          {
            role: 'user', 
            content: `${question}\n\nDocument: ${pdfContent}`
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    });

    // DEBUG: Log full response
    const result = await response.json();
    console.log('DeepSeek response:', JSON.stringify(result, null, 2));

    // Safe parsing (handles all error cases)
    if (!result.choices || !Array.isArray(result.choices) || result.choices.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid DeepSeek response',
        answer: `Debug: ${JSON.stringify(result)}`,
        debug: result
      }, { status: 500 });
    }

    const answer = result.choices[0].message?.content || 'No answer generated';

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Ask error:', error);
    return NextResponse.json({ 
      error: error.message || 'Ask failed',
      answer: 'Mock: DeepSeek offline - check oil every 5k miles'
    }, { status: 500 });
  }
}





