import React from "react";
import { createLocation } from "history";
import { render } from "../../test-utils/render";
import {
  createMockAuthService,
  createMockHistory,
} from "../../test-utils/mocks";
import { Signin } from "../signin";

describe("Signin", () => {
  it("should trigger handle signin and set return url to app root by default", async () => {
    const mockAuthService = createMockAuthService();
    await render(<Signin />, {
      authService: mockAuthService,
    });

    expect(mockAuthService.signin).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signin).toHaveBeenCalledWith({ returnTo: "/" });
  });

  it("should trigger handle signin and set return url to app root by default", async () => {
    const mockHistory = createMockHistory({
      location: createLocation("/?returnTo=/return-to"),
    });
    const mockAuthService = createMockAuthService();
    await render(<Signin />, {
      authService: mockAuthService,
      history: mockHistory,
    });

    expect(mockAuthService.signin).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signin).toHaveBeenCalledWith({
      returnTo: "/return-to",
    });
  });
});
