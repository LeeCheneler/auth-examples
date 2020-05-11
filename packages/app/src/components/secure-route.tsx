import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "./auth-provider";

// Only supports using children prop of Route for
// setting then Route's component to render so we
// omit the component and render props from the type
export const SecureRoute = (
  props: Omit<RouteProps, "component" | "render">
) => {
  const { isAuthenticated } = useAuth();
  const { children, ...routeProps } = props;

  // If authenticated then render the children, if not
  // then redirect to the signin page sending the path
  // so it returns the page the user originally requested
  // once they have authenticated
  return (
    <Route {...routeProps}>
      {isAuthenticated() ? (
        children
      ) : (
        <Redirect to={`/signin?returnTo=${routeProps.path}`} />
      )}
    </Route>
  );
};
