import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Room } from '../models/Room';
import User from '../models/User';
import { verifyToken } from '../utils/auth';

interface SocketUser {
  userId: string;
  username: string;
  displayName: string;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

// Sample questions generator (for MVP - replace with actual quiz generation later)
function generateQuestions(settings: any) {
  const subjects = {
    Mathematics: [
      {
        id: 'math1',
        question: 'What is the Katapayadi value of "क" (ka)?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '1',
        subject: 'Mathematics',
        difficulty: settings.difficulty,
      },
      {
        id: 'math2',
        question: 'In Katapayadi system, what does "ट" (ṭa) represent?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        subject: 'Mathematics',
        difficulty: settings.difficulty,
      },
      {
        id: 'math3',
        question: 'What number does "प" (pa) stand for in Katapayadi?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '1',
        subject: 'Mathematics',
        difficulty: settings.difficulty,
      },
      {
        id: 'math4',
        question: 'Which consonant represents zero in Katapayadi system?',
        options: ['Vowels', 'क (ka)', 'All consonants', 'Only ह (ha)'],
        correctAnswer: 'Vowels',
        subject: 'Mathematics',
        difficulty: settings.difficulty,
      },
      {
        id: 'math5',
        question: 'In "भूतगणिता", what is the Katapayadi value?',
        options: ['432', '234', '324', '243'],
        correctAnswer: '432',
        subject: 'Mathematics',
        difficulty: settings.difficulty,
      },
    ],
    History: [
      {
        id: 'hist1',
        question: 'Which Indian mathematician developed the Katapayadi system?',
        options: ['Aryabhata', 'Brahmagupta', 'Haridatta', 'Bhaskara'],
        correctAnswer: 'Haridatta',
        subject: 'History',
        difficulty: settings.difficulty,
      },
      {
        id: 'hist2',
        question: 'In which century was the Katapayadi system first documented?',
        options: ['5th Century', '7th Century', '10th Century', '12th Century'],
        correctAnswer: '7th Century',
        subject: 'History',
        difficulty: settings.difficulty,
      },
      {
        id: 'hist3',
        question: 'Katapayadi system was primarily used for encoding:',
        options: ['Religious texts', 'Mathematical formulas', 'Astronomical data', 'All of these'],
        correctAnswer: 'All of these',
        subject: 'History',
        difficulty: settings.difficulty,
      },
      {
        id: 'hist4',
        question: 'Which dynasty patronized the use of Katapayadi in Kerala?',
        options: ['Chola', 'Pallava', 'Kulasekhara', 'Hoysala'],
        correctAnswer: 'Kulasekhara',
        subject: 'History',
        difficulty: settings.difficulty,
      },
      {
        id: 'hist5',
        question: 'Madhava of Sangamagrama used Katapayadi to encode:',
        options: ['Poetry', 'Pi value', 'Trigonometry', 'Calendar'],
        correctAnswer: 'Pi value',
        subject: 'History',
        difficulty: settings.difficulty,
      },
    ],
    Science: [
      {
        id: 'sci1',
        question: 'Katapayadi system uses which script?',
        options: ['Devanagari', 'Tamil', 'Malayalam', 'All Indian scripts'],
        correctAnswer: 'All Indian scripts',
        subject: 'Science',
        difficulty: settings.difficulty,
      },
      {
        id: 'sci2',
        question: 'How many consonants are used in the Katapayadi system?',
        options: ['25', '33', '36', '41'],
        correctAnswer: '33',
        subject: 'Science',
        difficulty: settings.difficulty,
      },
      {
        id: 'sci3',
        question: 'In Katapayadi, numbers are read in which direction?',
        options: ['Left to right', 'Right to left', 'Top to bottom', 'Bottom to top'],
        correctAnswer: 'Right to left',
        subject: 'Science',
        difficulty: settings.difficulty,
      },
      {
        id: 'sci4',
        question: 'What is unique about vowels in Katapayadi encoding?',
        options: ['They are ignored', 'They represent zero', 'They act as separators', 'Both A and B'],
        correctAnswer: 'Both A and B',
        subject: 'Science',
        difficulty: settings.difficulty,
      },
      {
        id: 'sci5',
        question: 'Katapayadi was used to memorize:',
        options: ['Multiplication tables', 'Astronomical constants', 'Chemical formulas', 'Medical terms'],
        correctAnswer: 'Astronomical constants',
        subject: 'Science',
        difficulty: settings.difficulty,
      },
    ],
  };

  const subjectQuestions = subjects[settings.subject as keyof typeof subjects] || subjects.Mathematics;
  const numQuestions = Math.min(settings.numberOfQuestions, subjectQuestions.length);
  
  // Shuffle and pick questions
  return subjectQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, numQuestions);
}

// Timer map to track active question timers and intervals
const questionTimers = new Map<string, NodeJS.Timeout>();
const timerIntervals = new Map<string, NodeJS.Timeout>();

