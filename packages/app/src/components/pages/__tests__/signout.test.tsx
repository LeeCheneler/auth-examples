import React from "react";
import { render } from "../../../test-utils/render";
import { createMockAuthService } from "../../../test-utils/mocks";
import { Signout } from "../signout";

describe("Signout", () => {
  it("should trigger the signout flow", async () => {
    const mockAuthService = createMockAuthService();
    await render(<Signout />, { authService: mockAuthService });

    expect(mockAuthService.signout).toHaveBeenCalledTimes(1);
  });
});
