import React from "react";
import { render } from "../../test-utils/render";
import {
  createMockAuthService,
  createMockHistory,
} from "../../test-utils/mocks";
import { SignoutCallback } from "../signout-callback";

describe("SignoutCallback", () => {
  it("should trigger handle signout callback and take user to root of app", async () => {
    const mockHistory = createMockHistory({ replace: jest.fn() });
    const mockAuthService = createMockAuthService();
    await render(<SignoutCallback />, {
      authService: mockAuthService,
      history: mockHistory,
    });

    expect(mockAuthService.signoutCallback).toHaveBeenCalledTimes(1);

    // if no return url then go to app root
    expect(mockHistory.replace).toBeCalledTimes(1);
    expect(mockHistory.replace).toHaveBeenCalledWith("/");
  });
});
