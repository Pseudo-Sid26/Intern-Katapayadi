import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { socketService } from '@/services/socketClient';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Copy, Check, Crown, Loader2 } from 'lucide-react';

interface RoomLobbyProps {
  room: any;
  onLeave: () => void;
  onGameStart: () => void;
}

export function RoomLobby({ room, onLeave, onGameStart }: RoomLobbyProps) {
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(room);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const [starting, setStarting] = useState(false);

  const isHost = user?.id === currentRoom.hostId;
  const allPlayersReady = currentRoom.players.every((p: any) => p.ready);

  useEffect(() => {
    // Update room when players join/leave
    const handlePlayerJoined = (data: any) => {
      setCurrentRoom(data.room);
    };

    const handlePlayerLeft = (data: any) => {
      setCurrentRoom(data.room);
    };

    const handlePlayerReady = (data: any) => {
      setCurrentRoom(data.room);
    };

    const handleGameStarting = () => {
      setStarting(true);
      // Will transition to game view after countdown
      setTimeout(() => {
        onGameStart();
      }, 3000);
    };

    socketService.onPlayerJoined(handlePlayerJoined);
    socketService.onPlayerLeft(handlePlayerLeft);
    socketService.onPlayerReady(handlePlayerReady);
    socketService.onGameStarting(handleGameStarting);

    return () => {
      socketService.offPlayerJoined(handlePlayerJoined);
      socketService.offPlayerLeft(handlePlayerLeft);
      socketService.offPlayerReady(handlePlayerReady);
      socketService.offGameStarting(handleGameStarting);
    };
  }, [onGameStart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoom.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReady = async () => {
    const result = await socketService.playerReady(currentRoom.roomCode);
    if (result.success) {
      setReady(true);
    }
  };

  const handleStartGame = async () => {
    if (!isHost || !allPlayersReady) return;
    
    const result = await socketService.startGame(currentRoom.roomCode);
    if (!result.success) {
      alert(result.error || 'Failed to start game');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Game Lobby</CardTitle>
              <CardDescription>
                Waiting for players to join and be ready...
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onLeave}>
              Leave Room
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="text-3xl font-mono font-bold tracking-widest">
              {currentRoom.roomCode}
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Game Settings */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium capitalize">{currentRoom.settings.subject}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-medium">{currentRoom.settings.class}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="font-medium capitalize">{currentRoom.settings.difficulty}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="font-medium">{currentRoom.settings.numberOfQuestions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Time/Q</p>
              <p className="font-medium">{currentRoom.settings.timePerQuestion}s</p>
            </div>
          </div>

          {/* Players */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold">
                Players ({currentRoom.players.length})
              </h3>
            </div>

            <div className="grid gap-3">
              {currentRoom.players.map((player: any) => (
                <div
                  key={player.userId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(player.displayName || player.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {player.displayName || player.username}
                        </span>
                        {player.userId === currentRoom.hostId && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        @{player.username}
                      </span>
                    </div>
                  </div>

                  {player.ready ? (
                    <Badge variant="default" className="bg-green-500">
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Ready</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {starting ? (
            <div className="flex items-center justify-center gap-2 p-6 bg-green-50 border border-green-200 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                Game starting...
              </span>
            </div>
          ) : (
            <div className="flex gap-3">
              {!ready && !isHost && (
                <Button onClick={handleReady} className="flex-1">
                  I'm Ready!
                </Button>
              )}

              {isHost && (
                <Button
                  onClick={handleStartGame}
                  disabled={!allPlayersReady}
                  className="flex-1"
                >
                  {allPlayersReady ? 'Start Game' : 'Waiting for players...'}
                </Button>
              )}
            </div>
          )}

          {isHost && !allPlayersReady && (
            <p className="text-sm text-center text-muted-foreground">
              All players must be ready before you can start the game
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
