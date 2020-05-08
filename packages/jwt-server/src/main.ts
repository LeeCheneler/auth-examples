import express from "express";
import cors from "cors";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { getConfig } from "@auth-examples/config";

const config = getConfig();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth.jwksUrl,
  }),
  audience: config.auth.audience,
  issuer: config.auth.issuer,
  algorithms: config.auth.algorithms,
});

const app = express();

app.use(cors());
app.use(checkJwt);

app.get("/api/items", (req, res) => {
  res.send([
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2" },
    { id: 3, title: "item 3" },
  ]);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
