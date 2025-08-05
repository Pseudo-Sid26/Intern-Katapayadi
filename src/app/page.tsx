import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Dices } from 'lucide-react';

const gameModes = [
  {
    title: 'Self Quizzing',
    description: 'Challenge yourself with quizzes on various topics to test and expand your knowledge.',
    link: '/puzzles/1',
    icon: Dices,
  },
  {
    title: 'Multiplayer',
    description: 'Compete with friends or other players in real-time quiz battles to see who reigns supreme.',
    link: '#',
    icon: Users,
  },
  {
    title: 'Brain Enhancement',
    description: 'Engage in games and puzzles designed to improve your cognitive skills and enhance memory.',
    link: '#',
    icon: Brain,
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 text-primary">Welcome to the Brain Arena</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose your challenge, test your knowledge, and enhance your cognitive skills. Let the games begin!
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gameModes.map((mode) => (
            <Card key={mode.title} className="flex flex-col hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <mode.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-2xl">{mode.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={mode.link}>
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
