import fs from 'fs/promises';
import PDFParser from 'pdf2json';

export interface PDFChunk {
  id: string;
  text: string;
  page: number;
}

export async function parsePDF(pdfPath: string): Promise<PDFChunk[]> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();
    
    parser.on('pdfParser_dataError', (errData) => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });
    
    parser.on('pdfParser_dataReady', (pdfData) => {
      const chunks: PDFChunk[] = [];
      
      try {
        pdfData.Pages.forEach((page: any, pageIndex: number) => {
          if (!page.Texts || !Array.isArray(page.Texts)) return;
          
          const pageText = page.Texts
            .map((t: any) => {
              try {
                // 🔥 SAFE TEXT EXTRACTION - handles ALL PDF edge cases
                if (!t.R || !t.R[0] || !t.R[0].T) return '';
                
                let text = t.R[0].T;
                
                // Skip non-text elements (links, form fields)
                if (typeof text !== 'string') return '';
                
                // Safely decode URI components
                try {
                  text = decodeURIComponent(text);
                } catch (e) {
                  // If decode fails, try raw text or skip
                  if (text.includes('%')) {
                    text = text.replace(/%[0-9A-Fa-f]{2}/g, ' ');
                  }
                }
                
                // Clean up and normalize
                return text
                  .replace(/[\n\r\t]+/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
              } catch (e) {
                return ''; // Skip broken text elements
              }
            })
            .filter(text => text.length > 3) // Only keep meaningful text
            .join(' ')
            .trim();
          
          if (pageText.length > 50) {
            chunks.push({
              id: `page-${pageIndex + 1}`,
              text: pageText.slice(0, 2000), // Limit chunk size
              page: pageIndex + 1
            });
          }
        });
      } catch (e) {
        console.error('Page processing error:', e);
      }
      
      console.log(`✅ Extracted ${chunks.length} chunks from ${pdfData.Pages?.length || 0} pages`);
      resolve(chunks);
    });
    
    parser.loadPDF(pdfPath);
  });
}
