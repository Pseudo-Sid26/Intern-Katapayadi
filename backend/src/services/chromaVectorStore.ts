import { ChromaClient, Collection } from 'chromadb';
import { VectorStore, VectorEntry } from '../types';
import { embeddingService } from './embeddings';

/**
 * Custom embedding function for ChromaDB
 * Tells ChromaDB that we handle embeddings externally
 */
class ExternalEmbeddingFunction {
  async generate(texts: string[]): Promise<number[][]> {
    // This should never be called since we provide embeddings directly
    throw new Error('Embeddings are provided externally');
  }
}

/**
 * ChromaDB Vector Store
 * Production-ready vector database for storing and querying embeddings
 */
export class ChromaVectorStore implements VectorStore {
  private client: ChromaClient;
  private collection: Collection | null = null;
  private collectionName: string;
  private isInitialized: boolean = false;

  constructor(collectionName: string = 'ncert_documents') {
    this.client = new ChromaClient();
    this.collectionName = collectionName;
  }

  /**
   * Initialize ChromaDB collection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ ChromaDB already initialized');
      return;
    }

    try {
      // Try to get existing collection
      // We set embeddingFunction to our custom class since we handle embeddings ourselves
      this.collection = await this.client.getOrCreateCollection({
        name: this.collectionName,
        metadata: { description: 'NCERT textbook embeddings' },
        embeddingFunction: new ExternalEmbeddingFunction(),
      });

      const count = await this.collection.count();
      console.log(`✅ ChromaDB initialized: collection "${this.collectionName}" with ${count} vectors`);
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Error initializing ChromaDB:', error);
      throw error;
    }
  }

  /**
   * Add a single vector with metadata
   */
  async addVector(id: string, vector: number[], metadata: any): Promise<void> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      await this.collection.add({
        ids: [id],
        embeddings: [vector],
        metadatas: [metadata],
        documents: [metadata.content || ''], // Store original text for reference
      });
    } catch (error) {
      console.error(`❌ Error adding vector ${id}:`, error);
      throw error;
    }
  }

  /**
   * Add multiple vectors in batch (more efficient)
   */
  async addVectorsBatch(entries: Array<{ id: string; vector: number[]; metadata: any }>): Promise<void> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    if (entries.length === 0) return;

    try {
      const ids = entries.map(e => e.id);
      const embeddings = entries.map(e => e.vector);
      const metadatas = entries.map(e => e.metadata);
      const documents = entries.map(e => e.metadata.content || '');

      await this.collection.add({
        ids,
        embeddings,
        metadatas,
        documents,
      });

      console.log(`✅ Added ${entries.length} vectors to ChromaDB`);
    } catch (error) {
      console.error('❌ Error adding batch vectors:', error);
      throw error;
    }
  }

  /**
   * Get a specific vector by ID
   */
  async getVector(id: string): Promise<VectorEntry | null> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      const result = await this.collection.get({ ids: [id] });
      
      if (!result.ids || result.ids.length === 0) {
        return null;
      }

      return {
        id: result.ids[0] as string,
        vector: result.embeddings?.[0] as number[] || [],
        metadata: result.metadatas?.[0] || {},
      };
    } catch (error) {
      console.error(`❌ Error getting vector ${id}:`, error);
      return null;
    }
  }

  /**
   * Search for similar vectors
   */
  async similaritySearch(
    queryEmbedding: number[],
    k: number = 5,
    filter?: any
  ): Promise<Array<{ id: string; score: number; metadata: any }>> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      const results = await this.collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: k,
        where: filter, // ChromaDB supports metadata filtering
      });

      if (!results.ids[0] || results.ids[0].length === 0) {
        return [];
      }

      // Transform results to our format
      const similarVectors = results.ids[0].map((id, index) => ({
        id: id as string,
        score: 1 - (results.distances?.[0]?.[index] || 0), // Convert distance to similarity
        metadata: results.metadatas?.[0]?.[index] || {},
      }));

      return similarVectors;
    } catch (error) {
      console.error('❌ Error searching vectors:', error);
      throw error;
    }
  }

  /**
   * Get total number of vectors
   */
  async count(): Promise<number> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      return await this.collection.count();
    } catch (error) {
      console.error('❌ Error getting count:', error);
      return 0;
    }
  }

  /**
   * Get statistics about stored vectors
   */
  getStats(): {
    totalVectors: number;
    subjects: string[];
    classes: number[];
    lastUpdated: string;
  } {
    // Return cached stats - use getStatsAsync for fresh data
    return {
      totalVectors: 0,
      subjects: [],
      classes: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get fresh statistics (async version)
   */
  async getStatsAsync(): Promise<{
    totalVectors: number;
    subjects: string[];
    classes: number[];
    collectionName: string;
    lastUpdated: string;
  }> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      const count = await this.collection.count();

      // Get all unique subjects and classes by querying with high limit
      const results = await this.collection.get({
        limit: count > 0 ? count : 1,
      });

      const subjects = new Set<string>();
      const classes = new Set<number>();

      if (results.metadatas) {
        results.metadatas.forEach((metadata: any) => {
          if (metadata.subject) subjects.add(metadata.subject);
          if (metadata.class) classes.add(metadata.class);
        });
      }

      return {
        totalVectors: count,
        subjects: Array.from(subjects),
        classes: Array.from(classes).sort((a, b) => a - b),
        collectionName: this.collectionName,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      return {
        totalVectors: 0,
        subjects: [],
        classes: [],
        collectionName: this.collectionName,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Clear all vectors from collection
   */
  async clear(): Promise<void> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      await this.client.deleteCollection({ name: this.collectionName });
      this.collection = await this.client.createCollection({
        name: this.collectionName,
        metadata: { description: 'NCERT textbook embeddings' },
        embeddingFunction: new ExternalEmbeddingFunction(),
      });
      console.log(`✅ Cleared ChromaDB collection: ${this.collectionName}`);
    } catch (error) {
      console.error('❌ Error clearing collection:', error);
      throw error;
    }
  }

  /**
   * Delete specific vectors by IDs
   */
  async deleteVectors(ids: string[]): Promise<void> {
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    try {
      await this.collection.delete({ ids });
      console.log(`✅ Deleted ${ids.length} vectors from ChromaDB`);
    } catch (error) {
      console.error('❌ Error deleting vectors:', error);
      throw error;
    }
  }

  /**
   * Search by text query (generates embedding automatically)
   */
  async searchByText(
    query: string,
    k: number = 5,
    filter?: any
  ): Promise<Array<{ id: string; score: number; metadata: any; content: string }>> {
    // Generate embedding for the query
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // Perform similarity search
    const results = await this.similaritySearch(queryEmbedding, k, filter);

    // Get the actual documents
    if (!this.collection) {
      throw new Error('ChromaDB not initialized. Call initialize() first.');
    }

    const ids = results.map(r => r.id);
    const documents = await this.collection.get({ ids });

    // Combine results with document content
    return results.map((result, index) => ({
      ...result,
      content: documents.documents?.[index] as string || '',
    }));
  }

  /**
   * Check if ChromaDB server is running
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.heartbeat();
      return true;
    } catch (error) {
      console.error('❌ ChromaDB health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const chromaVectorStore = new ChromaVectorStore('ncert_documents');
