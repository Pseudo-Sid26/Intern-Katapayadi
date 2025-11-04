import express, { Response } from 'express';
import GameSession from '../models/GameSession';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { calculateExperience, calculateLevel } from '../utils/auth';
import { isDBConnected } from '../config/database';

const router = express.Router();

// Save game session
router.post('/session', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const {
      gameType,
      score,
      accuracy,
      timeSpent,
      questionsAnswered,
      correctAnswers,
      subject,
      class: classNum,
      difficulty,
      completed
    } = req.body;

    // Calculate experience
    const experienceGained = calculateExperience(gameType, score, accuracy, timeSpent);

    // Create game session
    const session = new GameSession({
      gameType,
      userId: req.userId,
      score,
      accuracy,
      timeSpent,
      questionsAnswered,
      correctAnswers,
      subject,
      class: classNum,
      difficulty,
      completed,
      experienceGained
    });

    await session.save();

    // Update user stats
    const user = await User.findById(req.userId);
    if (user) {
      user.totalScore += score;
      user.experience += experienceGained;
      user.gamesPlayed += 1;
      user.level = calculateLevel(user.experience);

      // Update game-specific stats
      if (gameType === 'quiz' && completed) {
        user.quizzesCompleted += 1;
        if (accuracy) {
          user.stats.quizAccuracy = Math.round(
            (user.stats.quizAccuracy * (user.quizzesCompleted - 1) + accuracy) / user.quizzesCompleted
          );
        }
      } else if (gameType === 'katapayadi') {
        user.stats.katapayadiScore += score;
      } else if (gameType === 'memory') {
        if (score < user.stats.memoryMatchBest) {
          user.stats.memoryMatchBest = score;
        }
      } else if (gameType === 'story' && completed) {
        user.stats.storyBuilderCompleted += 1;
      }

      await user.save();

      res.json({
        message: 'Game session saved',
        session: {
          id: session._id,
          experienceGained,
          newLevel: user.level,
          totalExperience: user.experience,
          totalScore: user.totalScore
        }
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Failed to save game session' });
  }
});

// Get user's game history
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const gameType = req.query.gameType as string;

    const query: any = { userId: req.userId };
    if (gameType) {
      query.gameType = gameType;
    }

    const sessions = await GameSession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ history: sessions });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get game history' });
  }
});

// Get user stats summary
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const totalSessions = await GameSession.countDocuments({ userId: req.userId });
    const recentSessions = await GameSession.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        totalSessions,
        gameStats: user.stats,
        achievements: user.achievements,
        recentGames: recentSessions
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
