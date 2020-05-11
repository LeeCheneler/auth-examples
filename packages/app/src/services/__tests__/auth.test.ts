import { config } from "../../utils/config";
import { createAuthService } from "../auth";

describe("services - auth", () => {
  it("should return the auth service", () => {
    const authService = createAuthService(config.auth);

    expect(authService).toMatchObject({});
  });
});
