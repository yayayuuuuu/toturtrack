import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Intro from "./pages/Intro";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import StudentListPage from "./pages/StudentListPage";
import StudentFormPage from "./pages/StudentFormPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HamburgerMenu from "./components/HamburgerMenu";
import PrivateRoute from "./components/PrivateRoute"; // ✅ 新增

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        
        <div className="pt-24"> {/* ⬅️ 讓主內容下移 */}
          <HamburgerMenu />
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <PrivateRoute>
                  <StudentFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/:id"
              element={
                <PrivateRoute>
                  <StudentFormPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;