// Broadcast timer updates every second
function broadcastTimer(io: SocketIOServer, roomCode: string, timePerQuestion: number, startTime: number) {
  // Clear existing interval
  const existingInterval = timerIntervals.get(roomCode);
  if (existingInterval) {
    clearInterval(existingInterval);
  }

  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = Math.max(0, timePerQuestion - elapsed);
    
    io.to(roomCode).emit('timer-update', { timeLeft });

    if (timeLeft <= 0) {
      const existingInterval = timerIntervals.get(roomCode);
      if (existingInterval) {
        clearInterval(existingInterval);
        timerIntervals.delete(roomCode);
      }
    }
  }, 1000);

  timerIntervals.set(roomCode, interval);
}

// Start question timer and auto-advance
async function startQuestionTimer(io: SocketIOServer, roomCode: string, timePerQuestion: number) {
  // Clear existing timer for this room
  const existingTimer = questionTimers.get(roomCode);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const startTime = Date.now();
  
  // Broadcast timer updates
  broadcastTimer(io, roomCode, timePerQuestion, startTime);

  const timer = setTimeout(async () => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room || room.status !== 'in-progress') return;

      // Show answer reveal period (3 seconds)
      io.to(roomCode).emit('question-ended', {
        correctAnswer: room.questions[room.currentQuestionIndex].correctAnswer,
      });

      // Wait 3 seconds before next question
      setTimeout(async () => {
        const nextIndex = room.currentQuestionIndex + 1;
        
        if (nextIndex >= room.questions.length) {
          // Game finished
          room.status = 'finished';
          room.finishedAt = new Date();
          await room.save();

          io.to(roomCode).emit('game-finished', {
            results: {
              players: room.players.sort((a, b) => b.score - a.score),
            },
          });

          questionTimers.delete(roomCode);
          
          // Clear timer interval
          const existingInterval = timerIntervals.get(roomCode);
          if (existingInterval) {
            clearInterval(existingInterval);
            timerIntervals.delete(roomCode);
          }
        } else {
          // Send next question
          room.currentQuestionIndex = nextIndex;
          await room.save();

          io.to(roomCode).emit('question-sent', {
            question: room.questions[nextIndex],
            questionIndex: nextIndex,
            timePerQuestion: room.settings?.timePerQuestion || 30,
          });

          // Start timer for next question
          startQuestionTimer(io, roomCode, timePerQuestion);
        }
      }, 3000);
    } catch (error) {
      console.error('Error in question timer:', error);
    }
  }, timePerQuestion * 1000);

  questionTimers.set(roomCode, timer);
}

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:9002',
        'http://localhost:9003',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      console.log('Socket.IO auth attempt, token received:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log('Socket.IO auth failed: No token');
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token) as any;
      
      if (!decoded) {
        console.log('Socket.IO auth failed: Invalid token (verification failed)');
        return next(new Error('Invalid token'));
      }
      
      console.log('Token decoded, userId:', decoded.userId);
      
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('Socket.IO auth failed: User not found for ID:', decoded.userId);
        return next(new Error('User not found'));
      }

      socket.user = {
        userId: (user as any)._id.toString(),
        username: (user as any).username,
        displayName: (user as any).displayName,
      };
      
      console.log('Socket.IO auth successful for user:', user.username);

      next();
    } catch (error) {
      console.error('Socket.IO auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: any) => {
    console.log(`🔌 User connected: ${socket.user.username}`);

    // Create Room
    socket.on('create-room', async (settings: any, callback: Function) => {
      try {
        let roomCode = (Room as any).generateRoomCode();
        
        // Ensure unique code
        let existingRoom = await Room.findOne({ roomCode });
        while (existingRoom) {
          roomCode = (Room as any).generateRoomCode();
          existingRoom = await Room.findOne({ roomCode });
        }

        const room = new Room({
          roomCode,
          hostId: socket.user.userId,
          players: [{
            userId: socket.user.userId,
            username: socket.user.username,
            displayName: socket.user.displayName,
            score: 0,
            ready: true, // Host is auto-ready
          }],
          settings: settings || {},
        });

        await room.save();
        
        socket.join(roomCode);
        
        callback({ success: true, roomCode, room });
        
        console.log(`🎮 Room created: ${roomCode} by ${socket.user.username}`);
      } catch (error: any) {
        console.error('Error creating room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Join Room
    socket.on('join-room', async (roomCode: string, callback: Function) => {
      try {
        const room = await Room.findOne({ roomCode, status: 'waiting' });
        
        if (!room) {
          return callback({ success: false, error: 'Room not found or already started' });
        }

        // Check if player already in room
        const existingPlayer = room.players.find(
          p => p.userId?.toString() === socket.user.userId
        );

        if (!existingPlayer) {
          room.players.push({
            userId: socket.user.userId as any,
            username: socket.user.username,
            displayName: socket.user.displayName,
            score: 0,
            ready: false,
            answers: [],
          });
          await room.save();
        }

        socket.join(roomCode);
        
        // Notify all players in room
        io.to(roomCode).emit('player-joined', {
          player: {
            userId: socket.user.userId,
            username: socket.user.username,
            displayName: socket.user.displayName,
            score: 0,
            ready: false,
          },
          room,
        });

        callback({ success: true, room });
        
        console.log(`👥 ${socket.user.username} joined room ${roomCode}`);
      } catch (error: any) {
        console.error('Error joining room:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Get Room Info
    socket.on('get-room', async (roomCode: string, callback: Function) => {
      try {
        const room = await Room.findOne({ roomCode });
        if (!room) {
          return callback({ success: false, error: 'Room not found' });
        }
        callback({ success: true, room });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    // Player Ready
    socket.on('player-ready', async (roomCode: string, callback: Function) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (!room) {
          return callback({ success: false, error: 'Room not found' });
        }

        const player = room.players.find(p => p.userId?.toString() === socket.user.userId);
        if (player) {
          player.ready = true;
          await room.save();
        }

        io.to(roomCode).emit('player-ready', { userId: socket.user.userId, room });
        
        callback({ success: true });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    // Start Game (host only)
    socket.on('start-game', async (roomCode: string, callback: Function) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (!room) {
          return callback({ success: false, error: 'Room not found' });
        }

        if (room.hostId.toString() !== socket.user.userId) {
          return callback({ success: false, error: 'Only host can start the game' });
        }

        // Check if all players are ready
        const allReady = room.players.every(p => p.ready);
        if (!allReady) {
          return callback({ success: false, error: 'Not all players are ready' });
        }

        room.status = 'starting';
        await room.save();

        // Emit countdown
        io.to(roomCode).emit('game-starting', { countdown: 3 });

        // Generate questions
        setTimeout(async () => {
          const questions = generateQuestions(room.settings);
          room.questions = questions as any;
          room.status = 'in-progress';
          room.currentQuestionIndex = 0;
          room.startedAt = new Date();
          await room.save();

          // Send first question with synchronized timing
          io.to(roomCode).emit('question-sent', {
            question: questions[0],
            questionIndex: 0,
            timePerQuestion: room.settings?.timePerQuestion || 30,
            serverTime: Date.now(), // For client sync
          });

          // Auto-advance to next question after time limit
          if (room.settings) {
            startQuestionTimer(io, roomCode, room.settings.timePerQuestion);
          }
        }, 3000);

        callback({ success: true });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    // Submit Answer
    socket.on('submit-answer', async (data: { roomCode: string, questionId: string, answer: string, timeSpent: number }, callback: Function) => {
      try {
        const room = await Room.findOne({ roomCode: data.roomCode });
        
        if (!room) {
          return callback({ success: false, error: 'Room not found' });
        }

        const player = room.players.find(p => p.userId?.toString() === socket.user.userId);
        const currentQuestion = room.questions[room.currentQuestionIndex];
        
        if (!player || !currentQuestion) {
          return callback({ success: false, error: 'Invalid state' });
        }

        // Check if player already answered this question
        const alreadyAnswered = player.answers.some(a => a.questionId === data.questionId);
        if (alreadyAnswered) {
          return callback({ success: false, error: 'Already answered' });
        }

        const isCorrect = data.answer === currentQuestion.correctAnswer;
        
        // Calculate score (bonus for speed)
        let points = 0;
        if (isCorrect && room.settings) {
          const timeBonus = Math.max(0, room.settings.timePerQuestion - data.timeSpent);
          points = 100 + Math.floor(timeBonus * 2); // Base 100 + time bonus
        }

        player.answers.push({
          questionId: data.questionId,
          answer: data.answer,
          correct: isCorrect,
          timeSpent: data.timeSpent,
        });
        player.score += points;

        await room.save();

        // Broadcast to all players in room (including sender)
        io.to(data.roomCode).emit('answer-submitted', {
          userId: socket.user.userId,
          username: socket.user.username,
          correct: isCorrect,
          points,
          totalScore: player.score,
        });

        // Send updated room state
        io.to(data.roomCode).emit('room-updated', { room });

        callback({ success: true, correct: isCorrect, points });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    });

    // Leave Room
    socket.on('leave-room', async (roomCode: string) => {
      try {
        const room = await Room.findOne({ roomCode });
        
        if (room) {
          // Remove player from room
          const playerIndex = room.players.findIndex(p => p.userId?.toString() === socket.user.userId);
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
          }
          
          // If host left, assign new host or delete room
          if (room.hostId.toString() === socket.user.userId) {
            if (room.players.length > 0) {
              room.hostId = room.players[0].userId as any;
            } else {
              await Room.deleteOne({ roomCode });
              return;
            }
          }

          await room.save();
          
          socket.leave(roomCode);
          io.to(roomCode).emit('player-left', { userId: socket.user.userId, room });
        }
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);
    });
  });

  console.log('✅ Socket.IO server initialized');
  
  return io;
}
