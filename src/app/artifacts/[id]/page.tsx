import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, History } from 'lucide-react';

const artifactsData = {
  '1': { id: '1', name: 'Sarnath Lion Capital', region: 'Magadha', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'sarnath capital', description: 'The Lion Capital of Ashoka is a sculpture of four Asiatic lions standing back to back, on an elaborate base that includes other animals. A graphic representation of it was adopted as the official Emblem of India in 1950. It was originally placed on the top of the Ashoka pillar at the important Buddhist site of Sarnath by the Emperor Ashoka, in about 250 BCE.' },
  '2': { id: '2', name: 'Chola Bronze Statue', region: 'Chola Nadu', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'nataraja statue', description: 'Chola-period bronzes are renowned for their exquisite craftsmanship. They were created using the lost-wax casting technique and represent a pinnacle of South Indian art. The Nataraja statue, depicting Shiva as the lord of dance, is one of the most iconic examples.' },
  '3': { id: '3', name: 'Harappan Seal', region: 'Indus Valley', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'indus seal', description: 'These small, square seals, typically made of steatite, are a hallmark of the Indus Valley Civilization. They are intricately carved with figures of animals, humans, and a script that remains undeciphered. The Pashupati seal is one of the most famous examples.' },
  '4': { id: '4', name: 'Ajanta Cave Painting', region: 'Vakataka', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'ajanta painting', description: 'The Ajanta Caves contain some of the finest surviving examples of ancient Indian art. The paintings depict the Jataka tales, which are stories about the previous lives of the Buddha. The use of vibrant colors and expressive figures is remarkable.' },
  '5': { id: '5', name: 'Mughal Miniature', region: 'Mughal Empire', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'mughal painting', description: 'Mughal painting is a particular style of South Asian painting that emerged in the northern Indian subcontinent during the 16th century. It is known for its intricate details, rich colors, and depiction of courtly life, historical events, and nature.' },
  '6': { id: '6', name: 'Konark Wheel', region: 'Kalinga', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'konark sun temple', description: 'The Konark Sun Temple is designed as a colossal chariot of the sun god, Surya, with 24 intricately carved stone wheels. These wheels, which are 3 meters in diameter, are not just decorative but also function as sundials.' },
};

export default function ArtifactDetailPage({ params }: { params: { id: string } }) {
  const artifact = artifactsData[params.id as keyof typeof artifactsData] || artifactsData['1'];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/artifacts">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vault
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Card className="overflow-hidden bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="bg-muted aspect-video flex items-center justify-center rounded-md">
              {/* Placeholder for 3D model */}
              <Image 
                src={artifact.imageUrl}
                alt={artifact.name}
                width={600}
                height={400}
                data-ai-hint={artifact.dataAiHint}
                className="object-contain w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col justify-center">
          <Card className="bg-transparent shadow-none border-none">
            <CardHeader>
              <CardTitle className="font-headline text-4xl">{artifact.name}</CardTitle>
              <CardDescription className="text-lg">{artifact.region}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 mb-4">
                <History className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-base text-foreground/80">{artifact.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
