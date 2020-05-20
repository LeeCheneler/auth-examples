import React from "react";
import { render } from "../../test-utils/render";
import {
  createMockAuthService,
  createMockHistory,
  createMockUser,
} from "../../test-utils/mocks";
import { SigninCallback } from "../signin-callback";

describe("SigninCallback", () => {
  it("should trigger handle signin callback and take user to root of app by default", async () => {
    const mockHistory = createMockHistory({ replace: jest.fn() });
    const mockAuthService = createMockAuthService();
    await render(<SigninCallback />, {
      authService: mockAuthService,
      history: mockHistory,
    });

    expect(mockAuthService.signinCallback).toHaveBeenCalledTimes(1);

    // if no return url then go to app root
    expect(mockHistory.replace).toBeCalledTimes(1);
    expect(mockHistory.replace).toHaveBeenCalledWith("/");
  });

  it("should trigger handle signin callback and take user to their return url", async () => {
    const mockHistory = createMockHistory({ replace: jest.fn() });
    const mockUser = createMockUser({ state: { returnTo: "/return-url" } });
    const mockAuthService = createMockAuthService({
      signinCallback: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
    });
    await render(<SigninCallback />, {
      authService: mockAuthService,
      history: mockHistory,
    });

    expect(mockAuthService.signinCallback).toHaveBeenCalledTimes(1);

    // if no return url then go to app root
    expect(mockHistory.replace).toBeCalledTimes(1);
    expect(mockHistory.replace).toHaveBeenCalledWith("/return-url");
  });
});
