import React from "react";
import ReactDOM from "react-dom";
import { getConfig } from "@auth-examples/config";
import { App } from "./components/app";
import { AuthProvider } from "./components/auth-provider";

const config = getConfig();
const appElement = document.createElement("div");
document.body.appendChild(appElement);

ReactDOM.render(
  <AuthProvider
    clientId={config.auth.clientId}
    domain={config.auth.domain}
    audience={config.auth.audience}
    scope={config.auth.scope}
  >
    <App />
  </AuthProvider>,
  appElement
);
