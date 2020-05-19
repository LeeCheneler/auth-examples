import React from "react";
import type { User } from "oidc-client";
import type { AuthService } from "../services/auth";

export interface AuthProviderProps {
  children: React.ReactNode;
  authService: AuthService;
}

export interface AuthProviderState {
  isLoading: boolean;
  user: User | null;
}

interface AuthContext extends AuthService {
  isAuthenticated: () => boolean;
  isLoading: boolean;
  user: User | null;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => React.useContext(AuthContext) as AuthContext;

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const [state, setState] = React.useState<AuthProviderState>({
    isLoading: true,
    user: null,
  });

  React.useEffect(() => {
    const initialise = async () => {
      // Cleanup any stale state
      await props.authService.clearStaleState();

      // Subscribe to new users being loaded, when the user is
      // silently logged in to get new tokens this will trigger
      props.authService.subscribeToUserLoaded((user) => {
        setState({ isLoading: false, user });
      });

      // Subscribe to the user being unloaded, indicating they're not logged in
      props.authService.subscribeToUserUnloaded(() => {
        setState({ isLoading: false, user: null });
      });

      // Obtain the user, will be null if not logged in
      const user = await props.authService.getUser();
      setState({ isLoading: false, user });
    };
    initialise();
  }, [props.authService]);

  const isAuthenticated = (): boolean => {
    return !!state.user && !state.user.expired;
  };

  return (
    <AuthContext.Provider
      value={{ ...props.authService, ...state, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
