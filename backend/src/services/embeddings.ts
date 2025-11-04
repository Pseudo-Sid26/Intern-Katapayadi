import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';

class EmbeddingService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private provider: 'openai' | 'gemini';

  constructor() {
    this.provider = config.aiProvider;
    
    if (config.openaiApiKey && (this.provider === 'openai' || !config.geminiApiKey)) {
      this.openai = new OpenAI({ apiKey: config.openaiApiKey });
      this.provider = 'openai';
      console.log('✅ OpenAI embedding service initialized');
    }
    
    if (config.geminiApiKey && this.provider === 'gemini') {
      this.gemini = new GoogleGenerativeAI(config.geminiApiKey);
      console.log('✅ Gemini embedding service initialized');
    }
    
    if (!this.openai && !this.gemini) {
      console.warn('⚠️  No AI provider configured, using mock embeddings');
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.provider === 'openai' && this.openai) {
      return this.generateOpenAIEmbedding(text);
    } else if (this.provider === 'gemini' && this.gemini) {
      return this.generateGeminiEmbedding(text);
    } else {
      console.warn('No AI provider available, using mock embedding');
      return this.mockEmbedding(text);
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    if (this.provider === 'openai' && this.openai) {
      return this.generateOpenAIBatchEmbeddings(texts);
    } else if (this.provider === 'gemini' && this.gemini) {
      const embeddings: number[][] = [];
      const batchSize = 5;

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(text => this.generateGeminiEmbedding(text)));
        embeddings.push(...batchResults);

        if (embeddings.length % 100 === 0 || embeddings.length === texts.length) {
          console.log(`Generated Gemini embeddings: ${embeddings.length}/${texts.length}`);
        }

        await this.delay(100);
      }

      return embeddings;
    } else {
      return Promise.all(texts.map(t => this.mockEmbedding(t)));
    }
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    try {
      const response = await this.openai.embeddings.create({
        model: config.embeddingModel,
        input: text,
        encoding_format: 'float',
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating OpenAI embedding:', error);
      return this.mockEmbedding(text);
    }
  }

  private async generateOpenAIBatchEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    try {
      const response = await this.openai.embeddings.create({
        model: config.embeddingModel,
        input: texts,
        encoding_format: 'float',
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generating OpenAI batch embeddings:', error);
      return Promise.all(texts.map(t => this.mockEmbedding(t)));
    }
  }

  private async generateGeminiEmbedding(text: string, attempt = 1): Promise<number[]> {
    if (!this.gemini) throw new Error('Gemini not configured');
    
    try {
      const model = this.gemini.getGenerativeModel({ model: config.geminiEmbeddingModel });
      const result = await model.embedContent(text);
      
      return result.embedding.values;
    } catch (error) {
      console.error(`Error generating Gemini embedding (attempt ${attempt}):`, error);
      if (attempt < 3) {
        await this.delay(200 * attempt);
        return this.generateGeminiEmbedding(text, attempt + 1);
      }
      return this.mockEmbedding(text);
    }
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private mockEmbedding(text: string): number[] {
    // Simple hash-based mock embedding (768 dimensions for Gemini compatibility)
    const dimensions = 768;
    const embedding = new Array(dimensions).fill(0);
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = (charCode * i) % dimensions;
      embedding[index] += charCode / 1000;
    }

    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (norm || 1));
  }

  getProvider(): string {
    return this.provider;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const embeddingService = new EmbeddingService();
