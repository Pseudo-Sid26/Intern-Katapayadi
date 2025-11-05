const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  level: number;
  experience: number;
  totalScore: number;
  gamesPlayed: number;
  quizzesCompleted: number;
  achievements: string[];
  stats: {
    katapayadiScore: number;
    memoryMatchBest: number;
    storyBuilderCompleted: number;
    quizAccuracy: number;
  };
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface GameSession {
  gameType: 'quiz' | 'katapayadi' | 'memory' | 'story' | 'multiplayer';
  score: number;
  accuracy?: number;
  timeSpent: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  subject?: string;
  class?: number;
  difficulty?: string;
  completed: boolean;
}

class AuthClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Register new user
  async register(username: string, email: string, password: string, displayName: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, email, password, displayName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token);
    return data;
  }

  // Login
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Login attempt:', { username, apiUrl: `${API_BASE_URL}/auth/login` });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Login error response:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      console.log('Login successful, user:', data.user.username);
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login exception:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return data.user;
  }

  // Update profile
  async updateProfile(displayName?: string, avatar?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ displayName, avatar }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return data.user;
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/auth/leaderboard?limit=${limit}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get leaderboard');
    }

    const data = await response.json();
    return data.leaderboard;
  }

  // Save game session
  async saveGameSession(session: GameSession): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/game/session`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      throw new Error('Failed to save game session');
    }

    return await response.json();
  }

  // Get game history
  async getGameHistory(gameType?: string, limit: number = 20): Promise<any[]> {
    const params = new URLSearchParams();
    if (gameType) params.append('gameType', gameType);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/game/history?${params}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get game history');
    }

    const data = await response.json();
    return data.history;
  }

  // Get user stats
  async getUserStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/game/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get stats');
    }

    const data = await response.json();
    return data.stats;
  }

  // Logout
  logout() {
    this.clearToken();
  }
}

export const authClient = new AuthClient();
