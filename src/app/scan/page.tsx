import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScanQrCode } from 'lucide-react';

export default function ScanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center justify-center gap-4">
          Scan Map Fragment
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">
          Place the QR code on a map fragment in front of your device's camera to unlock the next challenge.
        </p>
      </header>
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <ScanQrCode className="h-32 w-32 text-muted-foreground" />
          <Button size="lg" className="w-full">
            Activate Camera
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
