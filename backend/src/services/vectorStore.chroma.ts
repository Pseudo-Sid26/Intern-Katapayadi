import { DocumentChunk, Subject, VectorStoreStats } from '../types';
import { embeddingService } from './embeddings';
import { chromaVectorStore } from './chromaVectorStore';

interface SearchOptions {
  topK?: number;
  subject?: Subject;
  class?: number;
  minScore?: number;
}

/**
 * Vector Store using ChromaDB
 * Replaces the in-memory vector store with persistent ChromaDB storage
 */
class ChromaVectorStoreWrapper {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('✅ Vector store already initialized');
      return;
    }

    await chromaVectorStore.initialize();
    this.initialized = true;
    console.log('✅ ChromaDB vector store ready');
  }

  async addChunk(chunk: DocumentChunk): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    let embedding: number[];
    if (!chunk.embedding) {
      embedding = await embeddingService.generateEmbedding(chunk.content);
    } else {
      embedding = chunk.embedding;
    }

    await chromaVectorStore.addVector(chunk.id, embedding, {
      ...chunk.metadata,
      content: chunk.content,
      documentId: chunk.documentId,
    });
  }

  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Generate embeddings for chunks that don't have them
    const chunksWithoutEmbeddings = chunks.filter(c => !c.embedding);
    
    if (chunksWithoutEmbeddings.length > 0) {
      console.log(`Generating embeddings for ${chunksWithoutEmbeddings.length} chunks...`);
      const texts = chunksWithoutEmbeddings.map(c => c.content);
      const embeddings = await embeddingService.generateBatchEmbeddings(texts);
      
      chunksWithoutEmbeddings.forEach((chunk, i) => {
        chunk.embedding = embeddings[i];
      });
    }

    // Add all chunks to ChromaDB in batch
    const entries = chunks.map(chunk => ({
      id: chunk.id,
      vector: chunk.embedding!,
      metadata: {
        ...chunk.metadata,
        content: chunk.content,
        documentId: chunk.documentId,
      },
    }));

    await chromaVectorStore.addVectorsBatch(entries);
    console.log(`✅ Added ${entries.length} chunks to ChromaDB`);
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<{ chunks: DocumentChunk[]; scores: number[] }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const { topK = 3, subject, class: classNum, minScore = 0.6 } = options;
    const startTime = Date.now();

    // Generate query embedding
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // Build filter for metadata
    const filter: any = {};
    if (subject) filter.subject = subject;
    if (classNum !== undefined) filter.class = classNum;

    // Search ChromaDB
    const results = await chromaVectorStore.similaritySearch(
      queryEmbedding,
      topK,
      Object.keys(filter).length > 0 ? filter : undefined
    );

    // Filter by minimum score and convert to DocumentChunk format
    const validResults = results.filter(r => r.score >= minScore);
    
    const chunks: DocumentChunk[] = validResults.map(result => ({
      id: result.id,
      documentId: result.metadata.documentId || '',
      content: result.metadata.content || '',
      metadata: {
        subject: result.metadata.subject,
        class: result.metadata.class,
        chapter: result.metadata.chapter,
        chunkIndex: result.metadata.chunkIndex,
        totalChunks: result.metadata.totalChunks,
      },
    }));

    const scores = validResults.map(r => r.score);

    const processingTime = Date.now() - startTime;
    console.log(`🔍 ChromaDB search completed in ${processingTime}ms, found ${chunks.length}/${results.length} results above threshold`);

    return { chunks, scores };
  }

  getStats(): VectorStoreStats {
    // Return basic stats - use getStatsAsync for full details
    return {
      totalChunks: 0,
      subjects: [],
      classes: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  async getStatsAsync(): Promise<VectorStoreStats & { collectionName: string }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const stats = await chromaVectorStore.getStatsAsync();
    return {
      totalChunks: stats.totalVectors,
      subjects: stats.subjects as Subject[],
      classes: stats.classes,
      lastUpdated: stats.lastUpdated,
      collectionName: stats.collectionName,
    };
  }

  async clear(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await chromaVectorStore.clear();
    console.log('✅ ChromaDB cleared');
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setInitialized(value: boolean): void {
    this.initialized = value;
  }

  /**
   * Health check for ChromaDB connection
   */
  async healthCheck(): Promise<boolean> {
    return await chromaVectorStore.healthCheck();
  }
}

export const vectorStore = new ChromaVectorStoreWrapper();
