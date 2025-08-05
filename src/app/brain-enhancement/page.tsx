import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function BrainEnhancementPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <BrainCircuit className="h-10 w-10 text-primary" />
          Brain Enhancement
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Engage in puzzles and games designed to boost your cognitive skills.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Mini-Games</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page will host various brain-training mini-games like memory matching and logic puzzles.</p>
        </CardContent>
      </Card>
    </div>
  );
}
