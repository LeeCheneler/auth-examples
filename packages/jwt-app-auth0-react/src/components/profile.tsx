import React from "react";
import { useAuth0 } from "./auth-provider";

export const Profile = () => {
  const { user } = useAuth0();

  return (
    <>
      <h2>Profile</h2>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </>
  );
};
