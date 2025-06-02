// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserProfileModal from "../components/UserProfileModal";
import CalendarSection from "../components/CalendarSection"; // ⬅️ 新增


function Home() {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div>
      <Header />
      <nav className="p-4 bg-gray-100 space-x-4 mt-12 ">
       
        <Link to="/signup">註冊</Link>
        <Link to="/signin">登入</Link>
        <Link to="/students">學生列表</Link>
        <button onClick={() => setShowProfile(true)}>會員中心</button>
      </nav>

      {showProfile && <UserProfileModal onClose={() => setShowProfile(false)} />}

      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#000000]">歡迎使用 Tutor Track</h2>
        <p className="text-[#000000]">這是 Home Page 的內容。你已登入。</p>
        <button>
          <Link to="/home/list">
            <p className="text-[#000000]">to list</p>
          </Link>
        </button>

        {/* ⬇️ 模組化行事曆 */}
        <CalendarSection />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
