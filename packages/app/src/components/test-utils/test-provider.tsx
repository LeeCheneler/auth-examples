import React from "react";
import type { AuthService } from "../../services/auth";
import { AuthProvider } from "../auth-provider";

interface TestProviderProps {
  children: React.ReactNode;
  authServiceToMerge?: Partial<AuthService>;
}

export const mockUser = {
  access_token: "header.access_token_body.signature",
  expired: false,
  expires_at: Date.now() + 1000 * 60,
  expires_in: 1000 * 60,
  id_token: "header.id_token_body.signature",
  profile: {
    aud: "aud",
    exp: Date.now() + 1000 * 60,
    iat: Date.now(),
    iss: "iss",
    sub: "sub",
  },
  scope: "openid profile email",
  scopes: ["openid", "profile", "email"],
  state: {},
  toStorageString: () => "storage_string",
  token_type: "id_token",
  refresh_token: "header.refresh_token_body.signature",
};

export const createMockAuthService = (): AuthService => {
  return {
    clearStaleState: jest.fn().mockReturnValue(Promise.resolve()),
    getUser: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
    signin: jest.fn().mockReturnValue(Promise.resolve()),
    signinCallback: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
    signout: jest.fn().mockReturnValue(Promise.resolve()),
    signoutCallback: jest.fn().mockReturnValue(Promise.resolve()),
    silentSignin: jest.fn().mockReturnValue(Promise.resolve()),
    silentSigninCallback: jest.fn().mockReturnValue(Promise.resolve()),
    subscribeToUserLoaded: jest.fn().mockReturnValue(Promise.resolve()),
    subscribeToUserUnloaded: jest.fn().mockReturnValue(Promise.resolve()),
  };
};

export const TestProvider: React.FC<TestProviderProps> = ({
  children,
  authServiceToMerge = {},
}) => {
  const authService = {
    ...createMockAuthService(),
    ...authServiceToMerge,
  };

  return <AuthProvider authService={authService}>{children}</AuthProvider>;
};
