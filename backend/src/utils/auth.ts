import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Calculate experience points based on game performance
export const calculateExperience = (
  gameType: string,
  score: number,
  accuracy?: number,
  timeSpent?: number
): number => {
  let baseExp = 0;

  switch (gameType) {
    case 'quiz':
      baseExp = score * 10;
      if (accuracy) baseExp += accuracy * 2;
      break;
    case 'katapayadi':
      baseExp = score * 15;
      break;
    case 'memory':
      // Lower moves = more exp (max 50 moves for calculation)
      baseExp = Math.max(0, (50 - score) * 10);
      break;
    case 'story':
      baseExp = score * 20;
      break;
    case 'multiplayer':
      baseExp = score * 25; // Bonus for multiplayer
      break;
    default:
      baseExp = score * 10;
  }

  // Time bonus: faster completion = more exp (if timeSpent < 60 seconds)
  if (timeSpent && timeSpent < 60) {
    baseExp += Math.floor((60 - timeSpent) * 2);
  }

  return Math.floor(baseExp);
};

// Calculate level from experience
export const calculateLevel = (experience: number): number => {
  // Simple formula: level = sqrt(experience / 100)
  return Math.floor(Math.sqrt(experience / 100)) + 1;
};

// Experience needed for next level
export const experienceForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 100;
};
