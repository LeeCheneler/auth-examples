import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/app";
import { history } from "./utils/history";
import authConfig from "./auth-config.json";
import { Auth0Provider } from "./components/auth-provider";

const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const appElement = document.createElement("div");
document.body.appendChild(appElement);

ReactDOM.render(
  <Auth0Provider
    domain={authConfig.domain}
    client_id={authConfig.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  appElement
);
