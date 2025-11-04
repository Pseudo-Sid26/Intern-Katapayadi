import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import { NCERTDocument, Subject } from '../types';

/**
 * PDF Processor
 * Extracts text from NCERT PDFs and converts them into structured documents
 */

interface PDFProcessingResult {
  success: boolean;
  document?: NCERTDocument;
  error?: string;
  stats: {
    pages: number;
    textLength: number;
    processingTime: number;
  };
}

export class PDFProcessor {
  /**
   * Process a single PDF file
   */
  async processPDF(
    filePath: string,
    subject: Subject,
    classNum: number,
    chapter?: string
  ): Promise<PDFProcessingResult> {
    const startTime = Date.now();

    try {
      console.log(`📄 Processing PDF: ${path.basename(filePath)}`);

      // Read PDF file
      const dataBuffer = await fs.readFile(filePath);

      // Parse PDF
      const pdfData = await pdfParse(dataBuffer, {
        max: 0, // Process all pages
      });

      // Extract and clean text
      let text = pdfData.text;
      text = this.cleanText(text);

      // Split into chapters if possible
      const chapters = this.extractChapters(text);

      // Create document
      const document: NCERTDocument = {
        id: `${subject}_class${classNum}_${path.basename(filePath, '.pdf')}`,
        subject,
        class: classNum,
        chapter: chapter || 'Full Textbook',
        content: text,
        metadata: {
          filename: path.basename(filePath),
          pages: pdfData.numpages,
          processedAt: new Date().toISOString(),
          chapters: chapters.length,
        },
      };

      const processingTime = Date.now() - startTime;

      console.log(`   ✅ Processed successfully`);
      console.log(`   📊 Pages: ${pdfData.numpages}, Text length: ${text.length} chars`);
      console.log(`   ⏱️ Time: ${processingTime}ms`);

      return {
        success: true,
        document,
        stats: {
          pages: pdfData.numpages,
          textLength: text.length,
          processingTime,
        },
      };
    } catch (error) {
      console.error(`   ❌ Error processing PDF:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stats: {
          pages: 0,
          textLength: 0,
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Process multiple PDFs
   */
  async processMultiplePDFs(
    files: Array<{ filePath: string; subject: Subject; class: number }>
  ): Promise<NCERTDocument[]> {
    const documents: NCERTDocument[] = [];

    console.log(`\n📚 Processing ${files.length} PDF files...\n`);

    for (const file of files) {
      const result = await this.processPDF(file.filePath, file.subject, file.class);
      if (result.success && result.document) {
        documents.push(result.document);
      }
    }

    console.log(`\n✅ Processed ${documents.length}/${files.length} PDFs successfully\n`);
    return documents;
  }

  /**
   * Process all PDFs in a directory
   */
  async processDirectory(
    dirPath: string,
    defaultSubject: Subject,
    defaultClass: number
  ): Promise<NCERTDocument[]> {
    try {
      const files = await fs.readdir(dirPath);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));

      console.log(`📁 Found ${pdfFiles.length} PDF files in ${dirPath}`);

      const filesToProcess = pdfFiles.map(file => ({
        filePath: path.join(dirPath, file),
        subject: this.inferSubjectFromFilename(file) || defaultSubject,
        class: this.inferClassFromFilename(file) || defaultClass,
      }));

      return this.processMultiplePDFs(filesToProcess);
    } catch (error) {
      console.error('Error processing directory:', error);
      return [];
    }
  }

  /**
   * Clean extracted text
   */
  private cleanText(text: string): string {
    // Remove excessive whitespace
    text = text.replace(/\s+/g, ' ');

    // Remove page numbers (patterns like "Page 1", "1", etc.)
    text = text.replace(/\bPage\s+\d+\b/gi, '');
    text = text.replace(/^\d+$/gm, '');

    // Remove headers/footers (common patterns)
    text = text.replace(/NCERT|©.*?(?=\n)/gi, '');

    // Remove special characters but keep basic punctuation
    text = text.replace(/[^\w\s.,;:!?()[\]{}"'-]/g, ' ');

    // Fix multiple spaces
    text = text.replace(/\s+/g, ' ');

    // Trim
    text = text.trim();

    return text;
  }

  /**
   * Extract chapters from text (basic implementation)
   */
  private extractChapters(text: string): string[] {
    const chapters: string[] = [];

    // Look for chapter markers (e.g., "Chapter 1", "CHAPTER 1", etc.)
    const chapterRegex = /(?:^|\n)(?:Chapter|CHAPTER)\s+(\d+)[:\s]+([^\n]+)/gi;
    let match;

    while ((match = chapterRegex.exec(text)) !== null) {
      chapters.push(`Chapter ${match[1]}: ${match[2]}`);
    }

    return chapters;
  }

  /**
   * Infer subject from filename
   */
  private inferSubjectFromFilename(filename: string): Subject | null {
    const lower = filename.toLowerCase();

    if (lower.includes('math')) return 'maths';
    if (lower.includes('science')) return 'science';
    if (lower.includes('history')) return 'history';
    if (lower.includes('geography') || lower.includes('geo')) return 'geography';
    if (lower.includes('english')) return 'english';

    return null;
  }

  /**
   * Infer class number from filename
   */
  private inferClassFromFilename(filename: string): number | null {
    const match = filename.match(/class[_-]?(\d+)/i);
    if (match) {
      return parseInt(match[1]);
    }

    // Try to find standalone number
    const numMatch = filename.match(/\b(\d{1,2})\b/);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      if (num >= 1 && num <= 12) {
        return num;
      }
    }

    return null;
  }

  /**
   * Split large document into smaller documents by chapter
   */
  async splitByChapters(document: NCERTDocument): Promise<NCERTDocument[]> {
    const chapters = this.extractChapters(document.content);
    
    if (chapters.length === 0) {
      return [document]; // Return as-is if no chapters found
    }

    const documents: NCERTDocument[] = [];

    // Split content by chapters
    const chapterRegex = /(?:^|\n)(?:Chapter|CHAPTER)\s+\d+[:\s]+[^\n]+/gi;
    const parts = document.content.split(chapterRegex);

    for (let i = 0; i < chapters.length; i++) {
      if (parts[i + 1]) { // Skip first part (before first chapter)
        documents.push({
          ...document,
          id: `${document.id}_chapter${i + 1}`,
          chapter: chapters[i],
          content: parts[i + 1].trim(),
        });
      }
    }

    console.log(`   📑 Split into ${documents.length} chapter documents`);
    return documents;
  }

  /**
   * Save processed documents to JSON
   */
  async saveToJSON(documents: NCERTDocument[], outputPath: string): Promise<void> {
    try {
      const data = {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        count: documents.length,
        documents,
      };

      await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
      console.log(`✅ Saved ${documents.length} documents to ${outputPath}`);
    } catch (error) {
      console.error('Error saving to JSON:', error);
      throw error;
    }
  }

  /**
   * Load documents from JSON
   */
  async loadFromJSON(inputPath: string): Promise<NCERTDocument[]> {
    try {
      const fileContent = await fs.readFile(inputPath, 'utf-8');
      const data = JSON.parse(fileContent);
      console.log(`✅ Loaded ${data.documents.length} documents from ${inputPath}`);
      return data.documents;
    } catch (error) {
      console.error('Error loading from JSON:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const pdfProcessor = new PDFProcessor();
