import express, { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { isDBConnected } from '../config/database';

const router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const { username, email, password, displayName } = req.body;

    // Validation
    if (!username || !email || !password || !displayName) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (username.length < 3 || username.length > 20) {
      res.status(400).json({ error: 'Username must be 3-20 characters' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      res.status(400).json({ 
        error: existingUser.username === username 
          ? 'Username already taken' 
          : 'Email already registered' 
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      displayName
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    // Find user
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        achievements: user.achievements,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const user = req.user;
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        quizzesCompleted: user.quizzesCompleted,
        achievements: user.achievements,
        stats: user.stats,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const { displayName, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (displayName) user.displayName = displayName;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        level: user.level,
        experience: user.experience,
        totalScore: user.totalScore
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDBConnected()) {
      res.status(503).json({ error: 'Database not available' });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;
    
    const users = await User.find()
      .select('username displayName avatar level totalScore experience stats')
      .sort({ totalScore: -1 })
      .limit(limit);

    res.json({ leaderboard: users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
