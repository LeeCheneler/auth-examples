import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth-provider";

export const Navbar = () => {
  const { isAuthenticated, signin, signout } = useAuth();
  const { pathname } = useLocation();

  const isLoggedIn = isAuthenticated();
  return (
    <>
      <div>
        {!isLoggedIn && (
          <button onClick={() => signin({ returnTo: pathname })}>Log in</button>
        )}

        {isLoggedIn && <Link to="/signout">Signout</Link>}
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
