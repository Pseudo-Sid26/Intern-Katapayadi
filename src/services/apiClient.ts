// Frontend API client for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface QuizGenerationParams {
  subject: 'maths' | 'science' | 'history' | 'geography' | 'english';
  class: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  numberOfQuestions?: number;
  topic?: string;
  chapter?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  class: number;
  difficulty: string;
  topic?: string;
}

export interface RAGStats {
  totalChunks: number;
  subjects: string[];
  classes: number[];
  lastUpdated: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  async generateQuiz(params: QuizGenerationParams): Promise<QuizQuestion[]> {
    const response = await this.request<{ success: boolean; data: QuizQuestion[] }>(
      '/api/quiz/generate',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );

    return response.data;
  }

  async getStats(): Promise<RAGStats> {
    const response = await this.request<{ success: boolean; data: RAGStats }>(
      '/api/quiz/stats'
    );

    return response.data;
  }

  async resetRAG(): Promise<RAGStats> {
    const response = await this.request<{ success: boolean; data: RAGStats }>(
      '/api/quiz/reset',
      { method: 'POST' }
    );

    return response.data;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient();
