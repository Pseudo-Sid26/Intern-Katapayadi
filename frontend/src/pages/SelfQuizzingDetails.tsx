import { useParams, Link } from 'react-router-dom';
import { PuzzleClient } from "@/components/puzzle-client";
import { Gamepad2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const puzzles: Record<string, { id: string; question: string; options: string[], correctAnswer: string; solutionWord: string }> = {
    '1': { id: '1', question: 'This is a sample question for the self-quizzing mode. What is 2+2?', options: ['2', '3', '4', '5'], correctAnswer: '4', solutionWord: 'Four' },
    '2': { id: '2', question: 'Another sample question. What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris', solutionWord: 'Paris' },
    '3': { id: '3', question: 'This is a Katapayadi related question. The first three syllables of his name in Sanskrit (कृ ष् ण) correspond to what number in the Katapayadi system?', options: ['56', '65', '46', '64'], correctAnswer: '56', solutionWord: 'Krishna' },
}

export default function SelfQuizzingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const puzzle = puzzles[id || '1'];
  
  if (!puzzle) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold">Puzzle not found</h1>
        <Button asChild className="mt-4">
          <Link to="/self-quizzing">Back to Self Quizzing</Link>
        </Button>
      </div>
    );
  }

  const nextId = parseInt(id || '1') + 1;
  const hasNext = puzzles[nextId.toString()];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Gamepad2 className="h-10 w-10 text-primary" />
          Self Quizzing - Question {id}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Test your knowledge and sharpen your skills.
        </p>
      </header>
      <PuzzleClient puzzle={puzzle} />
      <div className="mt-4 flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link to="/self-quizzing">Back</Link>
        </Button>
        {hasNext && (
          <Button asChild>
            <Link to={`/self-quizzing/${nextId}`}>Next Question</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
