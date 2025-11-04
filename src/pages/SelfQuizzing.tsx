import { useState, useEffect } from 'react';
import { PuzzleClient } from "@/components/puzzle-client";
import { Gamepad2, Loader2, Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiClient, QuizQuestion } from "@/services/apiClient";
import { authClient } from "@/services/authClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SelfQuizzingPage() {
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizQuestion[]>([]);
  
  // Quiz statistics for session
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  
  // Quiz configuration
  const [subject, setSubject] = useState<string>('maths');
  const [classNum, setClassNum] = useState<string>('5');
  const [difficulty, setDifficulty] = useState<string>('medium');

  // Check backend connection on mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      setInitializing(true);
      await apiClient.healthCheck();
      setBackendStatus('online');
      
      // Get RAG stats
      const stats = await apiClient.getStats();
      
      toast({
        title: "Backend Connected",
        description: `Loaded ${stats.totalChunks} chunks across ${stats.subjects.length} subjects`,
      });
      
      setInitializing(false);
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('offline');
      toast({
        title: "Backend Offline",
        description: "Please start the backend server on port 5000",
        variant: "destructive",
      });
      setInitializing(false);
    }
  };

  const generateNewQuestion = async () => {
    if (backendStatus === 'offline') {
      toast({
        title: "Backend Offline",
        description: "Please start the backend server first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Clear current question immediately to show loading state
      setCurrentQuestion(null);
      
      const questions = await apiClient.generateQuiz({
        subject: subject as any,
        class: parseInt(classNum),
        difficulty: difficulty as any,
        numberOfQuestions: 1,
      });

      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
        setQuizHistory(prev => [...prev, questions[0]]);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert QuizQuestion to puzzle format
  const convertToPuzzle = (question: QuizQuestion) => ({
    id: question.id,
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    solutionWord: question.explanation,
  });

  if (initializing) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-headline">Connecting to Backend...</h2>
          <p className="text-muted-foreground">Checking server status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
              <Gamepad2 className="h-10 w-10 text-primary" />
              Self Quizzing - RAG Powered
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              AI-generated questions based on NCERT textbooks (Classes 1-10)
            </p>
          </div>
          <Badge 
            variant={backendStatus === 'online' ? 'default' : 'destructive'}
            className="flex items-center gap-2"
          >
            {backendStatus === 'online' ? (
              <>
                <Wifi className="h-4 w-4" />
                Backend Online
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                Backend Offline
              </>
            )}
          </Badge>
        </div>
      </header>

      {/* Configuration Panel */}
      <Card className="mb-6 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quiz Configuration
          </CardTitle>
          <CardDescription>
            Customize your quiz based on NCERT curriculum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maths">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={classNum} onValueChange={setClassNum}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      Class {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              onClick={generateNewQuestion} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Question...
                </>
              ) : (
                'Generate New Question'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && !loading && (
        <div className="mb-6">
          <PuzzleClient 
            puzzle={convertToPuzzle(currentQuestion)} 
            onNextQuestion={generateNewQuestion}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="bg-card/80 backdrop-blur-sm mb-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <h3 className="text-xl font-headline mb-2">Generating Question...</h3>
            <p className="text-muted-foreground">
              AI is creating a new question from NCERT content
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Question State */}
      {!currentQuestion && !loading && (
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-headline mb-2">Ready to Start!</h3>
            <p className="text-muted-foreground mb-4">
              Click "Generate New Question" to begin your quiz
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quiz History */}
      {quizHistory.length > 1 && (
        <div className="mt-6">
          <h3 className="text-xl font-headline mb-3">Previous Questions ({quizHistory.length - 1})</h3>
          <div className="flex gap-2 flex-wrap">
            {quizHistory.slice(0, -1).reverse().map((q, idx) => (
              <Button
                key={q.id}
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuestion(q)}
              >
                Question {quizHistory.length - idx - 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
