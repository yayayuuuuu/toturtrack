import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ⬅️ 你應該已有這個 context

import Header from '../components/Header';
import Footer from '../components/Footer';

function Intro() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home"); // ⬅️ 若已登入，自動跳轉
    }
  }, [currentUser, navigate]);

  return (
    <div>
      <Header />

      <div className="first justify-items-start">
        <p className="text-4xl font-bold text-[#000000]">家教老師的最強幫手</p>
        <p className="text-xl font-bold text-[#000000]">1. 記錄學生學習狀況</p>
        <p className="text-xl font-bold text-[#000000]">2. 整理學生檔案</p>
        <p className="text-xl font-bold text-[#000000]">3. 課程行事曆</p>
      </div>

      <div className="second justify-items-start">
        <p className="text-2xl font-bold text-[#000000]">管理教學進度</p>
        <p className="text-[#000000] text-left">Lorem ipsum dolor sit amet...</p>
      </div>

      <div className="third justify-items-start">
        <p className="text-2xl font-bold text-[#000000]">記錄學生資訊</p>
        <p className="text-[#000000] text-left">Lorem ipsum dolor sit amet...</p>
      </div>

      <div className="fourth justify-items-start">
        <p className="text-2xl font-bold text-[#000000]">業界前輩分享</p>
      </div>

      <div className="signup bg-[#61C6CD] w-full">
        <p className="text-xl font-bold text-[#000000]">立即免費註冊</p>
        <button className="border border-2 rounded-full">
          <Link to="/signup">
            <p className="text-[#000000] px-4 py-2">註冊</p>
          </Link>
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Intro;
