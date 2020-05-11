import { history } from "../history";

describe("history", () => {
  it("should resolve history", () => {
    expect(history).toMatchObject({});
  });
});
