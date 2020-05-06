import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
// import { useAuth0 } from "./auth-provider";
import { useAuth } from "./auth-provider";
import { history } from "../utils/history";
import { Profile } from "./profile";
import { Items } from "./items";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth();

  return (
    <>
      <div>
        {!isAuthenticated && (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        )}

        {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
      </div>
      <div>
        <Link to="/">Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/items">Items</Link>
          </>
        )}
      </div>
    </>
  );
};

export const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router history={history}>
      <h1>Auth Examples - JWT - Auth0 - React</h1>
      <NavBar />
      <Switch>
        <Route path="/items">
          <Items />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
};
