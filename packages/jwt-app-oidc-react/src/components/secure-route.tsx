import React from "react";
import { Route, RouteProps, useLocation } from "react-router-dom";
import { useAuth } from "./auth-provider";

interface SecureProps {
  children: React.ReactNode;
}

const Secure: React.SFC<SecureProps> = (props) => {
  const { isAuthenticated, signin } = useAuth();
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated()) {
      signin({ returnTo: pathname });
    }
  }, [isAuthenticated, signin, pathname]);

  if (isAuthenticated()) {
    return <>{props.children}</>;
  }

  return <span>401, redirecting to signin...</span>;
};

export const SecureRoute = (
  props: Omit<RouteProps, "component" | "render">
) => {
  const { children, ...remainingProps } = props;
  return (
    <Route {...remainingProps}>
      <Secure>{children}</Secure>
    </Route>
  );
};
