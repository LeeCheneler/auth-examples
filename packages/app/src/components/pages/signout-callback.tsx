import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../auth-provider";

export const SignoutCallback = () => {
  const { signoutCallback } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    const handleSignout = async () => {
      await signoutCallback();
      history.replace("/");
    };
    handleSignout();
  }, [signoutCallback, history]);

  return <span>Signing out...</span>;
};
