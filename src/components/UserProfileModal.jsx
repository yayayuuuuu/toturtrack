import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfileModal = ({ onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();               // 執行登出
      onClose();                    // 關閉 Modal（可選）
      navigate("/");           // 導向 /intro
      window.location.reload();     // ✅ 強制刷新頁面，避免保護頁自動導向 /signin
    } catch (error) {
      console.error("登出失敗：", error);
    }
  };

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
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 border rounded-full text-blue-700 hover:bg-blue-100"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;


