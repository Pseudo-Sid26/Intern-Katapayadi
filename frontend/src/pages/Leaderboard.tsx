import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const players = [
  { rank: 1, name: 'Siddhesh', score: 12580, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'smiling man', ageGroup: 'teen' },
  { rank: 2, name: 'Arya', score: 11230, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'smiling woman', ageGroup: 'teen' },
  { rank: 3, name: 'Rohan', score: 9870, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'man thinking', ageGroup: 'kid' },
  { rank: 4, name: 'Priya', score: 8540, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman looking', ageGroup: 'adult' },
  { rank: 5, name: 'Karan', score: 7650, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'man with glasses', ageGroup: 'teen' },
  { rank: 6, name: 'Anika', score: 6990, avatar: 'https://placehold.co/40x40.png', dataAiHint: 'woman portrait', ageGroup: 'kid' },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <BarChart className="h-10 w-10 text-primary" />
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          See who is leading the pack. Can you make it to the top?
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Players</CardTitle>
          <CardDescription>Players are ranked based on their total score across all games.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Age Group</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.name} className="hover:bg-primary/10">
                  <TableCell className="font-bold text-2xl text-primary flex items-center gap-2">
                    <Trophy className={`w-6 h-6 ${player.rank <=3 ? 'text-yellow-500' : 'text-muted-foreground' }`}/> 
                    {player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={player.avatar} alt={player.name} data-ai-hint={player.dataAiHint} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-headline text-xl">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize px-2 py-1 rounded-full bg-muted text-muted-foreground">{player.ageGroup}</span>
                  </TableCell>
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
