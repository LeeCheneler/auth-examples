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
      await props.authService.clearStaleState();
      const user = await props.authService.getUser();
      if (user) {
        setUser(user);
      }
      props.authService.addOnUserLoadedCallback((user) => {
        console.log("addOnUserLoadedCallback", user);
        setUser(user);
      });
      props.authService.addOnUserUnloadedCallback(() => {
        console.log("addOnUserUnloadedCallback");
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
