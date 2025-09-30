// lib/pdfToJson.js
const fs = require("fs");
const pdf = require("pdf-parse");
const { createWorker } = require("tesseract.js");
const sharp = require("sharp");
const tmp = require("tmp-promise");

/**
 * extractTextFromPdfBuffer
 *  - Try pdf-parse (fast & accurate for digital PDFs)
 *  - If extracted text is empty or too short => treat as scanned -> OCR per page
 *
 * Returns:
 *  { pages: [{pageNumber, text, ocrConfidence}], extractedFields: {...} }
 */
async function extractTextFromPdfBuffer(buffer) {
  // first try pdf-parse
  try {
    const data = await pdf(buffer, { max: 5 * 1024 * 1024 }); // limit
    const rawText = (data && data.text) ? data.text.trim() : "";

    if (rawText && rawText.length > 50) {
      // simple split into pages using delimiter if available; pdf-parse may provide text only.
      const pages = rawText.split(/\f/).map((t, i) => ({ pageNumber: i + 1, text: t.trim(), ocrConfidence: null }));
      const extractedFields = runHeuristicsOnText(rawText);
      return { pages, extractedFields, source: "pdf-parse" };
    }
  } catch (err) {
    // pdf-parse failed; fallback to OCR below
    console.warn("pdf-parse error:", err.message);
  }

  // Fallback: OCR each page. We'll convert PDF to images using sharp via temporary pdftoppm alternative
  // Implementation detail: many servers use `pdftoppm` for quality. Here we'll try a minimal approach:
  return await ocrPdfBuffer(buffer);
}

async function ocrPdfBuffer(buffer) {
  // Create a temp PDF file
  const { path: pdfPath, cleanup } = await tmp.file({ postfix: ".pdf" });
  await fs.promises.writeFile(pdfPath, buffer);

  // Convert first N pages to PNG using sharp (sharp can read PDF if libvips compiled with PDF support).
  // If your environment doesn't support PDF input to sharp, replace this with `pdftoppm` command-line conversion.
  const pages = [];
  try {
    // We'll attempt to read each page by using sharp with page option
    // Note: sharp supports pages with `sharp(input, { page: N })` if libvips supports it.
    // We'll try up to 20 pages by default.
    const maxPages = 20;
    const worker = await createWorker({ logger: m => { /* optional log */ } });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    for (let p = 0; p < maxPages; p++) {
      try {
        const imageBuffer = await sharp(pdfPath, { page: p })
          .png()
          .toBuffer();
        if (!imageBuffer || imageBuffer.length === 0) break;

        const { data: { text, confidence } } = await worker.recognize(imageBuffer);
        if (!text || text.trim().length === 0) {
          break;
        }
        pages.push({ pageNumber: p + 1, text: text.trim(), ocrConfidence: confidence || null });
      } catch (e) {
        // likely no more pages or conversion failed for this page
        break;
      }
    }

    await worker.terminate();
  } finally {
    await cleanup().catch(()=>{});
  }

  const fullText = pages.map(p => p.text).join("\n\n");
  const extractedFields = runHeuristicsOnText(fullText);
  return { pages, extractedFields, source: "ocr" };
}

/**
 * runHeuristicsOnText
 * Light-weight heuristics & regex-based extraction of key fields.
 * You should extend this with domain-specific patterns and normalization.
 */
function runHeuristicsOnText(text) {
  const out = {};

  // PAN regex (India) -- 5 letters, 4 digits, 1 letter
  const panMatch = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/);
  if (panMatch) out.panNumber = panMatch[1];

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
  if (emailMatch) out.email = emailMatch[0];

  // Phone (simple) - Indian style
  const phoneMatch = text.match(/(?:\+91[\-\s]?|0)?[6-9]\d{9}\b/);
  if (phoneMatch) out.phone = phoneMatch[0];

  // Dates (very permissive)
  const dateMatches = [...text.matchAll(/\b(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})\b/g)];
  if (dateMatches.length) out.documentDates = dateMatches.map(m => m[1]);

  // Address detection (naive): look for keywords
  const addrIdx = text.search(/address[:\s]|addr[:\s]|address\s\-/i);
  if (addrIdx !== -1) {
    out.address = text.slice(addrIdx, addrIdx + 400).split('\n').slice(0,5).join(' ');
  }

  // Organization name inference - look for "To" or uppercase headings, fallback to first line
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length) out.inferredTitle = lines[0].slice(0,120);

  // very simple signature detection
  out.signaturesDetected = /signature|signed|signatory|authentic/i.test(text);

  return out;
}

module.exports = {
  extractTextFromPdfBuffer
};
