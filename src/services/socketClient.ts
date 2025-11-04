import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    console.log('SocketService.connect called with token:', token ? 'Yes' : 'No');
    
    // Disconnect existing socket if any
    if (this.socket) {
      console.log('Disconnecting existing socket...');
      this.socket.disconnect();
      this.socket = null;
    }

    this.token = token;
    console.log('Creating new Socket.IO connection...');
    
    this.socket = io(BACKEND_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Room Management
  createRoom(settings: any): Promise<{ success: boolean; roomCode?: string; room?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('create-room', settings, resolve);
    });
  }

  joinRoom(roomCode: string): Promise<{ success: boolean; room?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('join-room', roomCode, resolve);
    });
  }

  getRoom(roomCode: string): Promise<{ success: boolean; room?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('get-room', roomCode, resolve);
    });
  }

  leaveRoom(roomCode: string) {
    if (!this.socket) return;
    this.socket.emit('leave-room', roomCode);
  }

  playerReady(roomCode: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('player-ready', roomCode, resolve);
    });
  }

  startGame(roomCode: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('start-game', roomCode, resolve);
    });
  }

  submitAnswer(
    roomCode: string,
    questionId: string,
    answer: string,
    timeSpent: number
  ): Promise<{ success: boolean; correct?: boolean; points?: number; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve({ success: false, error: 'Not connected' });
        return;
      }
      this.socket.emit('submit-answer', { roomCode, questionId, answer, timeSpent }, resolve);
    });
  }

  // Event Listeners
  onPlayerJoined(callback: (data: any) => void) {
    this.socket?.on('player-joined', callback);
  }

  onPlayerLeft(callback: (data: any) => void) {
    this.socket?.on('player-left', callback);
  }

  onPlayerReady(callback: (data: any) => void) {
    this.socket?.on('player-ready', callback);
  }

  onGameStarting(callback: (data: any) => void) {
    this.socket?.on('game-starting', callback);
  }

  onAnswerSubmitted(callback: (data: any) => void) {
    this.socket?.on('answer-submitted', callback);
  }

  // Remove listeners
  offPlayerJoined(callback?: (data: any) => void) {
    this.socket?.off('player-joined', callback);
  }

  offPlayerLeft(callback?: (data: any) => void) {
    this.socket?.off('player-left', callback);
  }

  offPlayerReady(callback?: (data: any) => void) {
    this.socket?.off('player-ready', callback);
  }

  offGameStarting(callback?: (data: any) => void) {
    this.socket?.off('game-starting', callback);
  }

  offAnswerSubmitted(callback?: (data: any) => void) {
    this.socket?.off('answer-submitted', callback);
  }
}

export const socketService = new SocketService();
