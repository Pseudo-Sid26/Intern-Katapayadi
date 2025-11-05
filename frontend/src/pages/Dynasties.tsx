import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown } from 'lucide-react';

export default function DynastiesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Crown className="h-10 w-10 text-primary" />
          Dynasty Ledger
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Collective scores and rankings of different Indian dynasties.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Dynasty Rankings</CardTitle>
          <CardDescription>See which dynasty is dominating the leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Dynasty leaderboard and team competitions will be implemented here!</p>
        </CardContent>
      </Card>
    </div>
  );
}
