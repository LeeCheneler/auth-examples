import React from "react";
import type { User } from "oidc-client";
import type { AuthService } from "../services/auth";

export interface AuthProviderProps {
  children: React.ReactNode;
  authService: AuthService;
}

interface AuthContext extends AuthService {
  isAuthenticated: () => boolean;
  isLoading: boolean;
  user: User | null;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => React.useContext(AuthContext) as AuthContext;

export const AuthProvider: React.SFC<AuthProviderProps> = (props) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initialise = async () => {
      // Cleanup any stale state
      await props.authService.clearStaleState();

      // Obtain the user, will be null if not logged in
      const user = await props.authService.getUser();
      setUser(user);

      // Subscribe to new users being loaded, when the user is
      // silently logged in to get new tokens this will trigger
      props.authService.subscribeToUserLoaded((user) => {
        setUser(user);
      });

      // Subscribe to the user being unloaded, indicating they're not logged in
      props.authService.subscribeToUserUnloaded(() => {
        setUser(null);
      });

      setIsLoading(false);
    };
    initialise();
  }, []);

  const isAuthenticated = (): boolean => {
    return !!user && !user.expired;
  };

  return (
    <AuthContext.Provider
      value={{ ...props.authService, isAuthenticated, isLoading, user }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};