import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function ArtifactDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Package className="h-10 w-10 text-primary" />
          Artifact #{id}
        </h1>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Artifact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Detailed information and 3D view of artifact #{id} will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
