import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from 'lucide-react';

const players = [
  { rank: 1, name: 'Arya', score: 12580 },
  { rank: 2, name: 'Bodhi', score: 11230 },
  { rank: 3, name: 'Chandra', score: 9870 },
  { rank: 4, name: 'Deva', score: 8540 },
  { rank: 5, name: 'Eesha', score: 7650 },
  { rank: 6, name: 'Farhan', score: 6990 },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Trophy className="h-10 w-10 text-primary" />
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          See who is leading the charge in the pursuit of knowledge.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.name} className="hover:bg-primary/10">
                  <TableCell className="font-medium text-2xl text-primary">{player.rank}</TableCell>
                  <TableCell className="font-headline text-xl">{player.name}</TableCell>
                  <TableCell className="text-right font-mono text-xl">{player.score.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
