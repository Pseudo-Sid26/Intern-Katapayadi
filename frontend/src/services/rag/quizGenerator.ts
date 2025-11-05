// Quiz Generation Service using RAG
import OpenAI from 'openai';
import { QuizQuestion, QuizGenerationParams } from './types';
import { vectorStore } from './vectorStore';

class QuizGenerationService {
  private openai: OpenAI | null = null;
  private model = 'gpt-4o-mini';

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  /**
   * Generate quiz questions based on NCERT content
   */
  async generateQuiz(params: QuizGenerationParams): Promise<QuizQuestion[]> {
    const {
      subject,
      class: classNum,
      chapter,
      difficulty,
      numberOfQuestions,
      topic,
    } = params;

    if (!this.openai) {
      console.warn('OpenAI not configured, returning sample questions');
      return this.generateSampleQuestions(params);
    }

    try {
      // Construct search query
      let searchQuery = '';
      if (topic) {
        searchQuery = topic;
      } else if (chapter) {
        searchQuery = chapter;
      } else if (subject) {
        searchQuery = `${subject} concepts`;
      } else {
        searchQuery = 'general knowledge questions';
      }

      // Retrieve relevant content from vector store
      const ragResult = await vectorStore.search(searchQuery, {
        topK: 3,
        subject,
        class: classNum,
        minScore: 0.6,
      });

      if (ragResult.chunks.length === 0) {
        console.warn('No relevant content found, generating sample questions');
        return this.generateSampleQuestions(params);
      }

      // Prepare context from retrieved chunks
      const context = ragResult.chunks
        .map((chunk, i) => `[Document ${i + 1}]\n${chunk.content}`)
        .join('\n\n');

      // Generate quiz using LLM
      const prompt = this.createQuizPrompt(params, context);
      
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert NCERT educator who creates engaging and accurate quiz questions based on NCERT textbook content. Always provide 4 options and mark the correct answer clearly.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(response);
      return this.formatQuizQuestions(parsed.questions, params);
    } catch (error) {
      console.error('Error generating quiz:', error);
      return this.generateSampleQuestions(params);
    }
  }

  /**
   * Create prompt for quiz generation
   */
  private createQuizPrompt(params: QuizGenerationParams, context: string): string {
    const {
      subject = 'general',
      class: classNum = 5,
      difficulty = 'medium',
      numberOfQuestions = 5,
      topic,
    } = params;

    const difficultyLevel = difficulty;
    const numQuestions = numberOfQuestions;

    return `Based on the following NCERT content, generate ${numQuestions} ${difficultyLevel} level multiple-choice quiz questions for Class ${classNum} ${subject}${topic ? ` on the topic "${topic}"` : ''}.

Context from NCERT:
${context}

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Mark the correct answer clearly
3. Provide a brief explanation for the correct answer
4. Questions should be appropriate for Class ${classNum} students
5. Difficulty level: ${difficultyLevel}
6. Base questions on the provided context
7. Use the Katapayadi encoding system creatively where appropriate

Return the response in JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Explanation of why this is correct",
      "topic": "Specific topic covered"
    }
  ]
}`;
  }

  /**
   * Format and validate quiz questions
   */
  private formatQuizQuestions(
    questions: any[],
    params: QuizGenerationParams
  ): QuizQuestion[] {
    return questions.map((q, index) => ({
      id: `quiz-${Date.now()}-${index}`,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'No explanation provided',
      difficulty: params.difficulty || 'medium',
      subject: params.subject || 'general',
      class: params.class || 5,
      chapter: params.chapter || 'general',
      topic: q.topic || params.topic || 'general',
    }));
  }

  /**
   * Generate sample questions when API is not available
   */
  private generateSampleQuestions(params: QuizGenerationParams): QuizQuestion[] {
    const {
      subject = 'maths',
      class: classNum = 5,
      numberOfQuestions = 5,
    } = params;

    const sampleQuestions: QuizQuestion[] = [
      {
        id: 'sample-1',
        question: `What is the value of 7 × 8?`,
        options: ['54', '56', '64', '72'],
        correctAnswer: '56',
        explanation: '7 multiplied by 8 equals 56',
        difficulty: 'easy',
        subject,
        class: classNum,
        chapter: 'Multiplication',
        topic: 'Multiplication Tables',
      },
      {
        id: 'sample-2',
        question: `If a triangle has sides of equal length, what type of triangle is it?`,
        options: ['Scalene', 'Isosceles', 'Equilateral', 'Right-angled'],
        correctAnswer: 'Equilateral',
        explanation: 'An equilateral triangle has all three sides of equal length',
        difficulty: 'easy',
        subject: 'maths',
        class: classNum,
        chapter: 'Geometry',
        topic: 'Types of Triangles',
      },
      {
        id: 'sample-3',
        question: `What is the square root of 144?`,
        options: ['10', '11', '12', '13'],
        correctAnswer: '12',
        explanation: '12 × 12 = 144, so √144 = 12',
        difficulty: 'medium',
        subject: 'maths',
        class: classNum,
        chapter: 'Square Roots',
        topic: 'Perfect Squares',
      },
    ];

    return sampleQuestions.slice(0, numberOfQuestions);
  }
}

export const quizGenerationService = new QuizGenerationService();
