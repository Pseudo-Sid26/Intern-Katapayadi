'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScanLine, CameraOff, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ScanPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Turn off camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to scan map fragments.',
      });
    }
  };

  const handleActivateCamera = () => {
    getCameraPermission();
  };
  
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
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
            {isCameraActive && hasCameraPermission ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center">
                    <ScanLine className="h-1/2 w-1/2 text-white/50 animate-pulse" />
                </div>
              </>
            ) : (
               <CameraOff className="h-32 w-32 text-muted-foreground" />
            )}
          </div>

          {!isCameraActive && (
            <Button size="lg" className="w-full" onClick={handleActivateCamera}>
              <Video className="mr-2 h-5 w-5" />
              Activate Camera
            </Button>
          )}

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
