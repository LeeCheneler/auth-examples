import React from "react";
import { useAuth } from "../auth-provider";

export const Signout = () => {
  const { signout } = useAuth();

  React.useEffect(() => {
    signout();
  }, [signout]);

  return <span>Signing out...</span>;
};
