import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { socketService } from '@/services/socketClient';
import { Loader2 } from 'lucide-react';

interface JoinRoomModalProps {
  open: boolean;
  onClose: () => void;
  onRoomJoined: (room: any) => void;
}

export function JoinRoomModal({ open, onClose, onRoomJoined }: JoinRoomModalProps) {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    if (!socketService.isConnected()) {
      setError('Not connected to server. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await socketService.joinRoom(roomCode.toUpperCase());

      if (result.success && result.room) {
        onRoomJoined(result.room);
        onClose();
        setRoomCode('');
      } else {
        setError(result.error || 'Failed to join room');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setRoomCode(value);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Multiplayer Room</DialogTitle>
          <DialogDescription>
            Enter the 6-character room code to join an existing game.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              placeholder="ABC123"
              value={roomCode}
              onChange={handleInputChange}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && roomCode.length === 6) {
                  handleJoin();
                }
              }}
            />
            <p className="text-xs text-muted-foreground text-center">
              6-character code (letters and numbers)
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleJoin}
            disabled={loading || roomCode.length !== 6}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Join Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
