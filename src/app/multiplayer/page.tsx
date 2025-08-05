'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Sword, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function MultiplayerPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Users className="h-10 w-10 text-primary" />
          Multiplayer
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Challenge other players in real-time!
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Game Lobby</CardTitle>
                <CardDescription>Find a match and prove your knowledge.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Searching for an opponent...</p>
                <Progress value={45} className="mb-6"/>
                <Button size="lg">Find Match</Button>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <span>Wins</span>
                    </div>
                    <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sword className="w-5 h-5 text-red-500" />
                        <span>Losses</span>
                    </div>
                    <span className="font-bold">5</span>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span>Win Rate</span>
                    </div>
                    <span className="font-bold">70%</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
