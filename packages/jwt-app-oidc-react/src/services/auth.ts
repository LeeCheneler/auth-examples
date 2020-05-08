import type { User } from "oidc-client";
import { UserManager } from "oidc-client";

export interface AuthServiceOptions {
  clientId: string;
  domain: string;
  audience: string;
  scope: string;
}

export interface AuthService {
  signin: () => Promise<void>;
  signinCallback: () => Promise<void>;
  silentSignin: () => Promise<void>;
  silentSigninCallback: () => Promise<void>;
  signout: () => Promise<void>;
  signoutCallback: () => Promise<void>;
  clearStaleState: () => Promise<void>;
  getUser: () => Promise<User | null>;
  addOnUserLoadedCallback: (func: OnUserLoadedCallback) => void;
  addOnUserUnloadedCallback: (func: OnUserUnloadedCallback) => void;
}

type OnUserLoadedCallback = (user: User) => unknown;
type OnUserUnloadedCallback = () => unknown;

export const createAuthService = (options: AuthServiceOptions): AuthService => {
  const userManager = new UserManager({
    authority: `https://${options.domain}`,
    client_id: options.clientId,
    redirect_uri: `${window.location.origin}/callback-signin`,
    silent_redirect_uri: `${window.location.origin}/callback-silent-signin`,
    post_logout_redirect_uri: `${window.location.origin}/callback-signout`,
    scope: options.scope,
    revokeAccessTokenOnSignout: true,
    response_type: "id_token token",
    metadataUrl: `https://${options.domain}/.well-known/openid-configuration`,
    metadata: {
      issuer: `https://${options.domain}/`,
      jwks_uri: `https://${options.domain}/.well-known/jwks.json`,
      authorization_endpoint: `https://${options.domain}/authorize`,
      token_endpoint: `https://${options.domain}/oauth/token`,
      userinfo_endpoint: `https://${options.domain}/userinfo`,
      end_session_endpoint: `https://${options.domain}/logout`,
      revocation_endpoint: `https://${options.domain}/oauth/revoke`,
      registration_endpoint: `https://${options.domain}/oidc/register`,
    },
    extraQueryParams: {
      audience: options.audience,
    },
  });

  const onUserLoadedCallbacks: OnUserLoadedCallback[] = [];
  const onUserUnloadedCallbacks: OnUserUnloadedCallback[] = [];

  // token events
  userManager.events.addAccessTokenExpiring(async () => {
    console.log("addAccessTokenExpiring");
    await silentSignin();
  });

  userManager.events.addAccessTokenExpired(() => {
    console.log("addAccessTokenExpired");
  });

  userManager.events.addSilentRenewError((e: Error) => {
    console.log("addSilentRenewError");
    console.error(e);
  });

  // user events
  userManager.events.addUserLoaded((user: User) => {
    onUserLoadedCallbacks.forEach((cb) => cb(user));
  });

  userManager.events.addUserUnloaded(() => {
    onUserUnloadedCallbacks.forEach((cb) => cb());
  });

  // actions
  const signin = async () => {
    try {
      await userManager.signinRedirect({
        state: { hello: "world" },
        useReplaceToNavigate: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const signinCallback = async () => {
    try {
      const user = await userManager.signinRedirectCallback();
      await userManager.storeUser(user);
    } catch (e) {
      console.error(e);
    }
  };

  const silentSignin = async () => {
    console.log("silentSignin");
    const user = await userManager.signinSilent();
    await userManager.storeUser(user);
  };

  const silentSigninCallback = async () => {
    try {
      console.log("silentSigninCallback");
      const user = await userManager.signinSilentCallback();
      if (user) {
        await userManager.storeUser(user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const signout = async () => {
    try {
      await userManager.signoutRedirect({
        extraQueryParams: {
          returnTo: `${window.location.origin}/callback-signout`,
          client_id: options.clientId,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const signoutCallback = async () => {
    try {
      await userManager.signoutRedirectCallback();
    } catch (e) {
      console.error(e);
    }
  };

  const clearStaleState = async () => {
    try {
      await userManager.clearStaleState();
    } catch (e) {
      console.error(e);
    }
  };

  // state functions
  const getUser = async () => {
    return await userManager.getUser();
  };

  const addOnUserLoadedCallback = (fn: OnUserLoadedCallback) => {
    onUserLoadedCallbacks.push(fn);
  };

  const addOnUserUnloadedCallback = (fn: OnUserUnloadedCallback) => {
    onUserUnloadedCallbacks.push(fn);
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
    addOnUserLoadedCallback,
    addOnUserUnloadedCallback,
  };
};
