import { config } from "../config";

describe("config", () => {
  it("should resolve config", () => {
    expect(config).toMatchObject({});
  });
});
