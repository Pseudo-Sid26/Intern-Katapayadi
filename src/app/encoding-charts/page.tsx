import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          Learn the secrets of the Katapayadi system.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Katapayadi System</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This page will contain interactive charts to learn the encoding system.</p>
        </CardContent>
      </Card>
    </div>
  );
}
