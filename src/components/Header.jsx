import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import UserProfileModal from "./UserProfileModal"; // 確保路徑正確

function Header() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const isIntroPage = location.pathname === "/";
  const isSigninPage = location.pathname === "/signin";

  return (
    <header className="fixed top-0 left-0 bg-[#61C6CD] w-full h-24 flex items-center justify-between z-50 shadow-md px-6">
      {/* 左側 Logo */}
      <img
        src="/images/logo-v1 1.svg"
        className="w-40 h-auto"
        alt="Logo"
      />

      {/* 右上角按鈕 */}
      <div className="flex items-center space-x-2">
        {!currentUser ? (
          <>
            <Link
              to="/signin"
              className="bg-white border border-2 rounded-sm px-4 py-2 text-black"
            >
              登入
            </Link>
            <Link
              to="/signup"
              className="bg-white border border-2 rounded-sm px-4 py-2 text-black"
            >
              註冊
            </Link>
          </>
        ) : (
          <button
            onClick={() => setShowProfile(true)}
            className="border border-2 rounded-sm px-4 py-2 text-black"
          >
            會員中心
          </button>
        )}
      </div>

      {/* 登入頁提醒 */}
      {isSigninPage && (
        <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-black">
          請先登入！
        </h2>
      )}

      {/* 會員中心 Modal */}
      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
    </header>
  );
}

export default Header;



