import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function EncodingChartsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <BookOpen className="h-10 w-10 text-primary" />
          Encoding Charts
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn the Katapayadi system with interactive visual charts and examples.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Katapayadi Encoding System</CardTitle>
          <CardDescription>Understanding the ancient number encoding system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The Katapayadi system is an ancient Indian method of encoding numbers using Sanskrit syllables.
          </p>
          <p>Interactive charts and examples will be implemented here soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
