import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/app";
import { AuthProvider } from "./components/auth-provider";
import { createAuthService } from "./services/auth";
import { config } from "./utils/config";

// Creat auth service
const authService = createAuthService(config.auth);

// Create element to attach React app to
const appElement = document.createElement("div");
document.body.appendChild(appElement);

// Render the application
ReactDOM.render(
  <AuthProvider authService={authService}>
    <App />
  </AuthProvider>,
  appElement
);
