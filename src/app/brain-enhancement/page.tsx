import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Book, MemoryStick, Puzzle } from 'lucide-react';

export default function BrainEnhancementPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <BrainCircuit className="h-10 w-10 text-primary" />
          Brain Enhancement
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Engage in puzzles and games designed to boost your cognitive skills.
        </p>
      </header>
      <Tabs defaultValue="decode" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="decode">
            <Book className="mr-2 h-4 w-4" />
            Katapayadi Decode
          </TabsTrigger>
          <TabsTrigger value="memory">
            <MemoryStick className="mr-2 h-4 w-4" />
            Memory Match
          </TabsTrigger>
          <TabsTrigger value="story">
            <Puzzle className="mr-2 h-4 w-4" />
            Story Builder
          </TabsTrigger>
        </TabsList>
        <TabsContent value="decode">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Katapayadi Decoding Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Decode the Sanskrit letters to find the hidden number. This will be implemented soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="memory">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Memory Match</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Match pairs of related cultural symbols and artifacts. This will be implemented soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="story">
           <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Drag and Drop Story Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Arrange scrambled story fragments to recreate a famous tale from Indian history. This will be implemented soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
