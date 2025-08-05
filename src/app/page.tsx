import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, Swords, Trophy, ScanQrCode } from 'lucide-react';

const features = [
  {
    title: 'Puzzle Interface',
    description: 'Engage with Katapayadi puzzles, test your knowledge, and get feedback on your answers.',
    link: '/puzzles/1',
    icon: Swords,
  },
  {
    title: 'Dynasty Ledger',
    description: 'Track the collective scores of different Indian dynasties on a global leaderboard.',
    link: '/dynasties',
    icon: Trophy,
  },
  {
    title: 'Artifact Vault',
    description: 'Explore a personal gallery of 3D models of historical artifacts you have collected.',
    link: '/artifacts',
    icon: Gem,
  },
  {
    title: 'Map Scanner',
    description: 'Scan QR codes on physical map fragments to unlock new digital puzzles and content.',
    link: '/scan',
    icon: ScanQrCode,
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold mb-4 text-primary">Indi-Puzzler</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          An epic puzzle adventure through the rich history and culture of ancient India. Embark on a journey of discovery, unlock ancient secrets, and claim glory for your dynasty.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
                  <Link href={feature.link}>
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
