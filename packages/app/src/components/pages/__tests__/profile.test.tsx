import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../test-utils/render";
import { createMockUser } from "../../test-utils/mocks";
import { Profile } from "../profile";

describe("Profile", () => {
  it("should load and display items", async () => {
    await render(<Profile />);

    const mockUser = createMockUser();
    await screen.findByText(`nickname: ${mockUser.profile.nickname}`);
    await screen.findByText(`email: ${mockUser.profile.email}`);
  });
});
