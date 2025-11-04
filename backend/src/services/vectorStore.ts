import { DocumentChunk, Subject, VectorStoreStats } from '../types';
import { embeddingService } from './embeddings';
import * as fs from 'fs';
import * as path from 'path';

interface SearchOptions {
  topK?: number;
  subject?: Subject;
  class?: number;
  minScore?: number;
}

interface EmbeddingCache {
  version: string;
  timestamp: string;
  chunks: Array<{
    id: string;
    content: string;
    embedding: number[];
    metadata: any;
  }>;
}

class VectorStore {
  private chunks: Map<string, DocumentChunk> = new Map();
  private initialized = false;
  private cacheFilePath = path.join(__dirname, '../../data/embeddings-cache.json');

  async addChunk(chunk: DocumentChunk): Promise<void> {
    if (!chunk.embedding) {
      chunk.embedding = await embeddingService.generateEmbedding(chunk.content);
    }
    this.chunks.set(chunk.id, chunk);
  }

  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    // Try to load from cache first
    const cachedChunks = this.loadEmbeddingsFromCache();
    
    if (cachedChunks && cachedChunks.length === chunks.length) {
      console.log(`✅ Loaded ${cachedChunks.length} embeddings from cache`);
      
      // Match cached embeddings to current chunks by ID
      const embeddingMap = new Map(cachedChunks.map(c => [c.id, c.embedding]));
      
      chunks.forEach(chunk => {
        const cachedEmbedding = embeddingMap.get(chunk.id);
        if (cachedEmbedding) {
          chunk.embedding = cachedEmbedding;
        }
      });
      
      // Check if all chunks have embeddings
      const missingEmbeddings = chunks.filter(c => !c.embedding);
      
      if (missingEmbeddings.length === 0) {
        console.log('✅ All embeddings loaded from cache successfully');
        chunks.forEach(chunk => {
          this.chunks.set(chunk.id, chunk);
        });
        return;
      } else {
        console.log(`⚠️  ${missingEmbeddings.length} chunks missing embeddings, regenerating all...`);
      }
    } else {
      console.log('📝 No valid cache found, generating embeddings...');
    }
    
    // Generate new embeddings
    const chunksWithoutEmbeddings = chunks.filter(c => !c.embedding);
    
    if (chunksWithoutEmbeddings.length > 0) {
      const texts = chunksWithoutEmbeddings.map(c => c.content);
      const embeddings = await embeddingService.generateBatchEmbeddings(texts);
      
      chunksWithoutEmbeddings.forEach((chunk, i) => {
        chunk.embedding = embeddings[i];
      });
    }

    chunks.forEach(chunk => {
      this.chunks.set(chunk.id, chunk);
    });
    
    // Save embeddings to cache
    this.saveEmbeddingsToCache(chunks);
  }

  private loadEmbeddingsFromCache(): Array<{ id: string; embedding: number[] }> | null {
    try {
      if (!fs.existsSync(this.cacheFilePath)) {
        return null;
      }

      const data = fs.readFileSync(this.cacheFilePath, 'utf-8');
      const cache: EmbeddingCache = JSON.parse(data);
      
      console.log(`📂 Found embedding cache from ${cache.timestamp} (${cache.chunks.length} chunks)`);
      
      return cache.chunks.map(c => ({ id: c.id, embedding: c.embedding }));
    } catch (error) {
      console.error('Error loading embeddings from cache:', error);
      return null;
    }
  }

  private saveEmbeddingsToCache(chunks: DocumentChunk[]): void {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const cache: EmbeddingCache = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        chunks: chunks.map(c => ({
          id: c.id,
          content: c.content,
          embedding: c.embedding || [],
          metadata: c.metadata,
        })),
      };

      fs.writeFileSync(this.cacheFilePath, JSON.stringify(cache, null, 2));
      console.log(`💾 Saved ${chunks.length} embeddings to cache`);
    } catch (error) {
      console.error('Error saving embeddings to cache:', error);
    }
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<{ chunks: DocumentChunk[]; scores: number[] }> {
    const { topK = 3, subject, class: classNum, minScore = 0.6 } = options;
    const startTime = Date.now();

    // Generate query embedding
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // Filter and score chunks
    let results: Array<{ chunk: DocumentChunk; score: number }> = [];

    for (const chunk of this.chunks.values()) {
      // Apply filters
      if (subject && chunk.metadata.subject !== subject) continue;
      if (classNum && chunk.metadata.class !== classNum) continue;
      if (!chunk.embedding) continue;

      // Calculate similarity
      const score = embeddingService.cosineSimilarity(queryEmbedding, chunk.embedding);
      
      if (score >= minScore) {
        results.push({ chunk, score });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Take top K
    results = results.slice(0, topK);

    const processingTime = Date.now() - startTime;
    console.log(`Vector search completed in ${processingTime}ms, found ${results.length} results`);

    return {
      chunks: results.map(r => r.chunk),
      scores: results.map(r => r.score),
    };
  }

  getStats(): VectorStoreStats {
    const subjects = new Set<Subject>();
    const classes = new Set<number>();

    for (const chunk of this.chunks.values()) {
      subjects.add(chunk.metadata.subject);
      classes.add(chunk.metadata.class);
    }

    return {
      totalChunks: this.chunks.size,
      subjects: Array.from(subjects),
      classes: Array.from(classes).sort((a, b) => a - b),
      lastUpdated: new Date().toISOString(),
    };
  }

  clear(): void {
    this.chunks.clear();
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setInitialized(value: boolean): void {
    this.initialized = value;
  }
}

export const vectorStore = new VectorStore();
