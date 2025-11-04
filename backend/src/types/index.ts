// Type definitions for RAG system

export type Subject = 'maths' | 'science' | 'history' | 'geography' | 'english';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface NCERTDocument {
  id: string;
  subject: Subject;
  class: number;
  chapter: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: {
    subject: Subject;
    class: number;
    chapter: string;
    chunkIndex: number;
    totalChunks: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: Subject;
  class: number;
  difficulty: Difficulty;
  topic?: string;
}

export interface QuizGenerationParams {
  subject: Subject;
  class: number;
  difficulty?: Difficulty;
  numberOfQuestions?: number;
  topic?: string;
  chapter?: string;
}

export interface RAGQueryResult {
  chunks: DocumentChunk[];
  query: string;
  totalResults: number;
  processingTime: number;
}

export interface VectorStoreStats {
  totalChunks: number;
  subjects: Subject[];
  classes: number[];
  lastUpdated: string;
}

// Vector store interfaces
export interface VectorEntry {
  id: string;
  vector: number[];
  metadata: any;
}

export interface VectorStore {
  initialize(): Promise<void>;
  addVector(id: string, vector: number[], metadata: any): Promise<void>;
  addVectorsBatch(entries: Array<{ id: string; vector: number[]; metadata: any }>): Promise<void>;
  getVector(id: string): Promise<VectorEntry | null>;
  similaritySearch(
    queryVector: number[],
    topK?: number,
    filter?: (metadata: any) => boolean
  ): Promise<Array<{ id: string; score: number; metadata: any }>>;
  getStats(): {
    totalVectors: number;
    subjects: string[];
    classes: number[];
    lastUpdated: string;
  };
  clear(): Promise<void>;
}
