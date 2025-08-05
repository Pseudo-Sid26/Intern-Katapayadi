import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scroll, Trophy } from 'lucide-react';
import Image from 'next/image';

const dynasties = [
  { rank: 1, name: 'Maurya', glory: 125800, banner: 'https://placehold.co/40x40.png', dataAiHint: 'mauryan emblem', color: 'bg-amber-500' },
  { rank: 2, name: 'Gupta', glory: 112300, banner: 'https://placehold.co/40x40.png', dataAiHint: 'gupta emblem', color: 'bg-yellow-500' },
  { rank: 3, name: 'Chola', glory: 98700, banner: 'https://placehold.co/40x40.png', dataAiHint: 'chola emblem', color: 'bg-orange-600' },
  { rank: 4, name: 'Pandya', glory: 85400, banner: 'https://placehold.co/40x40.png', dataAiHint: 'pandya emblem', color: 'bg-blue-600' },
  { rank: 5, name: 'Chalukya', glory: 76500, banner: 'https://placehold.co/40x40.png', dataAiHint: 'chalukya emblem', color: 'bg-green-600' },
  { rank: 6, name: 'Pala', glory: 69900, banner: 'https://placehold.co/40x40.png', dataAiHint: 'pala emblem', color: 'bg-purple-600' },
];

export default function DynastyLedgerPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Scroll className="h-10 w-10 text-primary" />
          Dynasty Ledger
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          The annals of glory, where the tales of great dynasties are etched for eternity.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Most Glorious Dynasties</CardTitle>
          <CardDescription>The collective scores from all games contribute to a dynasty's total glory.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Dynasty</TableHead>
                <TableHead className="text-right">Total Glory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynasties.map((dynasty) => (
                <TableRow key={dynasty.name} className="hover:bg-primary/10">
                  <TableCell className="font-bold text-2xl text-primary">{dynasty.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-10 rounded-full ${dynasty.color}`}></div>
                      <span className="font-headline text-xl">{dynasty.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xl">{dynasty.glory.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
