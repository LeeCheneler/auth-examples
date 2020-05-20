import React from "react";
import { screen, waitFor, act } from "@testing-library/react";
import { render } from "../../test-utils/render";
import type {
  UserLoadedCallback,
  UserUnloadedCallback,
} from "../../services/auth";
import { createMockAuthService, createMockUser } from "../../test-utils/mocks";
import { useAuth } from "../auth-provider";

const TestHarness = () => {
  const auth = useAuth();

  return (
    <>
      <span data-testid="is-loading">{auth.isLoading.toString()}</span>
      <span data-testid="is-authenticated">
        {auth.isAuthenticated().toString()}
      </span>
    </>
  );
};

describe("AuthProvider", () => {
  it("should being loading until its not", async () => {
    let resolveGetUser: () => void = () => {};
    const mockAuthService = createMockAuthService({
      getUser: jest.fn().mockImplementation(() => {
        return new Promise((res) => {
          resolveGetUser = () => {
            res(createMockUser());
          };
        });
      }),
    });

    await render(<TestHarness />, { authService: mockAuthService });

    // intially loading until getUser has resolved
    expect(screen.getByTestId("is-loading").innerHTML).toBe("true");

    // Now we resolve getUser
    resolveGetUser();

    // Now it should be loaded
    await waitFor(() => {
      expect(screen.getByTestId("is-loading").innerHTML).toBe("false");
    });
  });

  it("should be authenticated with valid user", async () => {
    await render(<TestHarness />);

    expect(screen.getByTestId("is-authenticated").innerHTML).toBe("true");
  });

  it("should be not be authenticated with no user", async () => {
    const mockAuthService = createMockAuthService({
      getUser: jest.fn().mockImplementation(() => Promise.resolve()),
    });
    await render(<TestHarness />, { authService: mockAuthService });

    expect(screen.getByTestId("is-authenticated").innerHTML).toBe("false");
  });

  it("should be not be authenticated with expired user", async () => {
    const mockAuthService = createMockAuthService({
      getUser: jest
        .fn()
        .mockImplementation(() =>
          Promise.resolve(createMockUser({ expired: true }))
        ),
    });
    await render(<TestHarness />, { authService: mockAuthService });

    expect(screen.getByTestId("is-authenticated").innerHTML).toBe("false");
  });

  it("should clear stale state", async () => {
    const mockAuthService = createMockAuthService();
    await render(<TestHarness />, { authService: mockAuthService });

    expect(mockAuthService.clearStaleState).toHaveBeenCalledTimes(1);
  });

  it("should update user via user subscriptions", async () => {
    let unloadUser: UserUnloadedCallback = () => {};
    let loadUser: UserLoadedCallback = () => {};
    const mockAuthService = createMockAuthService({
      subscribeToUserUnloaded: jest.fn().mockImplementationOnce((func) => {
        unloadUser = func;
      }),
      subscribeToUserLoaded: jest.fn().mockImplementationOnce((func) => {
        loadUser = func;
      }),
    });
    await render(<TestHarness />, { authService: mockAuthService });

    // should be authenticated initially with a user
    expect(screen.getByTestId("is-authenticated").innerHTML).toBe("true");

    // should not be authenticated when user is unloaded
    act(() => {
      unloadUser();
    });
    await waitFor(() => {
      expect(screen.getByTestId("is-authenticated").innerHTML).toBe("false");
    });

    // should be authenticated when user is loaded
    act(() => {
      loadUser(createMockUser());
    });
    await waitFor(() => {
      expect(screen.getByTestId("is-authenticated").innerHTML).toBe("true");
    });
  });
});
