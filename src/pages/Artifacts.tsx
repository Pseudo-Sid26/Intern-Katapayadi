import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function ArtifactsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Package className="h-10 w-10 text-primary" />
          Artifact Vault
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore your collection of historical artifacts.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Artifacts</CardTitle>
          <CardDescription>3D models and collectibles you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your artifact collection will be displayed here. Complete challenges to unlock more artifacts!</p>
        </CardContent>
      </Card>
    </div>
  );
}
