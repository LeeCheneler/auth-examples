import React from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import type { Auth0ClientOptions } from "@auth0/auth0-spa-js";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../auth-provider";
import { history } from "../../utils/history";

interface MockAuth0ClientConfig {
  loginWillWork: boolean;
}

jest.mock("../../utils/history", () => {
  return {
    history: {
      push: jest.fn(),
    },
  };
});

jest.mock("@auth0/auth0-spa-js", () => {
  const mockAuth0Client = {
    isAuthenticated: jest.fn(),
    loginWithPopup: jest.fn(),
    loginWithRedirect: jest.fn(),
    getIdTokenClaims: jest.fn(),
    getUser: jest.fn(),
    handleRedirectCallback: jest.fn(),
    getTokenSilently: jest.fn(),
    getTokenWithPopup: jest.fn(),
  };

  return (options: Auth0ClientOptions) => {
    const config: MockAuth0ClientConfig = JSON.parse(options.client_id);
    let isAuthenticated = false;

    const login = () => {
      if (config.loginWillWork) {
        isAuthenticated = true;
      }

      return Promise.resolve();
    };

    const handleRedirect = () => {
      if (window.location.search.includes("redirect_uri")) {
        return {appState: {
          targetUrl: 
        }}
      }
      return {}
    }

    mockAuth0Client.isAuthenticated.mockImplementation(() => isAuthenticated);
    mockAuth0Client.loginWithPopup.mockImplementation(login);
    mockAuth0Client.loginWithRedirect.mockImplementation(login);
    mockAuth0Client.handleRedirectCallback.mockImplementation(handleRedirect);

    return Promise.resolve(mockAuth0Client);
  };
});

const TestHarness = () => {
  const auth = useAuth();

  return (
    <>
      <span data-testid="is-loading">{auth.isLoading.toString()}</span>
      <span data-testid="is-authenticated">
        {auth.isAuthenticated.toString()}
      </span>
      <button onClick={auth.loginWithRedirect}>Login with redirect</button>
      <button onClick={auth.loginWithPopup}>Login with popup</button>
    </>
  );
};

describe("AuthProvider", () => {
  let mockAuth0ClientConfig: MockAuth0ClientConfig = {
    loginWillWork: true,
  };
  const { location } = window;

  beforeAll(() => {
    window.location = location;
    jest.resetAllMocks();
  });

  afterAll(() => {
    window.location = location;
  });

  describe("login with redirect", () => {
    it("should have correct state whilst triggering login with redirect", async () => {
      render(
        <AuthProvider
          clientId={JSON.stringify(mockAuth0ClientConfig)}
          domain="https://domain"
          audience="https://audience"
          scope="openid profile email"
        >
          <TestHarness />
        </AuthProvider>
      );

      const isLoadingElement = await screen.findByTestId("is-loading");
      const isAuthenticatedElement = await screen.findByTestId(
        "is-authenticated"
      );

      // Should be loaded and not authenticated
      expect(isLoadingElement.innerHTML).toBe("false");
      expect(isAuthenticatedElement.innerHTML).toBe("false");

      // Login via redirect
      userEvent.click(
        await screen.findByRole("button", { name: "Login with redirect" })
      );

      // Auth0 will leave the app so we can only assert we called it
      expect(
        (
          await createAuth0Client({
            client_id: JSON.stringify(mockAuth0ClientConfig),
            domain: "",
          })
        ).loginWithRedirect
      ).toHaveBeenCalledTimes(1);
    });

    it.only("should authenticate when redirecting back into the app following successful authentication and go to returnUrl", async () => {
      Object.assign(location, {
        host: "localhost",
        pathname:
          "?code=hello&state=world&redirect_uri=http://localhost/return-url",
      });

      render(
        <AuthProvider
          clientId={JSON.stringify(mockAuth0ClientConfig)}
          domain="https://domain"
          audience="https://audience"
          scope="openid profile email"
        >
          <TestHarness />
        </AuthProvider>
      );

      const isLoadingElement = await screen.findByTestId("is-loading");
      const isAuthenticatedElement = await screen.findByTestId(
        "is-authenticated"
      );

      // Should be loaded and not authenticated
      expect(isLoadingElement.innerHTML).toBe("false");
      expect(isAuthenticatedElement.innerHTML).toBe("false");

      // Login via redirect
      userEvent.click(
        await screen.findByRole("button", { name: "Login with redirect" })
      );

      // We redirect via history push so just check it was pushed correctly
      await waitFor(() => {
        expect(history.push).toHaveBeenCalledTimes(1);
        expect(history.push).toHaveBeenCalledWith(
          "http://localhost-return-url"
        );
      });
    });
  });

  describe("login with popup", () => {
    it("should have correct state whilst logging in with popup (success)", async () => {
      render(
        <AuthProvider
          clientId={JSON.stringify(mockAuth0ClientConfig)}
          domain="https://domain"
          audience="https://audience"
          scope="openid profile email"
        >
          <TestHarness />
        </AuthProvider>
      );

      const isLoadingElement = await screen.findByTestId("is-loading");
      const isAuthenticatedElement = await screen.findByTestId(
        "is-authenticated"
      );

      // Should be loaded and not authenticated
      expect(isLoadingElement.innerHTML).toBe("false");
      expect(isAuthenticatedElement.innerHTML).toBe("false");

      // Login via redirect
      userEvent.click(
        await screen.findByRole("button", { name: "Login with popup" })
      );

      // Auth0 lib will open a popup and resolve/reject so we can resolve and see new state
      await waitFor(() => {
        expect(isLoadingElement.innerHTML).toBe("false");
        expect(isAuthenticatedElement.innerHTML).toBe("true");
      });
    });

    it("should have correct state whilst logging in with popup (failure)", async () => {
      mockAuth0ClientConfig.loginWillWork = false;

      render(
        <AuthProvider
          clientId={JSON.stringify(mockAuth0ClientConfig)}
          domain="https://domain"
          audience="https://audience"
          scope="openid profile email"
        >
          <TestHarness />
        </AuthProvider>
      );

      const isLoadingElement = await screen.findByTestId("is-loading");
      const isAuthenticatedElement = await screen.findByTestId(
        "is-authenticated"
      );

      // Should be loaded and not authenticated
      expect(isLoadingElement.innerHTML).toBe("false");
      expect(isAuthenticatedElement.innerHTML).toBe("false");

      // Login via redirect
      userEvent.click(
        await screen.findByRole("button", { name: "Login with popup" })
      );

      // Auth0 lib will open a popup and resolve/reject so we can resolve and see new state
      await waitFor(() => {
        expect(isLoadingElement.innerHTML).toBe("false");
        expect(isAuthenticatedElement.innerHTML).toBe("false");
      });
    });
  });
});
