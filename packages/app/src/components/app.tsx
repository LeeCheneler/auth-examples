import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { useAuth } from "./auth-provider";
import { history } from "../utils/history";
import { SigninCallback } from "./pages/signin-callback";
import { SignoutCallback } from "./pages/signout-callback";
import { Signout } from "./pages/signout";
import { SilentSigninCallback } from "./pages/silent-signin-callback";
import { Profile } from "./pages/profile";
import { Items } from "./pages/items";
import { SecureRoute } from "./secure-route";
import { Navbar } from "./navbar";

export const App = () => {
  const { isLoading } = useAuth();

  // We don't want to render the app until the auth provider is done loading.
  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <Router history={history}>
      <h1>JWT Auth Example</h1>
      <Navbar />
      <Switch>
        <SecureRoute path="/items">
          <Items />
        </SecureRoute>
        <SecureRoute path="/profile">
          <Profile />
        </SecureRoute>
        <Route path="/callback-signin">
          <SigninCallback />
        </Route>
        <Route path="/signout">
          <Signout />
        </Route>
        <Route path="/callback-signout">
          <SignoutCallback />
        </Route>
        <Route path="/callback-silent-signin">
          <SilentSigninCallback />
        </Route>
      </Switch>
    </Router>
  );
};
