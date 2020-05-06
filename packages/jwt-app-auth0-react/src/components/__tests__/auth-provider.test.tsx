import React from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import { render } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-provider";

jest.mock("@auth0/auth0-spa-js", () => {
  return () => {
    return {
      loginWithPopup: jest.fn(),
      getUser: jest.fn(),
      handleRedirectCallback: jest.fn(),
      getTokenSilently: jest.fn(),
      getTokenWithPopup: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithRedirect: jest.fn(),
    };
  };
});

const TestHarness = () => {};

describe("AuthProvider/useAuth", () => {
  it("should be loading until it is not", async () => {
    render(<AuthProvider></AuthProvider>);
  });
});
