import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-provider";

jest.mock("@auth0/auth0-spa-js", () => {
  return () =>
    Promise.resolve({
      isAuthenticated: jest.fn(),
      loginWithPopup: jest.fn(),
      loginWithRedirect: jest.fn(),
      getIdTokenClaims: jest.fn(),
      getUser: jest.fn(),
      handleRedirectCallback: jest.fn(),
      getTokenSilently: jest.fn(),
      getTokenWithPopup: jest.fn(),
    });
});

// Renders child if context arrives
const TestHarness = () => {
  const auth = useAuth();

  return <>{auth && <span data-testid="context-child"></span>}</>;
};

describe("AuthProvider", () => {
  it("should render its children", async () => {
    render(
      <AuthProvider
        clientId="client_id"
        domain="https://domain"
        audience="https://audience"
        scope="openid profile email"
      >
        <TestHarness />
      </AuthProvider>
    );

    expect(await screen.findByTestId("context-child")).toBeInTheDocument();
  });
});
