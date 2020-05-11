import express from "express";
import type { Express } from "express";
import request from "supertest";
import { itemsRouter } from "../items";

describe("router items/", () => {
  let app: Express = null;

  beforeEach(() => {
    app = express();
    app.use("/items", itemsRouter);
  });

  describe("GET", () => {
    it("should return items", async () => {
      await request(app)
        .get("/items")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject([
            { id: 1, title: "item 1" },
            { id: 2, title: "item 2" },
            { id: 3, title: "item 3" },
          ]);
        });
    });
  });
});
