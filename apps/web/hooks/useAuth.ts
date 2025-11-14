import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient, User, SignupRequest, LoginRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signup: (userData: SignupRequest) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = apiClient.getAuthToken();
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Token might be invalid, remove it
        apiClient.removeAuthToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      apiClient.removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.signup(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        apiClient.setAuthToken(token);
        setUser(newUser);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Signup failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        const { user: loggedInUser, token } = response.data;
        apiClient.setAuthToken(token);
        setUser(loggedInUser);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.removeAuthToken();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
