import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from 'lucide-react';

const dynasties = [
  { rank: 1, name: 'Mauryas', glory: 12580 },
  { rank: 2, name: 'Guptas', glory: 11230 },
  { rank: 3, name: 'Cholas', glory: 9870 },
  { rank: 4, name: 'Mughals', glory: 8540 },
  { rank: 5, name: 'Marathas', glory: 7650 },
  { rank: 6, name: 'Vijayanagara', glory: 6990 },
];

export default function DynastyLedgerPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Users className="h-10 w-10 text-primary" />
          Dynasty Ledger
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          The scrolls of history record the glory of the great dynasties.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Current Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Dynasty</TableHead>
                <TableHead className="text-right">Glory Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynasties.map((dynasty) => (
                <TableRow key={dynasty.name} className="hover:bg-primary/10">
                  <TableCell className="font-medium text-2xl text-primary">{dynasty.rank}</TableCell>
                  <TableCell className="font-headline text-xl">{dynasty.name}</TableCell>
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
