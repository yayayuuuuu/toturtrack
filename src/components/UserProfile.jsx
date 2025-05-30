import React from "react";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <h2>會員中心</h2>
      {currentUser ? (
        <div>
          <p>Email: {currentUser.email}</p>
          <p>UID: {currentUser.uid}</p>
        </div>
      ) : (
        <p>尚未登入</p>
      )}
    </div>
  );
};

export default UserProfile;
