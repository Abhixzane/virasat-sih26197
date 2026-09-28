export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'email' | 'guest';
  created_at?: string;
  saved_itineraries?: string[];
  saved_places?: string[];
  preferences?: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (params: { credential?: string; email?: string; name?: string; picture?: string; google_id?: string }) => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  saveItineraryToAccount: (itineraryTitle: string) => Promise<void>;
}
