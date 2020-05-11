import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth-provider";

export const Signin = () => {
  const { signin } = useAuth();
  const { search } = useLocation();

  React.useEffect(() => {
    // Sign in and return to either the provided returnTo path
    // or to the home page by default
    const urlSearchParams = new URLSearchParams(search);
    signin({ returnTo: urlSearchParams.get("returnTo") ?? "/" });
  }, [signin, search]);

  return <span>Signing in...</span>;
};
