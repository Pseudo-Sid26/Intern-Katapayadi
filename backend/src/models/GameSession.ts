import mongoose, { Schema, Document } from 'mongoose';

export interface IGameSession extends Document {
  gameType: 'quiz' | 'katapayadi' | 'memory' | 'story' | 'multiplayer';
  userId: mongoose.Types.ObjectId;
  score: number;
  accuracy?: number;
  timeSpent: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  subject?: string;
  class?: number;
  difficulty?: string;
  completed: boolean;
  experienceGained: number;
  createdAt: Date;
}

const GameSessionSchema: Schema = new Schema({
  gameType: {
    type: String,
    required: true,
    enum: ['quiz', 'katapayadi', 'memory', 'story', 'multiplayer']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // in seconds
    required: true,
    default: 0
  },
  questionsAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  subject: String,
  class: Number,
  difficulty: String,
  completed: {
    type: Boolean,
    default: false
  },
  experienceGained: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for user's game history
GameSessionSchema.index({ userId: 1, createdAt: -1 });
GameSessionSchema.index({ gameType: 1 });

export default mongoose.model<IGameSession>('GameSession', GameSessionSchema);
