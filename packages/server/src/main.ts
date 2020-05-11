import express from "express";
import cors from "cors";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import dotenv from "dotenv";

// Load our environment variables into process.env
dotenv.config();

// Middleware to confirm JWT's are valid
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH_JWKS_URL,
  }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: [process.env.AUTH_ALGORITHM],
});

// Construct app
const app = express();
app.use(cors());

// Everything beyond this point is secured
app.use(checkJwt);

// Secure items endpoint
app.get("/api/items", (req, res) => {
  res.send([
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2" },
    { id: 3, title: "item 3" },
  ]);
});

// Start the server
app.listen(3000, () => {
  console.log("listening on port 3000");
});
