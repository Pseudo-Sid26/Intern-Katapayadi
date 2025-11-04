import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ScanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <QrCode className="h-10 w-10 text-primary" />
          Map Scanner
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Scan QR codes on physical map pieces to unlock digital content.
        </p>
      </header>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Regional Map Fragments</CardTitle>
          <CardDescription>Scan QR codes to unlock puzzles and rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Use your device camera to scan QR codes found on physical map pieces.</p>
          <Button className="w-full">Open QR Scanner</Button>
        </CardContent>
      </Card>
    </div>
  );
}
