import type { User } from "oidc-client";
import {
  UserManager,
  WebStorageStateStore,
  InMemoryWebStorage,
  UserManagerSettings,
} from "oidc-client";

export interface AuthServiceOptions {
  authority: string;
  clientId: string;
  domain: string;
  audience: string;
  scope: string;
  openIdConfigurationUrl: string;
  issuer: string;
  jwksUrl: string;
  algorithms: string[];
  endpoints: {
    authorize: string;
    token: string;
    userinfo: string;
    logout: string;
    revoke: string;
    register: string;
  };
  storeUserInSessionStorage: boolean;
  redirectUrl: string;
  silentRedirectUrl: string;
  logoutRedirectUrl: string;
}

export interface SigninOptions {
  returnTo: string;
}

export interface AuthService {
  signin: (options: SigninOptions) => Promise<void>;
  signinCallback: () => Promise<User | undefined>;
  silentSignin: () => Promise<void>;
  silentSigninCallback: () => Promise<void>;
  signout: () => Promise<void>;
  signoutCallback: () => Promise<void>;
  clearStaleState: () => Promise<void>;
  getUser: () => Promise<User | null>;
  subscribeToUserLoaded: (func: UserLoadedCallback) => void;
  subscribeToUserUnloaded: (func: UserUnloadedCallback) => void;
}

export type UserLoadedCallback = (user: User) => unknown;
export type UserUnloadedCallback = () => unknown;

export const createAuthService = (options: AuthServiceOptions): AuthService => {
  const userManagerSettings: UserManagerSettings = {
    authority: options.authority,
    client_id: options.clientId,
    redirect_uri: options.redirectUrl,
    silent_redirect_uri: options.silentRedirectUrl,
    post_logout_redirect_uri: options.logoutRedirectUrl,
    scope: options.scope,
    revokeAccessTokenOnSignout: true,
    response_type: "id_token token",
    metadataUrl: options.openIdConfigurationUrl,
    metadata: {
      issuer: options.issuer,
      jwks_uri: options.jwksUrl,
      authorization_endpoint: options.endpoints.authorize,
      token_endpoint: options.endpoints.token,
      userinfo_endpoint: options.endpoints.userinfo,
      end_session_endpoint: options.endpoints.logout,
      revocation_endpoint: options.endpoints.revoke,
      registration_endpoint: options.endpoints.register,
    },
    // Auth0 requires an audience be sent when signing in in order to obtain
    // a JWT access token for a particular API. If you don't you get an Auth0
    // access token which is not a JWT and only works against Auth0's own APIs.
    extraQueryParams: {
      audience: options.audience,
    },
    // By default UserManager will store the user object in Session Storage. There
    // is a security trade off here, session storage is open to all JavaScript
    // executing on the page and so tokens may not be safe if malicious JavaScript
    // managed to execute. It does provide a *much* faster way of obtaining an
    // already signed in user though. Alternatively, if you really don't want tokens
    // inside any form of Web Storage then we can use an in memory store instead. This
    // is more secure, however has the draw back of the user needing to be sent around
    // the login loop again to obtain new tokens. This isn't particularly a problem as
    // if they're already logged in they should be sent the full loop automatically and
    // be issued tokens in a second or 2.
    userStore: options.storeUserInSessionStorage
      ? undefined
      : new WebStorageStateStore({
          store: new InMemoryWebStorage(),
        }),
  };

  const userManager = new UserManager(userManagerSettings);

  const onUserLoadedSubscriptions: UserLoadedCallback[] = [];
  const onUserUnloadedSubscriptions: UserUnloadedCallback[] = [];

  // Silently sign in when the access token is approaching expiry to get new tokens
  userManager.events.addAccessTokenExpiring(async () => {
    await silentSignin();
  });

  // Try and silently sign in if the token expires to get new tokens
  userManager.events.addAccessTokenExpired(async () => {
    await silentSignin();
  });

  // Log if silent renew fails
  userManager.events.addSilentRenewError((e: Error) => {
    console.error("Failed to silently renew tokens", e);
  });

  // Will trigger when userManager.storeUser(user) is called
  userManager.events.addUserLoaded((user: User) => {
    // Send the new user out to any subscriptions
    onUserLoadedSubscriptions.forEach((cb) => cb(user));
  });

  // Not 100% sure when this triggers
  userManager.events.addUserUnloaded(() => {
    // Notify any subscriptions that the user has been unloaded
    onUserUnloadedSubscriptions.forEach((cb) => cb());
  });

  // Sign in the user, will redirect to the identity provider
  // if a manual login is required.
  const signin = async (options: SigninOptions) => {
    try {
      await userManager.signinRedirect({
        state: { returnTo: options.returnTo },
        useReplaceToNavigate: true,
      });
    } catch (e) {
      console.error("Failed to sign in", e);
    }
  };

  // Completes user sign in and stores the new user
  const signinCallback = async () => {
    try {
      const user = await userManager.signinRedirectCallback();
      await userManager.storeUser(user);
      return user;
    } catch (e) {
      console.error("Failed to process sign in callback", e);
    }
  };

  // Sign the user in silently via an iframe
  const silentSignin = async () => {
    try {
      const user = await userManager.signinSilent();
      await userManager.storeUser(user);
    } catch (e) {
      console.error("Failed to silently signin", e);
    }
  };

  // Completes user sign in via iframe, userManager.signinSilentCallback()
  // notifies the parent window of the new user
  const silentSigninCallback = async () => {
    try {
      const user = await userManager.signinSilentCallback();
      if (user) {
        await userManager.storeUser(user);
      }
    } catch (e) {
      console.error("Failed to process silent signin callback", e);
    }
  };

  // Sign the user out
  const signout = async () => {
    try {
      await userManager.signoutRedirect({
        extraQueryParams: {
          returnTo: userManager.settings.post_logout_redirect_uri,
          client_id: options.clientId,
        },
      });
    } catch (e) {
      console.error("Failed to signout", e);
    }
  };

  // Complete the user signout
  const signoutCallback = async () => {
    try {
      await userManager.signoutRedirectCallback();
    } catch (e) {
      console.error("Failed to process signout callback", e);
    }
  };

  // Clear any stale oidc-client-js state from web storage
  const clearStaleState = async () => {
    try {
      await userManager.clearStaleState();
    } catch (e) {
      console.error("Failed to clear stale state", e);
    }
  };

  // Get the current user
  const getUser = () => {
    return userManager.getUser();
  };

  // Subscribe to the user being loaded, this will provide access to new token when they arrive
  const subscribeToUserLoaded = (fn: UserLoadedCallback) => {
    onUserLoadedSubscriptions.push(fn);
  };

  // Subscribe to the user being unloaded
  const subscribeToUserUnloaded = (fn: UserUnloadedCallback) => {
    onUserUnloadedSubscriptions.push(fn);
  };

  return {
    signin,
    signinCallback,
    silentSignin,
    silentSigninCallback,
    signout,
    signoutCallback,
    clearStaleState,
    getUser,
    subscribeToUserLoaded,
    subscribeToUserUnloaded,
  };
};
