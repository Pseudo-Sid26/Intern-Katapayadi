import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { socketService } from '@/services/socketClient';
import { useAuth } from '@/contexts/AuthContext';
import { Timer, Users, Trophy, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  difficulty: string;
}

interface Player {
  userId: string;
  username: string;
  displayName: string;
  score: number;
  ready: boolean;
  answers: Array<{
    questionId: string;
    answer: string;
    correct: boolean;
    timeSpent: number;
  }>;
}

interface MultiplayerGameProps {
  room: any;
  onGameEnd: () => void;
}

export function MultiplayerGame({ room, onGameEnd }: MultiplayerGameProps) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(room.settings.timePerQuestion);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{ correct: boolean; points: number } | null>(null);
  const [players, setPlayers] = useState<Player[]>(room.players || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showAnswerReveal, setShowAnswerReveal] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [nextQuestionIn, setNextQuestionIn] = useState(0);

  useEffect(() => {
    // Listen for game events
    const handleQuestionSent = (data: { question: Question; questionIndex: number; serverTime?: number }) => {
      console.log('New question received:', data);
      setCurrentQuestion(data.question);
      setCurrentQuestionIndex(data.questionIndex);
      setSelectedAnswer('');
      setHasAnswered(false);
      setAnswerFeedback(null);
      setShowAnswerReveal(false);
      setCorrectAnswer('');
      setTimeLeft(room.settings.timePerQuestion);
      setQuestionStartTime(data.serverTime || Date.now());
    };

    const handleTimerUpdate = (data: { timeLeft: number }) => {
      setTimeLeft(data.timeLeft);
    };

    const handleQuestionEnded = (data: { correctAnswer: string }) => {
      console.log('Question ended, correct answer:', data.correctAnswer);
      setShowAnswerReveal(true);
      setCorrectAnswer(data.correctAnswer);
      setNextQuestionIn(3);
      
      // Countdown for next question
      const countdownInterval = setInterval(() => {
        setNextQuestionIn((prev: number) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handlePlayerAnswered = (data: { userId: string; username: string; correct: boolean; points: number; totalScore: number }) => {
      console.log('Player answered:', data);
      // Update player scores in real-time
      setPlayers(prev =>
        prev.map(p =>
          p.userId === data.userId
            ? { ...p, score: data.totalScore }
            : p
        )
      );
    };

    const handleRoomUpdated = (data: { room: any }) => {
      console.log('Room updated:', data);
      setPlayers(data.room.players);
    };

    const handleGameFinished = (data: { results: any }) => {
      console.log('Game finished:', data);
      setGameFinished(true);
      setPlayers(data.results.players);
    };

    const socket = socketService.getSocket();
    if (socket) {
      socket.on('question-sent', handleQuestionSent);
      socket.on('timer-update', handleTimerUpdate);
      socket.on('question-ended', handleQuestionEnded);
      socket.on('answer-submitted', handlePlayerAnswered);
      socket.on('room-updated', handleRoomUpdated);
      socket.on('game-finished', handleGameFinished);
    }

    return () => {
      if (socket) {
        socket.off('question-sent', handleQuestionSent);
        socket.off('timer-update', handleTimerUpdate);
        socket.off('question-ended', handleQuestionEnded);
        socket.off('answer-submitted', handlePlayerAnswered);
        socket.off('room-updated', handleRoomUpdated);
        socket.off('game-finished', handleGameFinished);
      }
    };
  }, [room.settings.timePerQuestion]);

  // Timer countdown - now controlled by server
  useEffect(() => {
    if (hasAnswered || !currentQuestion || gameFinished || showAnswerReveal) return;

    // Only auto-submit if timer reaches 0
    if (timeLeft === 0 && !hasAnswered) {
      handleSubmitAnswer('');
    }
  }, [timeLeft, hasAnswered, currentQuestion, gameFinished, showAnswerReveal]);

  const handleSubmitAnswer = async (answer: string) => {
    if (hasAnswered || !currentQuestion) return;

    setHasAnswered(true);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    const result = await socketService.submitAnswer(
      room.roomCode,
      currentQuestion.id,
      answer,
      timeSpent
    );

    if (result.success) {
      setAnswerFeedback({
        correct: result.correct || false,
        points: result.points || 0,
      });
    }
  };

  if (gameFinished) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const currentPlayer = sortedPlayers.find(p => p.userId === user?.id);
    const rank = sortedPlayers.findIndex(p => p.userId === user?.id) + 1;

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <CardTitle className="text-3xl">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
              <p className="text-lg text-muted-foreground mb-2">Your Rank</p>
              <p className="text-5xl font-bold text-orange-600">#{rank}</p>
              <p className="text-2xl font-semibold mt-2">{currentPlayer?.score || 0} points</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Final Leaderboard
              </h3>
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      player.userId === user?.id
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold w-8">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && `#${index + 1}`}
                      </div>
                      <div>
                        <p className="font-semibold">{player.displayName || player.username}</p>
                        <p className="text-sm text-muted-foreground">@{player.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">{player.score}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onGameEnd} className="flex-1" size="lg">
                Back to Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold mb-4">Get Ready!</h2>
          <p className="text-muted-foreground">First question loading...</p>
        </div>
      </div>
    );
  }

  // Answer reveal period
  if (showAnswerReveal) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-2 border-orange-500">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Time's Up!</CardTitle>
            <div className="flex items-center justify-center gap-2 text-xl">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <span>Correct Answer: <strong className="text-green-700">{correctAnswer}</strong></span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-2xl font-semibold mb-2">Next question in...</p>
              <p className="text-6xl font-bold text-orange-600">{nextQuestionIn}</p>
            </div>
            
            {/* Live Scoreboard during transition */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Current Standings
              </h3>
              <div className="space-y-2">
                {[...players].sort((a, b) => b.score - a.score).map((player, index) => (
                  <div
                    key={player.userId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.userId === user?.id ? 'bg-orange-100 border-2 border-orange-400' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg w-8">#{index + 1}</span>
                      <span className="font-medium">{player.displayName || player.username}</span>
                    </div>
                    <span className="font-bold text-xl text-orange-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header with scores */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Question {currentQuestionIndex + 1} / {room.settings.numberOfQuestions}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="text-2xl font-bold text-orange-600">
              {players.find(p => p.userId === user?.id)?.score || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Timer */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span className="font-semibold">Time Remaining</span>
            </div>
            <span className="text-2xl font-bold">{timeLeft}s</span>
          </div>
          <Progress
            value={(timeLeft / room.settings.timePerQuestion) * 100}
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge>{currentQuestion.subject}</Badge>
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
          </div>
          <CardTitle className="text-2xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = showAnswerReveal && option === correctAnswer;
            const isWrongSelection = showAnswerReveal && isSelected && option !== correctAnswer;
            
            return (
              <Button
                key={index}
                variant={isSelected && !showAnswerReveal ? 'default' : 'outline'}
                className={`w-full h-auto py-4 px-6 text-left justify-start text-base transition-all ${
                  isCorrectAnswer
                    ? 'bg-green-100 border-green-500 hover:bg-green-100'
                    : isWrongSelection
                    ? 'bg-red-100 border-red-500 hover:bg-red-100'
                    : isSelected
                    ? 'bg-orange-100 border-orange-500'
                    : ''
                }`}
                onClick={() => {
                  if (!hasAnswered && !showAnswerReveal) {
                    setSelectedAnswer(option);
                    handleSubmitAnswer(option);
                  }
                }}
                disabled={hasAnswered || showAnswerReveal}
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                  </span>
                  {isCorrectAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {isWrongSelection && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </Button>
            );
          })}

          {hasAnswered && answerFeedback && (
            <div className={`mt-4 p-4 rounded-lg ${
              answerFeedback.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-semibold ${answerFeedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                {answerFeedback.correct ? '✓ Correct!' : '✗ Wrong Answer'}
              </p>
              <p className="text-sm mt-1">
                {answerFeedback.correct 
                  ? `You earned ${answerFeedback.points} points!` 
                  : `Correct answer: ${currentQuestion.correctAnswer}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Scoreboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Scoreboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...players].sort((a, b) => b.score - a.score).map((player, index) => {
              const hasAnsweredThisQ = player.answers.length > currentQuestionIndex;
              
              return (
                <div
                  key={player.userId}
                  className={`flex items-center justify-between p-3 rounded ${
                    player.userId === user?.id ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg w-6">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.displayName || player.username}</span>
                      {hasAnsweredThisQ && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-orange-600">{player.score}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
