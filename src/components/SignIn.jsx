import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬 Firebase auth 狀態載入
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);
  
  if (loading) return <div>Loading...</div>;





  

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("登入成功！");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <form onSubmit={handleSignIn} className="flex flex-col w-80 gap-4 p-8 shadow-md rounded bg-white">
        <h2 className="text-2xl font-semibold text-center">
          歡迎使用 <span className="italic font-cursive">Tutor Track</span>
        </h2>

        <input
          className="border rounded px-3 py-2"
          placeholder="帳號"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="custom-button">登入</button>

        <div className="text-center text-sm text-gray-700">還沒有帳號嗎？</div>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="border py-2 rounded hover:bg-gray-100 transition"
        >
          註冊
        </button>
      </form>

      <style>{`
        .custom-button {
          background-color: #FFFFD0;
          border: 1px solid black;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease;
        }
        .custom-button:hover {
          background-color: #ffffff;
        }

        .font-cursive {
          font-family: 'Comic Sans MS', cursive, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SignIn;
