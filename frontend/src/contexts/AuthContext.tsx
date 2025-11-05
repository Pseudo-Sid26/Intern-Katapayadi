import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient, User } from '../services/authClient';
import { socketService } from '../services/socketClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authClient.isAuthenticated()) {
          const currentUser = await authClient.getCurrentUser();
          setUser(currentUser);
          
          // Connect Socket.IO
          const token = authClient.getToken();
          if (token) {
            socketService.connect(token);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        authClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Login attempt for:', username);
      const response = await authClient.login(username, password);
      setUser(response.user);
      console.log('User set, now connecting Socket.IO...');
      
      // Wait a tiny bit to ensure token is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Connect Socket.IO
      const token = authClient.getToken();
      console.log('Token retrieved:', token ? `${token.substring(0, 20)}...` : 'NULL');
      
      if (token) {
        console.log('Connecting Socket.IO with token...');
        socketService.connect(token);
        console.log('Socket.IO connection initiated');
      } else {
        console.error('No token available for Socket.IO!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      console.log('Registering user:', username);
      const response = await authClient.register(username, email, password, displayName);
      setUser(response.user);
      console.log('Registration successful, user:', response.user.username);
      
      // Connect Socket.IO
      const token = authClient.getToken();
      console.log('Got token for Socket.IO:', token ? 'Yes' : 'No');
      if (token) {
        socketService.connect(token);
        console.log('Socket.IO connected after registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authClient.logout();
    socketService.disconnect();
    setUser(null);
  };

  const refreshUser = async () => {
    if (authClient.isAuthenticated()) {
      try {
        const currentUser = await authClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to refresh user:', error);
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
