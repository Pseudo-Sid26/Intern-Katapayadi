import { Router, Request, Response } from 'express';
import { ragService } from '../services/ragService';
import { embeddingService } from '../services/embeddings';
import { QuizGenerationParams } from '../types';
import config from '../config';

const router = Router();

/**
 * POST /api/quiz/generate
 * Generate quiz questions based on NCERT content
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const params: QuizGenerationParams = req.body;

    // Validation
    if (!params.subject || !params.class) {
      return res.status(400).json({
        error: 'Missing required parameters: subject and class are required',
      });
    }

    if (params.class < 1 || params.class > 10) {
      return res.status(400).json({
        error: 'Class must be between 1 and 10',
      });
    }

    const validSubjects = ['maths', 'science', 'history', 'geography', 'english'];
    if (!validSubjects.includes(params.subject)) {
      return res.status(400).json({
        error: `Invalid subject. Must be one of: ${validSubjects.join(', ')}`,
      });
    }

    // Set defaults
    params.difficulty = params.difficulty || 'medium';
    params.numberOfQuestions = params.numberOfQuestions || 5;

    // Generate quiz
    const questions = await ragService.generateQuiz(params);

    res.json({
      success: true,
      data: questions,
      metadata: {
        count: questions.length,
        subject: params.subject,
        class: params.class,
        difficulty: params.difficulty,
      },
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/quiz/stats
 * Get RAG system statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = ragService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
    });
  }
});

/**
 * POST /api/quiz/reset
 * Reset and reinitialize the RAG system
 */
router.post('/reset', async (req: Request, res: Response) => {
  try {
    await ragService.reset();
    const stats = ragService.getStats();
    
    res.json({
      success: true,
      message: 'RAG system reset successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Error resetting RAG system:', error);
    res.status(500).json({
      error: 'Failed to reset RAG system',
    });
  }
});

/**
 * GET /api/quiz/provider
 * Get current AI provider information
 */
router.get('/provider', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        provider: config.aiProvider,
        embeddingProvider: embeddingService.getProvider(),
        models: {
          embedding: config.aiProvider === 'openai' ? config.embeddingModel : config.geminiEmbeddingModel,
          chat: config.aiProvider === 'openai' ? config.chatModel : config.geminiChatModel,
        },
        configured: {
          openai: !!config.openaiApiKey,
          gemini: !!config.geminiApiKey,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching provider info:', error);
    res.status(500).json({
      error: 'Failed to fetch provider information',
    });
  }
});

export default router;
