'use client';

import { useState, useEffect } from 'react';
import { generateOracleHint } from '@/ai/flows/oracle-hint-generator';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb, CheckCircle, XCircle, Loader2, Timer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Puzzle = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solutionWord: string;
};

type PuzzleClientProps = {
  puzzle: Puzzle;
};

const QUIZ_DURATION = 30; // 30 seconds

export function PuzzleClient({ puzzle }: PuzzleClientProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const isQuizOver = feedback !== null || isTimeUp;

  useEffect(() => {
    // Reset state when puzzle changes
    setFeedback(null);
    setSelectedAnswer(null);
    setHint(null);
    setTimeLeft(QUIZ_DURATION);
    setIsTimeUp(false);
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          setFeedback({ type: 'error', message: "Time's up! The correct answer was " + puzzle.correctAnswer });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [puzzle]);

  useEffect(() => {
    if (isQuizOver) {
      // Stop the timer
      const newTimeLeft = timeLeft;
      setTimeLeft(newTimeLeft);
    }
  }, [isQuizOver, timeLeft]);

  function handleAnswerClick(answer: string) {
    if (isQuizOver) return;
    
    setSelectedAnswer(answer);
    if (answer === puzzle.correctAnswer) {
      setFeedback({ type: 'success', message: `Correct! The solution word is "${puzzle.solutionWord}".` });
    } else {
      setFeedback({ type: 'error', message: `Incorrect. The correct answer is "${puzzle.correctAnswer}".` });
    }
  }

  async function getHint() {
    if (hint) return;
    setIsHintLoading(true);
    setHint(null);
    try {
      const result = await generateOracleHint({ puzzleSolution: puzzle.solutionWord });
      setHint(result.hint);
    } catch (error) {
      console.error('Error getting hint:', error);
      setHint('The Oracle is silent at this moment. Perhaps try again later.');
    } finally {
      setIsHintLoading(false);
    }
  }

  const getButtonClass = (option: string) => {
    if (!isQuizOver) {
      return 'bg-muted/50 hover:bg-muted';
    }
    if (option === puzzle.correctAnswer) {
      return 'bg-green-500/80 hover:bg-green-500/90 text-white';
    }
    if (option === selectedAnswer && option !== puzzle.correctAnswer) {
      return 'bg-destructive/80 hover:bg-destructive/90 text-white';
    }
    return 'bg-muted/30';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Katapayadi Puzzle #{puzzle.id}</CardTitle>
        <div className="flex items-center gap-4 pt-4">
          <Timer className="h-6 w-6 text-primary" />
          <Progress value={(timeLeft / QUIZ_DURATION) * 100} className="w-full h-3" />
          <span className="font-mono text-lg font-bold">{timeLeft}s</span>
        </div>
        <CardDescription className="text-base pt-4">{puzzle.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {puzzle.options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="lg"
              disabled={isQuizOver}
              onClick={() => handleAnswerClick(option)}
              className={cn(
                "text-lg h-auto py-4 justify-start text-left whitespace-normal",
                getButtonClass(option)
              )}
            >
              {option}
            </Button>
          ))}
        </div>
        {feedback && (
          <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'} className="mt-6 bg-opacity-20">
            {feedback.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{feedback.type === 'success' ? 'Success!' : 'Incorrect'}</AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-4 pt-6">
         <Separator className="my-2" />
         <Dialog>
            <DialogTrigger asChild>
              <Button type="button" size="lg" variant="outline" className="flex-1" onClick={getHint}>
                <Lightbulb className="mr-2 h-4 w-4" />
                Consult the Oracle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline flex items-center gap-2 text-2xl">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  The Oracle Speaks
                </DialogTitle>
                <DialogDescription>
                  The Oracle offers a riddle to guide you. Answering it may reveal a clue to the puzzle's solution word.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 min-h-[10rem] flex items-center justify-center">
                {isHintLoading && (
                  <div className="flex flex-col items-center justify-center h-24 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">The Oracle is consulting the cosmos...</p>
                  </div>
                )}
                {hint && <p className="text-xl italic text-center text-foreground/90">"{hint}"</p>}
              </div>
            </DialogContent>
          </Dialog>
      </CardFooter>
    </Card>
  );
}
