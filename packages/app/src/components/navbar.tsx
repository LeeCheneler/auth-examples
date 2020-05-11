import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth-provider";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const isLoggedIn = isAuthenticated();
  return (
    <>
      <div>
        {!isLoggedIn && (
          <Link to={`/signin?returnTo=${pathname}`}>Sign in</Link>
        )}
        {isLoggedIn && <Link to="/signout">Sign out</Link>}
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
