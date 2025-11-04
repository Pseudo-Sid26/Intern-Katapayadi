import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
    displayName: String,
    score: {
      type: Number,
      default: 0,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    answers: [{
      questionId: String,
      answer: String,
      correct: Boolean,
      timeSpent: Number,
    }],
  }],
  settings: {
    subject: {
      type: String,
      enum: ['maths', 'science', 'history', 'geography', 'english'],
      default: 'maths',
    },
    class: {
      type: Number,
      min: 1,
      max: 12,
      default: 6,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    numberOfQuestions: {
      type: Number,
      default: 5,
      min: 1,
      max: 20,
    },
    timePerQuestion: {
      type: Number,
      default: 30, // seconds
    },
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'in-progress', 'finished'],
    default: 'waiting',
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  questions: [{
    id: String,
    question: String,
    options: [String],
    correctAnswer: String,
    solutionWord: String,
  }],
  startedAt: Date,
  finishedAt: Date,
}, {
  timestamps: true,
});

// Generate unique 6-character room code
roomSchema.statics.generateRoomCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const Room = mongoose.model('Room', roomSchema);
