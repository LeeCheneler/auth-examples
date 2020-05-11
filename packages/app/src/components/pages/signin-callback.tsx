import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../auth-provider";

export const SigninCallback = () => {
  const { signinCallback } = useAuth();
  const history = useHistory();

  React.useEffect(() => {
    // Complete the sign in, the tokens should be provided
    // in the url at this point to be stored and then redirect
    // back to either the returnTo path or to the home page
    const handleSignin = async () => {
      const user = await signinCallback();
      history.replace(user?.state?.returnTo ?? "/");
    };
    handleSignin();
  }, [signinCallback, history]);

  return <span>Signing in...</span>;
};
