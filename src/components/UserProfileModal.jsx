// src/components/UserProfileModal.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const UserProfileModal = ({ onClose }) => {
  const { currentUser } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center text-3xl">
            👤
          </div>
          <h2 className="text-lg font-semibold">{currentUser?.displayName || "會員"}</h2>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
          <button className="mt-4 px-4 py-2 border rounded-full text-blue-700 hover:bg-blue-100">
            登出
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
