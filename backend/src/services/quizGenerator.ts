import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizQuestion, QuizGenerationParams, DocumentChunk } from '../types';
import config from '../config';

class QuizGeneratorService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private provider: 'openai' | 'gemini';

  constructor() {
    this.provider = config.aiProvider;
    
    if (config.openaiApiKey && (this.provider === 'openai' || !config.geminiApiKey)) {
      this.openai = new OpenAI({ apiKey: config.openaiApiKey });
      this.provider = 'openai';
      console.log('✅ OpenAI quiz generator initialized');
    }
    
    if (config.geminiApiKey && this.provider === 'gemini') {
      this.gemini = new GoogleGenerativeAI(config.geminiApiKey);
      console.log('✅ Gemini quiz generator initialized');
    }
    
    if (!this.openai && !this.gemini) {
      console.warn('⚠️  No AI provider configured, using sample questions');
    }
  }

  async generateQuiz(
    params: QuizGenerationParams,
    context: DocumentChunk[]
  ): Promise<QuizQuestion[]> {
    const {
      subject,
      class: classNum,
      difficulty = 'medium',
      numberOfQuestions = 5,
      topic,
    } = params;

    if (!this.openai && !this.gemini) {
      console.warn('No AI provider configured, returning sample questions');
      return this.generateSampleQuestions(params);
    }

    try {
      if (this.provider === 'openai' && this.openai) {
        return await this.generateOpenAIQuiz(params, context);
      } else if (this.provider === 'gemini' && this.gemini) {
        return await this.generateGeminiQuiz(params, context);
      } else {
        return this.generateSampleQuestions(params);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      return this.generateSampleQuestions(params);
    }
  }

  private async generateOpenAIQuiz(
    params: QuizGenerationParams,
    context: DocumentChunk[]
  ): Promise<QuizQuestion[]> {
    if (!this.openai) throw new Error('OpenAI not configured');
    
    const prompt = this.createQuizPrompt(params, context);

    const completion = await this.openai.chat.completions.create({
      model: config.chatModel,
      messages: [
        {
          role: 'system',
          content: 'You are an expert NCERT educator who creates engaging and accurate quiz questions based on NCERT textbook content. Always provide 4 options and mark the correct answer clearly. Return responses in valid JSON format.',
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
    return this.formatQuizQuestions(parsed.questions || [], params);
  }

  private async generateGeminiQuiz(
    params: QuizGenerationParams,
    context: DocumentChunk[]
  ): Promise<QuizQuestion[]> {
    if (!this.gemini) throw new Error('Gemini not configured');
    
    const prompt = this.createQuizPrompt(params, context);
    const model = this.gemini.getGenerativeModel({ model: config.geminiChatModel });

    const result = await model.generateContent([
      'You are an expert NCERT educator who creates engaging and accurate quiz questions based on NCERT textbook content. Always provide 4 options and mark the correct answer clearly. Return responses in valid JSON format.',
      prompt
    ]);

    const response = result.response.text();
    
    // Gemini might wrap JSON in markdown code blocks
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);
    return this.formatQuizQuestions(parsed.questions || [], params);
  }

  private createQuizPrompt(params: QuizGenerationParams, context: DocumentChunk[]): string {
    const {
      subject = 'general',
      class: classNum = 5,
      difficulty = 'medium',
      numberOfQuestions = 5,
      topic,
    } = params;

    const contextText = context
      .map((chunk, i) => `[Document ${i + 1}]\n${chunk.content}`)
      .join('\n\n');

    const timestamp = Date.now();
    const randomSeed = Math.random().toString(36).substring(7);

    // Different question types to rotate through
    const mathQuestionTypes = [
      'numerical calculation problems',
      'word problems requiring problem-solving',
      'geometry and shapes questions',
      'fraction and decimal operations',
      'place value and number systems',
      'pattern recognition and sequences',
      'measurement and units',
      'algebraic thinking and equations',
      'data interpretation from given context',
      'logical reasoning with numbers'
    ];

    const scienceQuestionTypes = [
      'scientific processes and experiments',
      'classification and categorization',
      'cause and effect relationships',
      'properties and characteristics',
      'natural phenomena explanations',
      'scientific terminology and definitions'
    ];

    const historyQuestionTypes = [
      'chronological events and dates',
      'historical figures and their contributions',
      'causes and consequences of events',
      'cultural and social developments',
      'political movements and changes',
      'geographical contexts of history'
    ];

    const geographyQuestionTypes = [
      'physical features and landforms',
      'climate and weather patterns',
      'natural resources and their uses',
      'maps and spatial relationships',
      'environmental issues',
      'population and settlements'
    ];

    const englishQuestionTypes = [
      'grammar rules and usage',
      'vocabulary and word meanings',
      'sentence structure and syntax',
      'literary devices and figures of speech',
      'comprehension and inference',
      'parts of speech identification'
    ];

    // Select random question type based on subject
    const questionTypeMap: Record<string, string[]> = {
      maths: mathQuestionTypes,
      science: scienceQuestionTypes,
      history: historyQuestionTypes,
      geography: geographyQuestionTypes,
      english: englishQuestionTypes
    };

    const availableTypes = questionTypeMap[subject.toLowerCase()] || mathQuestionTypes;
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    // Subject-specific instructions
    const subjectInstructions: Record<string, string> = {
      maths: `
CRITICAL FOR MATHEMATICS:
- Focus SPECIFICALLY on: ${selectedType}
- Generate ACTUAL MATH PROBLEMS that require calculation or mathematical reasoning
- Include numerical problems, equations, geometry, fractions, decimals, word problems
- DO NOT ask meta-questions about "how to learn" or "what is the best approach"
- VARY the difficulty, numbers, and scenarios in each question
- Use DIFFERENT mathematical concepts from the context each time
- Examples of GOOD questions:
  * "What is 3/4 + 1/2?" 
  * "If a rectangle has length 12 cm and width 8 cm, what is its area?"
  * "Solve: 2x + 5 = 15"
  * "What is the LCM of 12 and 18?"
  * "A shopkeeper bought 24 apples for ₹120. What is the cost of one apple?"
- Examples of BAD questions (DO NOT USE):
  * "What is the best way to learn fractions?"
  * "How should you approach a word problem?"
  * Questions about learning strategies or study methods`,
      
      science: `
CRITICAL FOR SCIENCE:
- Focus SPECIFICALLY on: ${selectedType}
- Ask about scientific facts, processes, experiments, definitions
- Include questions about natural phenomena, scientific principles, classifications
- VARY the topics: biology, physics, chemistry, environmental science
- Use DIFFERENT examples and scenarios each time
- Examples: "What is photosynthesis?", "Which planet is closest to the Sun?", "What is the boiling point of water?"`,
      
      history: `
CRITICAL FOR HISTORY:
- Focus SPECIFICALLY on: ${selectedType}
- Ask about historical events, dates, personalities, movements
- Include questions about causes, effects, and significance of historical events
- VARY the time periods and regions covered
- Use DIFFERENT historical examples each time
- Examples: "When did India gain independence?", "Who was the first Mughal emperor?"`,
      
      geography: `
CRITICAL FOR GEOGRAPHY:
- Focus SPECIFICALLY on: ${selectedType}
- Ask about locations, physical features, climate, resources
- Include questions about maps, continents, countries, capitals
- VARY the geographical regions and topics
- Use DIFFERENT examples each time
- Examples: "Which is the longest river in India?", "What is the capital of France?"`,
      
      english: `
CRITICAL FOR ENGLISH:
- Focus SPECIFICALLY on: ${selectedType}
- Ask about grammar, vocabulary, comprehension, literary devices
- Include questions about parts of speech, tenses, sentence structure
- VARY the examples and grammatical concepts
- Use DIFFERENT sentences and words each time
- Examples: "What is the past tense of 'go'?", "Identify the noun in: The cat sleeps."`
    };

    const specificInstruction = subjectInstructions[subject.toLowerCase()] || 
      'Generate factual, knowledge-based questions directly about the subject content.';

    return `Based on the following NCERT content, generate ${numberOfQuestions} UNIQUE and VARIED ${difficulty} level multiple-choice quiz questions for Class ${classNum} ${subject}${topic ? ` on the topic "${topic}"` : ''}.

CRITICAL: THIS GENERATION MUST BE COMPLETELY DIFFERENT FROM ANY PREVIOUS GENERATIONS!
Generation Seed: ${randomSeed}
Timestamp: ${timestamp}
Question Type Focus: ${selectedType}

${specificInstruction}

Context from NCERT:
${contextText}

MANDATORY VARIETY REQUIREMENTS:
1. Each question MUST cover a DIFFERENT concept or topic from the context
2. Use DIFFERENT numbers, names, scenarios, and examples
3. ROTATE through different question formats: 
   - Direct questions (What is...)
   - Application problems (Calculate...)
   - Scenario-based (If... then...)
   - Comparison questions (Which is greater...)
   - Identification questions (Identify the...)
4. For MATHS: Use different operations, different number ranges, different real-world contexts
5. NEVER repeat similar question patterns or structures
6. Pull information from DIFFERENT parts of the context document
7. Each question must test a DIFFERENT skill or concept

CRITICAL REQUIREMENTS:
1. Questions must be DIRECT, FACTUAL, and test actual knowledge or problem-solving ability
2. For MATHS: Must include actual calculations, numbers, formulas, or mathematical operations
3. Each question must have exactly 4 options (A, B, C, D)
4. Mark the correct answer clearly
5. Provide a brief explanation showing the solution/reasoning
6. Questions should be appropriate for Class ${classNum} students
7. Difficulty level: ${difficulty}
8. Base questions strictly on concepts from the provided context
9. Generation ID: ${timestamp}-${randomSeed}

FORBIDDEN:
- DO NOT ask about "best approaches", "learning strategies", or "study methods"
- DO NOT ask meta-questions about how to learn or think about problems
- DO NOT repeat question types or patterns from previous generations
- Questions must test actual subject knowledge, not learning philosophy

DIVERSITY INSTRUCTIONS:
- If previous questions were about addition, ask about subtraction or multiplication
- If previous questions used integers, use fractions or decimals
- If previous questions were theoretical, make them practical
- Cover the FULL BREADTH of the context, not just one section

Return the response in this exact JSON format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Step-by-step solution or reasoning"
    }
  ]
}`;
  }

  private formatQuizQuestions(
    questions: any[],
    params: QuizGenerationParams
  ): QuizQuestion[] {
    return questions.map((q, index) => ({
      id: `quiz_${Date.now()}_${index}`,
      question: q.question || 'Sample question',
      options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
      correctAnswer: q.correctAnswer || q.options?.[0] || 'A',
      explanation: q.explanation || 'No explanation provided',
      subject: params.subject,
      class: params.class,
      difficulty: params.difficulty || 'medium',
      topic: params.topic,
    }));
  }

  private generateSampleQuestions(params: QuizGenerationParams): QuizQuestion[] {
    const { subject, class: classNum, difficulty = 'medium', numberOfQuestions = 5 } = params;

    const sampleQuestions: Record<string, QuizQuestion[]> = {
      maths: [
        {
          id: 'sample_math_1',
          question: 'What is the place value of 5 in the number 5432?',
          options: ['5', '50', '500', '5000'],
          correctAnswer: '5000',
          explanation: 'The digit 5 is in the thousands place, so its place value is 5000',
          subject: 'maths',
          class: classNum,
          difficulty: 'easy',
        },
        {
          id: 'sample_math_2',
          question: 'Which of the following is a proper fraction?',
          options: ['5/3', '7/7', '3/4', '8/5'],
          correctAnswer: '3/4',
          explanation: 'A proper fraction has numerator less than denominator. 3/4 is the only proper fraction.',
          subject: 'maths',
          class: classNum,
          difficulty: 'medium',
        },
      ],
      science: [
        {
          id: 'sample_science_1',
          question: 'What gas do plants release during photosynthesis?',
          options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
          correctAnswer: 'Oxygen',
          explanation: 'During photosynthesis, plants release oxygen as a byproduct',
          subject: 'science',
          class: classNum,
          difficulty: 'easy',
        },
        {
          id: 'sample_science_2',
          question: 'What is the SI unit of force?',
          options: ['Pascal', 'Newton', 'Joule', 'Watt'],
          correctAnswer: 'Newton',
          explanation: 'Newton (N) is the SI unit of force, named after Sir Isaac Newton',
          subject: 'science',
          class: classNum,
          difficulty: 'medium',
        },
      ],
      history: [
        {
          id: 'sample_history_1',
          question: 'In which year was the Delhi Sultanate established?',
          options: ['1206', '1526', '1857', '1947'],
          correctAnswer: '1206',
          explanation: 'The Delhi Sultanate was established in 1206 CE',
          subject: 'history',
          class: classNum,
          difficulty: 'medium',
        },
      ],
      geography: [
        {
          id: 'sample_geo_1',
          question: 'Which mountain range forms India\'s northern border?',
          options: ['Western Ghats', 'Eastern Ghats', 'Himalayas', 'Aravalli'],
          correctAnswer: 'Himalayas',
          explanation: 'The Himalayas form India\'s northern border and are the highest mountain range in the world',
          subject: 'geography',
          class: classNum,
          difficulty: 'easy',
        },
      ],
      english: [
        {
          id: 'sample_english_1',
          question: 'Which part of speech describes a noun?',
          options: ['Verb', 'Adverb', 'Adjective', 'Preposition'],
          correctAnswer: 'Adjective',
          explanation: 'An adjective is a word that describes or modifies a noun',
          subject: 'english',
          class: classNum,
          difficulty: 'easy',
        },
      ],
    };

    const questions = sampleQuestions[subject] || sampleQuestions.maths;
    return questions.slice(0, numberOfQuestions);
  }
}

export const quizGenerator = new QuizGeneratorService();
