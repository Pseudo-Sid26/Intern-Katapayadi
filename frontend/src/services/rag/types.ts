// RAG System Types

export interface NCERTDocument {
  id: string;
  subject: 'maths' | 'science' | 'history' | 'geography' | 'english';
  class: number; // 1-10
  chapter: string;
  content: string;
  metadata: {
    title: string;
    pageNumber?: number;
    section?: string;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: NCERTDocument['metadata'] & {
    subject: NCERTDocument['subject'];
    class: number;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  class: number;
  chapter: string;
  topic: string;
}

export interface QuizGenerationParams {
  subject?: 'maths' | 'science' | 'history' | 'geography' | 'english';
  class?: number;
  chapter?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions?: number;
  topic?: string;
}

export interface RAGQueryResult {
  chunks: DocumentChunk[];
  relevanceScores: number[];
}
