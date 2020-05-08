import React from "react";
import ReactDOM from "react-dom";
import { getConfig } from "@auth-examples/config";
import { App } from "./components/app";
import { AuthProvider } from "./components/auth-provider";
import { createAuthService } from "./services/auth";

const config = getConfig();
const authService = createAuthService(config.auth);

const appElement = document.createElement("div");
document.body.appendChild(appElement);

ReactDOM.render(
  <AuthProvider authService={authService}>
    <App />
  </AuthProvider>,
  appElement
);
