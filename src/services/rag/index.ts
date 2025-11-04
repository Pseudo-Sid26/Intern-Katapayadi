// Main RAG Service - Orchestrates all RAG components
import { vectorStore } from './vectorStore';
import { documentLoader } from './documentLoader';
import { quizGenerationService } from './quizGenerator';
import { QuizGenerationParams, QuizQuestion } from './types';

class RAGService {
  private initialized = false;

  /**
   * Initialize the RAG system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('RAG system already initialized');
      return;
    }

    try {
      console.log('Initializing RAG system...');
      
      // Try to load from localStorage first
      vectorStore.load();
      
      const stats = vectorStore.getStats();
      if (stats.totalChunks > 0) {
        console.log('Loaded existing vector store:', stats);
        this.initialized = true;
        return;
      }

      // If no data in localStorage, load sample documents
      console.log('Loading sample NCERT documents...');
      const chunks = await documentLoader.initializeVectorStore();
      
      console.log(`Processing ${chunks.length} document chunks...`);
      await vectorStore.addChunks(chunks);
      
      // Save to localStorage for persistence
      vectorStore.save();
      
      const newStats = vectorStore.getStats();
      console.log('RAG system initialized successfully:', newStats);
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  /**
   * Generate quiz questions
   */
  async generateQuiz(params: QuizGenerationParams): Promise<QuizQuestion[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return quizGenerationService.generateQuiz(params);
  }

  /**
   * Search for content
   */
  async search(query: string, options?: any) {
    if (!this.initialized) {
      await this.initialize();
    }

    return vectorStore.search(query, options);
  }

  /**
   * Get statistics about the knowledge base
   */
  getStats() {
    return vectorStore.getStats();
  }

  /**
   * Check if RAG system is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset the RAG system
   */
  async reset(): Promise<void> {
    vectorStore.clear();
    localStorage.removeItem('ncert_vector_store');
    this.initialized = false;
    await this.initialize();
  }
}

// Export singleton instance
export const ragService = new RAGService();
