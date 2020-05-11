import React from "react";
import { useAuth } from "../auth-provider";

export const Signout = () => {
  const { signout } = useAuth();

  React.useEffect(() => {
    // This will send the user through the logout
    // loop which will leave the applciation and
    // redirect to the signout callback page
    signout();
  }, [signout]);

  return <span>Signing out...</span>;
};
