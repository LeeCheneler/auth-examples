import React from "react";
import { useAuth } from "../auth-provider";

export const SilentSigninCallback = () => {
  const { silentSigninCallback } = useAuth();

  React.useEffect(() => {
    silentSigninCallback();
  }, []);

  return <span>Silently signing in...</span>;
};
