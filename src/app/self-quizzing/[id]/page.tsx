import { PuzzleClient } from "@/components/puzzle-client";
import { Gamepad2 } from 'lucide-react';
import Link from "next/link";
import {Button} from "@/components/ui/button";

const puzzles: Record<string, { id: string; question: string; options: string[], correctAnswer: string; solutionWord: string }> = {
    '1': { id: '1', question: 'Which dynasty was responsible for the construction of the Ajanta Caves?', options: ['Maurya', 'Gupta', 'Chola', 'Mughal'], correctAnswer: 'Gupta', solutionWord: 'Gupta' },
    '2': { id: '2', question: 'What is the capital of the Mauryan Empire?', options: ['Pataliputra', 'Taxila', 'Ujjain', 'Varanasi'], correctAnswer: 'Pataliputra', solutionWord: 'Pataliputra' },
    '3': { id: '3', question: 'The number for "na" is 0 and "ya" is 1. In the Katapayadi system, what number does "naya" represent when read from right to left?', options: ['10', '01', '1', '11'], correctAnswer: '10', solutionWord: 'Ten' },
}

export default function SelfQuizzingPage({ params }: { params: { id: string } }) {
  const puzzle = puzzles[params.id as keyof typeof puzzles] || puzzles['1'];
  const nextPuzzleId = (parseInt(params.id, 10) % Object.keys(puzzles).length) + 1;


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
          <Link href={`/self-quizzing/${nextPuzzleId}`}>Next Question</Link>
        </Button>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(puzzles).map((id) => ({
    id,
  }))
}
