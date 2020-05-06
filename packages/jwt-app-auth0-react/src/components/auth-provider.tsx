import React from "react";
import type { Auth0Client } from "@auth0/auth0-spa-js";
import createAuth0Client from "@auth0/auth0-spa-js";
import { history } from "../utils/history";

export interface AuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPopupOpen: boolean;
  loginWithRedirect: () => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: () => void;
  user: any | null;
  getAccessToken: () => Promise<string>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  clientId: string;
  domain: string;
  audience: string;
  scope: string;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export const useAuth = () => React.useContext(AuthContext) as AuthContext;

export const AuthProvider: React.SFC<AuthProviderProps> = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = React.useState(true);
  const [auth0Client, setAuth0Client] = React.useState<Auth0Client | null>(
    null
  );
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const init = async () => {
      // Create the client we'll use for the duration of the app
      const newAuth0Client = await createAuth0Client({
        client_id: props.clientId,
        domain: props.domain,
        redirect_uri: window.location.origin,
      });

      setAuth0Client(newAuth0Client);

      // Detect if we are handling an authentication callback, handle and redirect if we are
      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await newAuth0Client.handleRedirectCallback();
        history.push(
          appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
        );
      }

      // Check if we're authenticated now and set state accordingly
      const isAuthenticated = await newAuth0Client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        setUser(await newAuth0Client.getUser());
      }

      setIsLoading(false);
    };

    init();
  }, [props.clientId, props.domain, props.audience, props.scope]);

  const loginWithRedirect = (): Promise<void> => {
    return auth0Client!.loginWithRedirect({
      appState: { targetUrl: window.location.pathname },
    });
  };

  const loginWithPopup = async (): Promise<void> => {
    setIsPopupOpen(true);

    try {
      await auth0Client!.loginWithPopup();
    } catch (e) {
      console.error(e);
    }

    setIsPopupOpen(false);
    setIsAuthenticated(await auth0Client!.isAuthenticated());
  };

  const logout = () => {
    auth0Client?.logout();
  };

  const getAccessToken = async (): Promise<string> => {
    try {
      // Try and obtain token silently
      const token = await auth0Client!.getTokenSilently({
        audience: props.audience,
        sope: props.scope,
      });
      return token as string;
    } catch (e) {
      // We can handle consent required below so don't throw
      // on that error
      if (e.error !== "consent_required") {
        throw e;
      }
    }

    // Sometimes a new consent from the user is required for a scope
    // so we need to use a popup so the user can give consent
    const token = await auth0Client!.getTokenWithPopup({
      audience: props.audience,
      sope: props.scope,
    });
    return token as string;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isPopupOpen,
        loginWithRedirect,
        loginWithPopup,
        logout,
        user,
        getAccessToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
