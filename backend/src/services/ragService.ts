import { vectorStore } from './vectorStore';
import { documentLoader } from './documentLoader';
import { quizGenerator } from './quizGenerator';
import { QuizGenerationParams, QuizQuestion, DocumentChunk } from '../types';

class RAGService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('RAG service already initialized');
      return;
    }

    console.log('Initializing RAG service...');

    // Load processed NCERT documents (from real PDFs)
    const documents = documentLoader.loadProcessedDocuments();
    console.log(`Loaded ${documents.length} processed documents`);

    // Chunk all documents
    const allChunks = documents.flatMap(doc => documentLoader.chunkDocument(doc));
    console.log(`Created ${allChunks.length} chunks`);

    // Add chunks to vector store (embeddings will be generated)
    await vectorStore.addChunks(allChunks);
    console.log('Vector store populated with embeddings');

    this.initialized = true;
    vectorStore.setInitialized(true);

    const stats = vectorStore.getStats();
    console.log('RAG service initialized:', stats);
  }

  async generateQuiz(params: QuizGenerationParams): Promise<QuizQuestion[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Add variety through different search strategies
    const randomSeed = Date.now();
    const randomVariation = Math.floor(Math.random() * 1000);
    console.log(`Generating quiz with seed: ${randomSeed}-${randomVariation}`);

    // Construct multiple diverse search queries to get broader content
    const searchQueries: string[] = [];
    
    if (params.topic) {
      searchQueries.push(params.topic);
      searchQueries.push(`${params.subject} ${params.topic}`);
      searchQueries.push(`${params.topic} examples`);
      searchQueries.push(`${params.topic} problems`);
    } else if (params.chapter) {
      searchQueries.push(params.chapter);
      searchQueries.push(`${params.subject} chapter ${params.chapter}`);
      searchQueries.push(`${params.subject} ${params.chapter} concepts`);
    } else {
      // Use varied search terms to get different chunks each time
      const broadTerms = [
        `${params.subject} concepts for class ${params.class}`,
        `${params.subject} class ${params.class}`,
        `${params.subject} problems`,
        `${params.subject} exercises`,
        `${params.subject} fundamentals`,
        `${params.subject} applications`
      ];
      
      // Randomly select 3 search terms for variety
      const shuffledTerms = this.shuffleArray([...broadTerms]);
      searchQueries.push(...shuffledTerms.slice(0, 3));
    }

    // Search vector store with higher topK to get more diverse chunks
    const allChunks: DocumentChunk[] = [];
    
    // First try with class filter
    for (const searchQuery of searchQueries) {
      console.log(`Searching for: "${searchQuery}" with subject=${params.subject}, class=${params.class}`);
      
      const { chunks } = await vectorStore.search(searchQuery, {
        topK: 7, // Increased from 5 to get more variety
        subject: params.subject,
        class: params.class,
        minScore: 0.3,
      });
      
      console.log(`Found ${chunks.length} chunks for query: "${searchQuery}"`);
      
      chunks.forEach(chunk => {
        if (!allChunks.find(c => c.id === chunk.id)) {
          allChunks.push(chunk);
        }
      });
    }
    
    // If no results, try without class filter (use any available class)
    if (allChunks.length === 0) {
      console.log(`No results for class ${params.class}, searching without class filter`);
      for (const searchQuery of searchQueries) {
        const { chunks } = await vectorStore.search(searchQuery, {
          topK: 7, // Increased from 5
          subject: params.subject,
          minScore: 0.3,
        });
        
        console.log(`Found ${chunks.length} chunks (any class) for query: "${searchQuery}"`);
        
        chunks.forEach(chunk => {
          if (!allChunks.find(c => c.id === chunk.id)) {
            allChunks.push(chunk);
          }
        });
      }
    }

    // Shuffle chunks for maximum variety - different order each time
    const shuffledChunks = this.shuffleArray(allChunks);
    
    // Select a random subset to ensure different content each generation
    const maxChunks = Math.min(10, shuffledChunks.length);
    const randomStartIndex = Math.floor(Math.random() * Math.max(1, shuffledChunks.length - maxChunks + 1));
    const selectedChunks = shuffledChunks.slice(randomStartIndex, randomStartIndex + maxChunks);
    
    console.log(`Found ${allChunks.length} unique chunks, using ${selectedChunks.length} random chunks for generation`);

    // Generate quiz using retrieved context
    const questions = await quizGenerator.generateQuiz(params, selectedChunks);

    return questions;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getStats() {
    return vectorStore.getStats();
  }

  async reset(): Promise<void> {
    vectorStore.clear();
    this.initialized = false;
    await this.initialize();
  }
}

export const ragService = new RAGService();
