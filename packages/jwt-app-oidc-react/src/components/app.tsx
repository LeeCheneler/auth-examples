import React from "react";
import { Router, Switch, Route, Link } from "react-router-dom";
import { useAuth } from "./auth-provider";
import { history } from "../utils/history";
import { Profile } from "./profile";
import { Items } from "./items";

const NavBar = () => {
  const { isAuthenticated, signin, signout } = useAuth();

  const isLoggedIn = isAuthenticated();
  return (
    <>
      <div>
        {!isLoggedIn && <button onClick={() => signin()}>Log in</button>}

        {isLoggedIn && <button onClick={() => signout()}>Log out</button>}
      </div>
      <div>
        <Link to="/">Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/items">Items</Link>
          </>
        )}
      </div>
    </>
  );
};

const CallbackSignin = () => {
  const { signinCallback } = useAuth();

  React.useEffect(() => {
    const handleSignin = async () => {
      await signinCallback();
    };
    handleSignin();
  }, []);

  return <span>Signing in...</span>;
};

const CallbackSignout = () => {
  const { signoutCallback } = useAuth();

  React.useEffect(() => {
    const handleSignout = async () => {
      await signoutCallback();
    };
    handleSignout();
  }, []);

  return <span>Signing out...</span>;
};

const CallbackSilentSignin = () => {
  const { silentSigninCallback } = useAuth();

  React.useEffect(() => {
    const handleSilentSignin = async () => {
      await silentSigninCallback();
    };
    handleSilentSignin();
  }, []);

  return <span>Silently signing in...</span>;
};

export const App = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Router history={history}>
      <h1>Auth Examples - JWT - OIDC - React</h1>
      <NavBar />
      <Switch>
        <Route path="/items">
          <Items />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/callback-signin">
          <CallbackSignin />
        </Route>
        <Route path="/callback-signout">
          <CallbackSignout />
        </Route>
        <Route path="/callback-silent-signin">
          <CallbackSilentSignin />
        </Route>
      </Switch>
    </Router>
  );
};
