import { PuzzleClient } from "@/components/puzzle-client";
import { Gamepad2 } from 'lucide-react';
import Link from "next/link";
import {Button} from "@/components/ui/button";

const puzzles: Record<string, { id: string; question: string; options: string[], correctAnswer: string; solutionWord: string }> = {
    '1': { id: '1', question: 'This is a sample question for the self-quizzing mode. What is 2+2?', options: ['2', '3', '4', '5'], correctAnswer: '4', solutionWord: 'Four' },
    '2': { id: '2', question: 'Another sample question. What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris', solutionWord: 'Paris' },
    '3': { id: '3', question: 'This is a Katapayadi related question. The first three syllables of his name in Sanskrit (कृ ष् ण) correspond to what number in the Katapayadi system?', options: ['56', '65', '46', '64'], correctAnswer: '56', solutionWord: 'Krishna' },
}

// Since we don't have routing for this page yet, we'll just use a default puzzle.
// This would be replaced with dynamic routes like /self-quizzing/[id]
export default function SelfQuizzingPage() {
  const puzzle = puzzles['1'];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Gamepad2 className="h-10 w-10 text-primary" />
          Self Quizzing
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Test your knowledge and sharpen your skills.
        </p>
      </header>
      <PuzzleClient puzzle={puzzle} />
        <div className="mt-4 flex justify-center gap-4">
            <Button asChild>
                <Link href="/self-quizzing/2">Next Question</Link>
            </Button>
        </div>
    </div>
  );
}
