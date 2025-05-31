import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import UserProfile from "./components/UserProfile";
import CalendarPage from "./pages/CalendarPage";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/signup">註冊</Link> | <Link to="/signin">登入</Link> | <Link to="/profile">會員中心</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;