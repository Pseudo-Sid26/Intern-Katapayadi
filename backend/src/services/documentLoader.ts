import { NCERTDocument, DocumentChunk, Subject } from '../types';
import config from '../config';
import { NCERTContentDatabase } from './ncertContentDatabase';
import * as fs from 'fs';
import * as path from 'path';

class DocumentLoaderService {
  chunkDocument(document: NCERTDocument): DocumentChunk[] {
    const { chunkSize, chunkOverlap } = config;
    const chunks: DocumentChunk[] = [];
    const words = document.content.split(/\s+/);
    let currentChunk: string[] = [];
    let chunkIndex = 0;

    for (let i = 0; i < words.length; i++) {
      currentChunk.push(words[i]);
      if (currentChunk.length >= chunkSize) {
        chunks.push(this.createChunk(document, currentChunk.join(' '), chunkIndex));
        chunkIndex++;
        currentChunk = currentChunk.slice(-chunkOverlap);
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(this.createChunk(document, currentChunk.join(' '), chunkIndex));
    }

    chunks.forEach(chunk => { chunk.metadata.totalChunks = chunks.length; });
    return chunks;
  }

  private createChunk(document: NCERTDocument, content: string, chunkIndex: number): DocumentChunk {
    return {
      id: `${document.id}_chunk_${chunkIndex}`,
      documentId: document.id,
      content,
      metadata: {
        subject: document.subject,
        class: document.class,
        chapter: document.chapter,
        chunkIndex,
        totalChunks: 0,
      },
    };
  }

  loadSampleDocuments(): NCERTDocument[] {
    const documents = NCERTContentDatabase.getAllDocuments();
    console.log('Loaded ' + documents.length + ' NCERT documents');
    return documents;
  }

  loadProcessedDocuments(): NCERTDocument[] {
    try {
      const processedDocsPath = path.join(__dirname, '../../data/processed-documents.json');
      if (fs.existsSync(processedDocsPath)) {
        const fileContent = fs.readFileSync(processedDocsPath, 'utf-8');
        const parsedData = JSON.parse(fileContent);
        
        // Check if it's wrapped in an object with 'documents' property
        const documents = Array.isArray(parsedData) ? parsedData : parsedData.documents;
        
        if (!Array.isArray(documents)) {
          console.error('Processed documents is not an array');
          return this.loadSampleDocuments();
        }
        
        console.log(`Loaded ${documents.length} processed NCERT documents from file`);
        return documents as NCERTDocument[];
      } else {
        console.warn('processed-documents.json not found, using sample documents');
        return this.loadSampleDocuments();
      }
    } catch (error) {
      console.error('Error loading processed documents:', error);
      console.warn('Falling back to sample documents');
      return this.loadSampleDocuments();
    }
  }

  loadDocumentsBySubject(subject: Subject): NCERTDocument[] {
    return NCERTContentDatabase.getDocumentsBySubject(subject);
  }

  loadDocumentsByClass(classNum: number): NCERTDocument[] {
    return NCERTContentDatabase.getDocumentsByClass(classNum);
  }
}

export const documentLoader = new DocumentLoaderService();
