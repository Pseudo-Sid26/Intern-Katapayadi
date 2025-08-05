import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem } from 'lucide-react';

const artifacts = [
  { id: '1', name: 'Sarnath Lion Capital', region: 'Magadha', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'lion capital' },
  { id: '2', name: 'Chola Bronze Statue', region: 'Chola Nadu', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'bronze statue' },
  { id: '3', name: 'Harappan Seal', region: 'Indus Valley', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'harappan seal' },
  { id: '4', name: 'Ajanta Cave Painting', region: 'Vakataka', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'cave painting' },
  { id: '5', name: 'Mughal Miniature', region: 'Mughal Empire', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'mughal miniature' },
  { id: '6', name: 'Konark Wheel', region: 'Kalinga', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'konark wheel' },
];

export default function ArtifactVaultPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Gem className="h-10 w-10 text-primary" />
          Artifact Vault
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A collection of treasures unearthed from the annals of time.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artifacts.map((artifact) => (
          <Link href={`/artifacts/${artifact.id}`} key={artifact.id}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={artifact.imageUrl}
                    alt={artifact.name}
                    width={400}
                    height={300}
                    data-ai-hint={artifact.dataAiHint}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline text-xl">{artifact.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{artifact.region}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
