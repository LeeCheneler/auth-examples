import React from "react";
import { useAuth } from "./auth-provider";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <h2>Profile</h2>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </>
  );
};
