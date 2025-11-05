import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateRoomModal } from '@/components/multiplayer/CreateRoomModal';
import { JoinRoomModal } from '@/components/multiplayer/JoinRoomModal';
import { RoomLobby } from '@/components/multiplayer/RoomLobby';
import { MultiplayerGame } from '@/components/multiplayer/MultiplayerGame';
import { socketService } from '@/services/socketClient';
import { useAuth } from '@/contexts/AuthContext';

type GameState = 'menu' | 'lobby' | 'playing' | 'results';

export default function MultiplayerPage() {
  const { user, isAuthenticated } = useAuth();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Show message if not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
            <Users className="h-10 w-10 text-primary" />
            Multiplayer
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Challenge friends or other players in real-time quiz battles.
          </p>
        </header>

        <Alert className="mb-6">
          <AlertDescription className="text-lg">
            🔐 You must be logged in to use multiplayer features.
            <div className="mt-4 flex gap-3">
              <Button asChild>
                <a href="/login">Login</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/register">Register</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  useEffect(() => {
    // Only try to connect if user is authenticated
    const socket = socketService.getSocket();
    
    if (!socket || !socket.connected) {
      setConnectionError('Connecting to server...');
    }
    
    // Listen for connection events
    const handleConnect = () => {
      console.log('Socket connected in Multiplayer page');
      setConnectionError('');
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected in Multiplayer page');
      setConnectionError('Connection lost. Attempting to reconnect...');
    };

    const handleConnectError = (error: any) => {
      console.error('Socket connection error in Multiplayer page:', error);
      if (error.message === 'Invalid token') {
        setConnectionError('Please refresh the page or log out and log back in.');
      } else {
        setConnectionError('Unable to connect to server. Please check if the backend is running on port 5000.');
      }
    };

    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      
      // Check initial connection status
      if (socket.connected) {
        setConnectionError('');
      }
    }

    // Check periodically for connection
    const checkInterval = setInterval(() => {
      const currentSocket = socketService.getSocket();
      if (currentSocket?.connected) {
        setConnectionError('');
        clearInterval(checkInterval);
      }
    }, 2000);

    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      const currentSocket = socketService.getSocket();
      if (!currentSocket?.connected) {
        setConnectionError('Unable to connect to server. Please check if the backend is running on port 5000.');
      }
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
      }
      clearInterval(checkInterval);
      clearTimeout(timeout);
      if (currentRoom) {
        socketService.leaveRoom(currentRoom.roomCode);
      }
    };
  }, [currentRoom]);

  const handleRoomCreated = (roomCode: string, room: any) => {
    setCurrentRoom(room);
    setGameState('lobby');
  };

  const handleRoomJoined = (room: any) => {
    setCurrentRoom(room);
    setGameState('lobby');
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socketService.leaveRoom(currentRoom.roomCode);
      setCurrentRoom(null);
    }
    setGameState('menu');
  };

  const handleGameStart = () => {
    setGameState('playing');
    // TODO: Implement game view
  };

  if (gameState === 'lobby' && currentRoom) {
    return (
      <RoomLobby
        room={currentRoom}
        onLeave={handleLeaveRoom}
        onGameStart={handleGameStart}
      />
    );
  }

  if (gameState === 'playing' && currentRoom) {
    return (
      <MultiplayerGame 
        room={currentRoom}
        onGameEnd={handleLeaveRoom}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold flex items-center gap-4">
          <Users className="h-10 w-10 text-primary" />
          Multiplayer
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Challenge friends or other players in real-time quiz battles.
        </p>
      </header>

      {connectionError && (
        <Alert variant={connectionError.includes('Connecting') ? 'default' : 'destructive'} className="mb-6">
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Room
            </CardTitle>
            <CardDescription>Start a new game and invite your friends</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setCreateModalOpen(true)}
            >
              Create New Room
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Join Room
            </CardTitle>
            <CardDescription>Enter a room code to join an existing game</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() => setJoinModalOpen(true)}
            >
              Join Room
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateRoomModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />

      <JoinRoomModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onRoomJoined={handleRoomJoined}
      />
    </div>
  );
}
