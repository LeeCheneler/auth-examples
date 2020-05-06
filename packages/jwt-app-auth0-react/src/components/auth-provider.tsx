import React, { useState, useEffect, useContext } from "react";
import type {
  Auth0Client,
  Auth0ClientOptions,
  IdToken,
  GetIdTokenClaimsOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  LogoutOptions,
  RedirectLoginOptions,
} from "@auth0/auth0-spa-js";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

interface Auth0Context {
  isAuthenticated: boolean;
  user?: any;
  isLoading: boolean;
  isPopupOpen: boolean;
  loginWithPopup: () => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
  getIdTokenClaims: (options?: GetIdTokenClaimsOptions) => Promise<IdToken>;
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>;
  getAccessToken: () => Promise<string>;
  logout: (options?: LogoutOptions) => void;
}

export const Auth0Context = React.createContext<Auth0Context | null>(null);
export const useAuth0 = () => useContext(Auth0Context) as Auth0Context;

interface AuthProviderProps extends Auth0ClientOptions {
  children: React.ReactNode;
  onRedirectCallback: (appState: any) => void;
}

export const Auth0Provider: React.SFC<AuthProviderProps> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setIsLoading(false);
    };
    initAuth0();
  }, []);

  const loginWithPopup = async () => {
    setIsPopupOpen(true);
    try {
      await auth0Client?.loginWithPopup();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPopupOpen(false);
    }
    const user = await auth0Client?.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setIsLoading(true);
    await auth0Client?.handleRedirectCallback();
    const user = await auth0Client?.getUser();
    setIsLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const getAccessToken = async (): Promise<string> => {
    try {
      return (await auth0Client!.getTokenSilently({
        audience: "https://auth-examples-api",
      })) as string;
    } catch (e) {
      if (e.error === "consent_required") {
        return (await auth0Client!.getTokenWithPopup({
          audience: "https://auth-examples-api",
        })) as string;
      }
    }

    throw new Error("Unable to obtain access token silently or with popup.");
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        isLoading,
        isPopupOpen,
        user,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (options) => auth0Client!.getIdTokenClaims(options),
        loginWithRedirect: (options) => auth0Client!.loginWithRedirect(options),
        getAccessToken,
        logout: (options) => auth0Client!.logout(options),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
