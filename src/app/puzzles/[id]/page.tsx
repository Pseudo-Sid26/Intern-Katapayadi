import { PuzzleClient } from "@/components/puzzle-client";
import { Swords } from 'lucide-react';

const puzzles = {
    '1': { id: '1', question: 'In the great epics, he is the charioteer of Arjuna. The first three syllables of his name in Sanskrit (कृ ष् ण) correspond to what number in the Katapayadi system?', solution: '56', solutionWord: 'Krishna' },
    '2': { id: '2', question: 'This Mauryan emperor\'s name (अ शो क) contains a number. What is it?', solution: '82', solutionWord: 'Ashoka' },
    '3': { id: '3', question: 'The number of primary Vedas. Its representation (च त्व र) in Katapayadi is what?', solution: '4', solutionWord: 'Chatvara' },
}

export default function PuzzlePage({ params }: { params: { id: string } }) {
  const puzzle = puzzles[params.id as keyof typeof puzzles] || puzzles['1'];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Swords className="h-10 w-10 text-primary" />
          The Puzzle Chamber
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Decode the ancient verses. Your wits are your sharpest blade.
        </p>
      </header>
      <PuzzleClient puzzle={puzzle} />
    </div>
  );
}
