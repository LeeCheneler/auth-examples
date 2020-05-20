import React from "react";
import { screen } from "@testing-library/react";
import nock from "nock";
import { render } from "../../test-utils/render";
import { Items } from "../items";

describe("Items", () => {
  it("should load and display items", async () => {
    nock("http://localhost")
      .get("/api/items")
      .reply(200, [
        { id: 1, title: "item 1" },
        { id: 2, title: "item 2" },
        { id: 3, title: "item 3" },
      ]);

    await render(<Items />);

    await screen.findByText("item 1");
    await screen.findByText("item 2");
    await screen.findByText("item 3");
  });

  it("should display error message if items cannot be loaded", async () => {
    nock("http://localhost").get("/api/items").reply(500);

    await render(<Items />);

    await screen.findByText("Oops, failed to load items!");
  });
});
