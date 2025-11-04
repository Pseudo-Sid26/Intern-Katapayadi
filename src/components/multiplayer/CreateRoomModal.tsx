import React, { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { socketService } from '@/services/socketClient';
import { Loader2 } from 'lucide-react';

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onRoomCreated: (roomCode: string, room: any) => void;
}

export function CreateRoomModal({ open, onClose, onRoomCreated }: CreateRoomModalProps) {
  const [subject, setSubject] = useState('maths');
  const [classNumber, setClassNumber] = useState('6');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState('10');
  const [timePerQuestion, setTimePerQuestion] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!socketService.isConnected()) {
      setError('Not connected to server. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const settings = {
        subject,
        class: parseInt(classNumber),
        difficulty,
        numberOfQuestions: parseInt(numberOfQuestions),
        timePerQuestion: parseInt(timePerQuestion),
      };

      const result = await socketService.createRoom(settings);

      if (result.success && result.roomCode && result.room) {
        onRoomCreated(result.roomCode, result.room);
        onClose();
      } else {
        setError(result.error || 'Failed to create room');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Multiplayer Room</DialogTitle>
          <DialogDescription>
            Configure your game settings and create a room for others to join.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maths">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="class">Class</Label>
            <Select value={classNumber} onValueChange={setClassNumber}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                  <SelectItem key={c} value={c.toString()}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="questions">Number of Questions</Label>
            <Input
              id="questions"
              type="number"
              min="5"
              max="50"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Time per Question (seconds)</Label>
            <Input
              id="time"
              type="number"
              min="10"
              max="120"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(e.target.value)}
            />
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
          <Button onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
