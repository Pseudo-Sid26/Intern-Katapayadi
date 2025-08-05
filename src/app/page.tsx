import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

const gameModes = [
  {
    title: 'Bharatavarsha Chronicles',
    description: 'A co-operative campaign to piece together the map of ancient India and uncover its history.',
    link: '/puzzles/1',
  },
  {
    title: 'The Battle of Wits',
    description: 'A competitive game where two teams, aligned with rival dynasties, race to solve the same puzzle.',
    link: '/puzzles/2',
  },
  {
    title: 'The Lost Sutra',
    description: 'An escape room style DigiPhysical adventure to solve digital puzzles and unlock a physical object.',
    link: '/puzzles/3',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 text-primary">Welcome to Indi-Puzzler</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Embark on a journey through time, solving ancient riddles and uncovering the rich tapestry of Indian history. Choose your path and let the adventure begin!
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gameModes.map((mode) => (
            <Card key={mode.title} className="flex flex-col hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{mode.title}</CardTitle>
                <CardDescription className="pt-2">{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={mode.link}>
                    <Icons.puzzle className="mr-2 h-4 w-4" />
                    Begin Adventure
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
