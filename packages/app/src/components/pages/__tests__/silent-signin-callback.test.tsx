import React from "react";
import { render } from "../../test-utils/render";
import { createMockAuthService } from "../../test-utils/mocks";
import { SilentSigninCallback } from "../silent-signin-callback";

describe("SilentSigninCallback", () => {
  it("should trigger handle silent signin callback", async () => {
    const mockAuthService = createMockAuthService();
    await render(<SilentSigninCallback />, { authService: mockAuthService });

    expect(mockAuthService.silentSigninCallback).toHaveBeenCalledTimes(1);
  });
});
