import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  gamesPlayed: number;
  quizzesCompleted: number;
  achievements: string[];
  stats: {
    katapayadiScore: number;
    memoryMatchBest: number;
    storyBuilderCompleted: number;
    quizAccuracy: number;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  quizzesCompleted: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  stats: {
    katapayadiScore: {
      type: Number,
      default: 0
    },
    memoryMatchBest: {
      type: Number,
      default: 999 // Lower is better (moves)
    },
    storyBuilderCompleted: {
      type: Number,
      default: 0
    },
    quizAccuracy: {
      type: Number,
      default: 0
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ totalScore: -1 }); // For leaderboard

export default mongoose.model<IUser>('User', UserSchema);
