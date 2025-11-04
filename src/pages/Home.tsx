import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Users, Gamepad2, BarChart, BookOpen, User } from 'lucide-react';

const features = [
  {
    title: 'Self Quizzing',
    description: 'Test your knowledge on various subjects with timed quizzes and Katapayadi challenges.',
    link: '/self-quizzing',
    icon: Gamepad2,
  },
  {
    title: 'Multiplayer',
    description: 'Challenge friends or other players in real-time quiz battles and climb the ranks.',
    link: '/multiplayer',
    icon: Users,
  },
  {
    title: 'Brain Enhancement',
    description: 'Sharpen your mind with memory games, logic puzzles, and symbol decoding.',
    link: '/brain-enhancement',
    icon: BrainCircuit,
  },
  {
    title: 'Leaderboard',
    description: 'See how you stack up against other players. Filter by score, age, and category.',
    link: '/leaderboard',
    icon: BarChart,
  },
  {
    title: 'Encoding Charts',
    description: 'Learn the Katapayadi system with interactive visual charts and examples.',
    link: '/encoding-charts',
    icon: BookOpen,
  },
  {
    title: 'Your Profile',
    description: 'View your progress, including scores, badges, streaks, and game history.',
    link: '/profile',
    icon: User,
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 text-primary">Katapayadi Detectives</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          A gamified educational platform to learn, compete, and enhance your skills with a touch of Indian culture.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={feature.link}>
                    Explore
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
