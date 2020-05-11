import React from "react";
import { useAuth } from "../auth-provider";

export const SilentSigninCallback = () => {
  const { silentSigninCallback } = useAuth();

  React.useEffect(() => {
    // Handle the silent sign in request, this
    // page should only be visisted in an iframe
    // when refreshing the user's tokens. The parent
    // window will be notified once this is done.
    silentSigninCallback();
  }, []);

  return <span>Silently signing in...</span>;
};
