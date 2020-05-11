import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send([
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2" },
    { id: 3, title: "item 3" },
  ]);
});

export const itemsRouter = router;
