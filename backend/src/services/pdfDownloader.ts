import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { Subject } from '../types';

/**
 * NCERT PDF Downloader
 * Downloads official NCERT textbooks from NCERT website
 */

interface NCERTBook {
  subject: Subject;
  class: number;
  title: string;
  url: string;
  filename: string;
}

export class NCERTPDFDownloader {
  private downloadDir: string;
  private baseUrl: string = 'https://ncert.nic.in/textbook.php';

  constructor(downloadDir: string = './data/ncert-pdfs') {
    this.downloadDir = downloadDir;
  }

  /**
   * Initialize download directory
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.downloadDir, { recursive: true });
    console.log(`✅ PDF download directory initialized: ${this.downloadDir}`);
  }

  /**
   * Get list of available NCERT books
   * URLs from official NCERT website: https://ncert.nic.in/textbook.php
   */
  getAvailableBooks(): NCERTBook[] {
    return [
      // Class 6 Mathematics
      {
        subject: 'maths',
        class: 6,
        title: 'Mathematics Class 6',
        url: 'https://ncert.nic.in/textbook/pdf/femh1dd.zip',
        filename: 'class6_maths.pdf',
      },
      // Class 6 Science
      {
        subject: 'science',
        class: 6,
        title: 'Science Class 6',
        url: 'https://ncert.nic.in/textbook/pdf/fesc1dd.zip',
        filename: 'class6_science.pdf',
      },
      // Class 6 Social Science - History
      {
        subject: 'history',
        class: 6,
        title: 'Our Past - History Class 6',
        url: 'https://ncert.nic.in/textbook/pdf/fess1dd.zip',
        filename: 'class6_history.pdf',
      },
      // Class 7 Mathematics
      {
        subject: 'maths',
        class: 7,
        title: 'Mathematics Class 7',
        url: 'https://ncert.nic.in/textbook/pdf/gemh1dd.zip',
        filename: 'class7_maths.pdf',
      },
      // Class 7 Science
      {
        subject: 'science',
        class: 7,
        title: 'Science Class 7',
        url: 'https://ncert.nic.in/textbook/pdf/gesc1dd.zip',
        filename: 'class7_science.pdf',
      },
      // Class 8 Mathematics
      {
        subject: 'maths',
        class: 8,
        title: 'Mathematics Class 8',
        url: 'https://ncert.nic.in/textbook/pdf/hemh1dd.zip',
        filename: 'class8_maths.pdf',
      },
      // Class 8 Science
      {
        subject: 'science',
        class: 8,
        title: 'Science Class 8',
        url: 'https://ncert.nic.in/textbook/pdf/hesc1dd.zip',
        filename: 'class8_science.pdf',
      },
      // Class 9 Mathematics
      {
        subject: 'maths',
        class: 9,
        title: 'Mathematics Class 9',
        url: 'https://ncert.nic.in/textbook/pdf/iemh1dd.zip',
        filename: 'class9_maths.pdf',
      },
      // Class 9 Science
      {
        subject: 'science',
        class: 9,
        title: 'Science Class 9',
        url: 'https://ncert.nic.in/textbook/pdf/iesc1dd.zip',
        filename: 'class9_science.pdf',
      },
      // Class 9 History
      {
        subject: 'history',
        class: 9,
        title: 'India and the Contemporary World - History Class 9',
        url: 'https://ncert.nic.in/textbook/pdf/iess1dd.zip',
        filename: 'class9_history.pdf',
      },
      // Class 10 Mathematics
      {
        subject: 'maths',
        class: 10,
        title: 'Mathematics Class 10',
        url: 'https://ncert.nic.in/textbook/pdf/jemh1dd.zip',
        filename: 'class10_maths.pdf',
      },
      // Class 10 Science
      {
        subject: 'science',
        class: 10,
        title: 'Science Class 10',
        url: 'https://ncert.nic.in/textbook/pdf/jesc1dd.zip',
        filename: 'class10_science.pdf',
      },
    ];
  }

  /**
   * Download a single PDF
   */
  async downloadPDF(book: NCERTBook): Promise<string> {
    const filePath = path.join(this.downloadDir, book.filename);

    try {
      // Check if file already exists
      try {
        await fs.access(filePath);
        console.log(`✅ PDF already exists: ${book.filename}`);
        return filePath;
      } catch {
        // File doesn't exist, proceed with download
      }

      console.log(`📥 Downloading: ${book.title}...`);
      console.log(`   URL: ${book.url}`);

      const response = await axios.get(book.url, {
        responseType: 'arraybuffer',
        timeout: 120000, // 2 minutes timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // Check if it's a ZIP file (NCERT often provides ZIPs)
      if (book.url.endsWith('.zip')) {
        console.log(`   ⚠️ File is ZIP format, needs extraction`);
        const zipPath = path.join(this.downloadDir, `${book.filename}.zip`);
        await fs.writeFile(zipPath, Buffer.from(response.data));
        console.log(`   📦 Saved ZIP to: ${zipPath}`);
        console.log(`   ℹ️ Please extract manually and rename PDF to: ${book.filename}`);
        return zipPath;
      }

      // Save PDF
      await fs.writeFile(filePath, Buffer.from(response.data));
      console.log(`   ✅ Downloaded successfully: ${book.filename}`);
      
      return filePath;
    } catch (error) {
      console.error(`   ❌ Error downloading ${book.title}:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Download multiple PDFs
   */
  async downloadMultiplePDFs(books: NCERTBook[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    console.log(`\n📚 Starting download of ${books.length} NCERT books...\n`);

    for (const book of books) {
      try {
        const filePath = await this.downloadPDF(book);
        results.set(book.filename, filePath);
        
        // Small delay between downloads to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to download ${book.title}`);
      }
    }

    console.log(`\n✅ Download complete! ${results.size}/${books.length} books downloaded\n`);
    return results;
  }

  /**
   * Download all available books for a specific class
   */
  async downloadByClass(classNum: number): Promise<Map<string, string>> {
    const books = this.getAvailableBooks().filter(book => book.class === classNum);
    return this.downloadMultiplePDFs(books);
  }

  /**
   * Download all available books for a specific subject
   */
  async downloadBySubject(subject: Subject): Promise<Map<string, string>> {
    const books = this.getAvailableBooks().filter(book => book.subject === subject);
    return this.downloadMultiplePDFs(books);
  }

  /**
   * Download all available books
   */
  async downloadAll(): Promise<Map<string, string>> {
    const books = this.getAvailableBooks();
    return this.downloadMultiplePDFs(books);
  }

  /**
   * List downloaded PDFs
   */
  async listDownloadedPDFs(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.downloadDir);
      return files.filter(file => file.endsWith('.pdf'));
    } catch (error) {
      console.error('Error listing PDFs:', error);
      return [];
    }
  }

  /**
   * Get download statistics
   */
  async getStats(): Promise<{
    totalAvailable: number;
    totalDownloaded: number;
    downloadedFiles: string[];
  }> {
    const available = this.getAvailableBooks();
    const downloaded = await this.listDownloadedPDFs();

    return {
      totalAvailable: available.length,
      totalDownloaded: downloaded.length,
      downloadedFiles: downloaded,
    };
  }
}

// Export singleton instance
export const ncertPDFDownloader = new NCERTPDFDownloader();
