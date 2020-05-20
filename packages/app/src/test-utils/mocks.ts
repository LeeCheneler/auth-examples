import type { User } from "oidc-client";
import type { History } from "history";
import { createMemoryHistory } from "history";
import type { AuthService } from "../services/auth";
import deepmerge from "deepmerge";

export const createMockUser = (mergeUser: Partial<User> = {}): User => {
  return deepmerge(
    {
      access_token: "header.access_token_body.signature",
      expired: false,
      expires_at: Date.now() + 1000 * 60,
      expires_in: 1000 * 60,
      id_token: "header.id_token_body.signature",
      profile: {
        nickname: "nickname",
        email: "email",
        aud: "aud",
        exp: Date.now() + 1000 * 60,
        iat: Date.now(),
        iss: "iss",
        sub: "sub",
      },
      scope: "openid profile email",
      scopes: ["openid", "profile", "email"],
      state: {},
      token_type: "id_token",
      refresh_token: "header.refresh_token_body.signature",
    },
    mergeUser
  );
};

export const createMockAuthService = (
  mergeAuthService: Partial<AuthService> = {}
): AuthService => {
  const mockUser = createMockUser();
  return deepmerge(
    {
      clearStaleState: jest.fn().mockReturnValue(Promise.resolve()),
      getUser: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
      signin: jest.fn().mockReturnValue(Promise.resolve()),
      signinCallback: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
      signout: jest.fn().mockReturnValue(Promise.resolve()),
      signoutCallback: jest.fn().mockReturnValue(Promise.resolve()),
      silentSignin: jest.fn().mockReturnValue(Promise.resolve()),
      silentSigninCallback: jest.fn().mockReturnValue(Promise.resolve()),
      subscribeToUserLoaded: jest.fn(),
      subscribeToUserUnloaded: jest.fn(),
    },
    mergeAuthService
  );
};

export const createMockHistory = (
  mergeHistory: Partial<History> = {}
): History => {
  return deepmerge(createMemoryHistory(), mergeHistory);
};
