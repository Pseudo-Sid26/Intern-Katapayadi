// Simple Vector Store (In-Memory)
// For production, consider using Pinecone, Chroma, or similar

import { DocumentChunk, RAGQueryResult } from './types';
import { embeddingService } from './embeddings';

class VectorStore {
  private chunks: DocumentChunk[] = [];

  /**
   * Add document chunks to the store
   */
  async addChunks(chunks: DocumentChunk[]): Promise<void> {
    // Generate embeddings for chunks that don't have them
    const chunksWithoutEmbeddings = chunks.filter(chunk => !chunk.embedding);
    
    if (chunksWithoutEmbeddings.length > 0) {
      const texts = chunksWithoutEmbeddings.map(chunk => chunk.content);
      const embeddings = await embeddingService.generateEmbeddings(texts);
      
      chunksWithoutEmbeddings.forEach((chunk, index) => {
        chunk.embedding = embeddings[index];
      });
    }

    this.chunks.push(...chunks);
    console.log(`Added ${chunks.length} chunks to vector store. Total: ${this.chunks.length}`);
  }

  /**
   * Search for relevant chunks using semantic similarity
   */
  async search(
    query: string,
    options: {
      topK?: number;
      subject?: string;
      class?: number;
      minScore?: number;
    } = {}
  ): Promise<RAGQueryResult> {
    const {
      topK = 5,
      subject,
      class: classFilter,
      minScore = 0.5,
    } = options;

    // Generate query embedding
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // Filter chunks based on metadata
    let filteredChunks = this.chunks;
    
    if (subject) {
      filteredChunks = filteredChunks.filter(
        chunk => chunk.metadata.subject === subject
      );
    }
    
    if (classFilter) {
      filteredChunks = filteredChunks.filter(
        chunk => chunk.metadata.class === classFilter
      );
    }

    // Calculate similarity scores
    const results = filteredChunks
      .map(chunk => ({
        chunk,
        score: chunk.embedding
          ? embeddingService.cosineSimilarity(queryEmbedding, chunk.embedding)
          : 0,
      }))
      .filter(result => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return {
      chunks: results.map(r => r.chunk),
      relevanceScores: results.map(r => r.score),
    };
  }

  /**
   * Get all chunks for a specific subject and class
   */
  getChunksBySubjectAndClass(subject: string, classNum: number): DocumentChunk[] {
    return this.chunks.filter(
      chunk =>
        chunk.metadata.subject === subject &&
        chunk.metadata.class === classNum
    );
  }

  /**
   * Clear all chunks
   */
  clear(): void {
    this.chunks = [];
  }

  /**
   * Get store statistics
   */
  getStats() {
    const subjects = new Set(this.chunks.map(c => c.metadata.subject));
    const classes = new Set(this.chunks.map(c => c.metadata.class));
    
    return {
      totalChunks: this.chunks.length,
      subjects: Array.from(subjects),
      classes: Array.from(classes).sort(),
    };
  }

  /**
   * Save to localStorage (for persistence)
   */
  save(): void {
    try {
      const data = JSON.stringify(this.chunks);
      localStorage.setItem('ncert_vector_store', data);
      console.log('Vector store saved to localStorage');
    } catch (error) {
      console.error('Error saving vector store:', error);
    }
  }

  /**
   * Load from localStorage
   */
  load(): void {
    try {
      const data = localStorage.getItem('ncert_vector_store');
      if (data) {
        this.chunks = JSON.parse(data);
        console.log(`Loaded ${this.chunks.length} chunks from localStorage`);
      }
    } catch (error) {
      console.error('Error loading vector store:', error);
    }
  }
}

export const vectorStore = new VectorStore();
