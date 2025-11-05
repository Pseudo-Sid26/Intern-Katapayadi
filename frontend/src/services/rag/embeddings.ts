// Embedding Generation Service
import OpenAI from 'openai';

class EmbeddingService {
  private openai: OpenAI | null = null;
  private embeddingModel = 'text-embedding-3-small';

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, use a backend
      });
    }
  }

  /**
   * Generate embeddings for a text string
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      console.warn('OpenAI not configured, using mock embedding');
      return this.generateMockEmbedding(text);
    }

    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return this.generateMockEmbedding(text);
    }
  }

  /**
   * Generate embeddings for multiple texts
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.openai) {
      return texts.map(text => this.generateMockEmbedding(text));
    }

    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: texts,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      return texts.map(text => this.generateMockEmbedding(text));
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Mock embedding for testing without API key
   */
  private generateMockEmbedding(text: string): number[] {
    // Simple hash-based mock embedding (not for production)
    const hash = this.simpleHash(text);
    const embedding: number[] = [];
    
    for (let i = 0; i < 1536; i++) {
      embedding.push(Math.sin(hash + i) * 0.5 + 0.5);
    }
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
}

export const embeddingService = new EmbeddingService();
