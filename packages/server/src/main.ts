import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { secure } from "./middleware/secure";
import { itemsRouter } from "./routers/items";

// Load our environment variables into process.env
dotenv.config();

// Construct app
const app = express();
app.use(cors());

// Secure the app
app.use(
  secure({
    algorithms: [process.env.AUTH_ALGORITHM],
    audience: process.env.AUTH_AUDIENCE,
    issuer: process.env.AUTH_ISSUER,
    jwksUri: process.env.AUTH_JWKS_URL,
  })
);

// Secure items routes
app.use("/api/items", itemsRouter);

// Start the server
app.listen(3000, () => {
  console.log("listening on port 3000");
});
