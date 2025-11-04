import fs from 'fs/promises';
import path from 'path';
import { VectorStore, VectorEntry } from '../types';

/**
 * File-based persistent vector store
 * Stores vectors and metadata in JSON files for persistence across restarts
 */

export class PersistentVectorStore implements VectorStore {
  private vectors: Map<string, VectorEntry> = new Map();
  private storagePath: string;
  private isInitialized: boolean = false;

  constructor(storagePath: string = './data/vectors') {
    this.storagePath = storagePath;
  }

  /**
   * Initialize the vector store and load existing vectors from disk
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create storage directory if it doesn't exist
      await fs.mkdir(this.storagePath, { recursive: true });

      // Load existing vectors
      await this.loadFromDisk();
      
      this.isInitialized = true;
      console.log(`✅ Persistent vector store initialized with ${this.vectors.size} vectors`);
    } catch (error) {
      console.error('Error initializing persistent vector store:', error);
      throw error;
    }
  }

  /**
   * Add or update a vector in the store
   */
  async addVector(id: string, vector: number[], metadata: any): Promise<void> {
    this.vectors.set(id, { id, vector, metadata });
    
    // Auto-save after adding (optional - can be batched for performance)
    await this.saveToDisk();
  }

  /**
   * Add multiple vectors in batch (more efficient)
   */
  async addVectorsBatch(entries: Array<{ id: string; vector: number[]; metadata: any }>): Promise<void> {
    for (const entry of entries) {
      this.vectors.set(entry.id, entry);
    }
    
    await this.saveToDisk();
    console.log(`✅ Added ${entries.length} vectors to store`);
  }

  /**
   * Get a vector by ID
   */
  async getVector(id: string): Promise<VectorEntry | null> {
    return this.vectors.get(id) || null;
  }

  /**
   * Search for similar vectors using cosine similarity
   */
  async similaritySearch(
    queryVector: number[],
    topK: number = 5,
    filter?: (metadata: any) => boolean
  ): Promise<Array<{ id: string; score: number; metadata: any }>> {
    const startTime = Date.now();
    const results: Array<{ id: string; score: number; metadata: any }> = [];

    // Calculate similarity with all vectors
    for (const [id, entry] of this.vectors.entries()) {
      // Apply filter if provided
      if (filter && !filter(entry.metadata)) {
        continue;
      }

      const similarity = this.cosineSimilarity(queryVector, entry.vector);
      results.push({
        id,
        score: similarity,
        metadata: entry.metadata,
      });
    }

    // Sort by similarity (descending) and take top K
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, topK);

    const duration = Date.now() - startTime;
    console.log(`Vector search completed in ${duration}ms, found ${topResults.length} results`);

    return topResults;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have same dimensions');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Get statistics about the vector store
   */
  getStats(): {
    totalVectors: number;
    subjects: string[];
    classes: number[];
    lastUpdated: string;
  } {
    const subjects = new Set<string>();
    const classes = new Set<number>();

    for (const entry of this.vectors.values()) {
      if (entry.metadata.subject) subjects.add(entry.metadata.subject);
      if (entry.metadata.class) classes.add(entry.metadata.class);
    }

    return {
      totalVectors: this.vectors.size,
      subjects: Array.from(subjects).sort(),
      classes: Array.from(classes).sort((a, b) => a - b),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Clear all vectors from the store
   */
  async clear(): Promise<void> {
    this.vectors.clear();
    await this.saveToDisk();
    console.log('✅ Vector store cleared');
  }

  /**
   * Delete a vector by ID
   */
  async deleteVector(id: string): Promise<boolean> {
    const existed = this.vectors.delete(id);
    if (existed) {
      await this.saveToDisk();
    }
    return existed;
  }

  /**
   * Save vectors to disk
   */
  private async saveToDisk(): Promise<void> {
    try {
      const filePath = path.join(this.storagePath, 'vectors.json');
      
      // Convert Map to array for JSON serialization
      const vectorsArray = Array.from(this.vectors.entries()).map(([id, entry]) => ({
        id: entry.id,
        vector: entry.vector,
        metadata: entry.metadata,
      }));

      const data = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        count: vectorsArray.length,
        vectors: vectorsArray,
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving vectors to disk:', error);
    }
  }

  /**
   * Load vectors from disk
   */
  private async loadFromDisk(): Promise<void> {
    try {
      const filePath = path.join(this.storagePath, 'vectors.json');
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        console.log('No existing vector store found, starting fresh');
        return;
      }

      // Read and parse file
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);

      // Load vectors into Map
      this.vectors.clear();
      for (const entry of data.vectors || []) {
        this.vectors.set(entry.id, {
          id: entry.id,
          vector: entry.vector,
          metadata: entry.metadata,
        });
      }

      console.log(`✅ Loaded ${this.vectors.size} vectors from disk (last updated: ${data.lastUpdated})`);
    } catch (error) {
      console.error('Error loading vectors from disk:', error);
      console.log('Starting with empty vector store');
    }
  }

  /**
   * Export vectors to JSON file (backup)
   */
  async exportToFile(filename: string): Promise<void> {
    try {
      const exportPath = path.join(this.storagePath, filename);
      const data = {
        exportDate: new Date().toISOString(),
        count: this.vectors.size,
        vectors: Array.from(this.vectors.values()),
      };

      await fs.writeFile(exportPath, JSON.stringify(data, null, 2));
      console.log(`✅ Exported ${this.vectors.size} vectors to ${exportPath}`);
    } catch (error) {
      console.error('Error exporting vectors:', error);
      throw error;
    }
  }

  /**
   * Import vectors from JSON file
   */
  async importFromFile(filename: string): Promise<void> {
    try {
      const importPath = path.join(this.storagePath, filename);
      const fileContent = await fs.readFile(importPath, 'utf-8');
      const data = JSON.parse(fileContent);

      for (const entry of data.vectors || []) {
        this.vectors.set(entry.id, entry);
      }

      await this.saveToDisk();
      console.log(`✅ Imported ${data.vectors.length} vectors from ${importPath}`);
    } catch (error) {
      console.error('Error importing vectors:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const persistentVectorStore = new PersistentVectorStore();
