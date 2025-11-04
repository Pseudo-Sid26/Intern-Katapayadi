import { useParams } from 'react-router-dom';
import { PuzzleClient } from "@/components/puzzle-client";
import { Puzzle } from 'lucide-react';

const puzzles: Record<string, { id: string; question: string; options: string[], correctAnswer: string; solutionWord: string }> = {
    '1': { id: '1', question: 'Sample puzzle question #1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', solutionWord: 'Answer' },
    '2': { id: '2', question: 'Sample puzzle question #2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', solutionWord: 'Solution' },
}

export default function PuzzlesPage() {
  const { id } = useParams<{ id: string }>();
  const puzzle = puzzles[id || '1'];

  if (!puzzle) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold">Puzzle not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Puzzle className="h-10 w-10 text-primary" />
          Puzzle #{id}
        </h1>
      </header>
      <PuzzleClient puzzle={puzzle} />
    </div>
  );
}
