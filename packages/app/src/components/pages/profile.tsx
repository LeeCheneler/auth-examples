import React from "react";
import { useAuth } from "../auth-provider";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <>
      <h2>Profile</h2>
      {user && (
        <>
          <p>nickname: {user.profile.nickname}</p>
          <p>email: {user.profile.email}</p>
        </>
      )}
    </>
  );
};
