// App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CalendarPage from "./pages/CalendarPage";
import StudentListPage from "./pages/StudentListPage";
import StudentFormPage from "./pages/StudentFormPage";
import HamburgerMenu from "./components/HamburgerMenu";
import UserProfileModal from "./components/UserProfileModal"; // 🔁 新增

function App() {
  const [showProfile, setShowProfile] = useState(false); // 👈 控制 Modal 開關

  return (
    <AuthProvider>
      <BrowserRouter>
        <HamburgerMenu />

        {/* 導覽列 */}
        <nav className="p-4 bg-gray-100 space-x-4 mt-12">
          <Link to="/signup">註冊</Link>
          <Link to="/signin">登入</Link>
          
          <Link to="/students">學生列表</Link>
          <button onClick={() => setShowProfile(true)}>會員中心</button> {/* 🔁 改成按鈕 */}
        </nav>

        {/* 顯示 Modal */}
        {showProfile && <UserProfileModal onClose={() => setShowProfile(false)} />}

        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          {/* 移除 <Route path="/profile" element={<UserProfile />} /> */}
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/new" element={<StudentFormPage />} />
          <Route path="/students/:id" element={<StudentFormPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


