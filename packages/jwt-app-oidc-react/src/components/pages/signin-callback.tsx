import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../auth-provider";

export const SigninCallback = () => {
  const { signinCallback } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    const handleSignin = async () => {
      const user = await signinCallback();
      history.replace(user?.state?.returnTo ?? "/");
    };
    handleSignin();
  }, [signinCallback, history]);

  return <span>Signing in...</span>;
};
