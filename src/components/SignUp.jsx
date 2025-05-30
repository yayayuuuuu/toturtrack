import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        createdAt: new Date()
      });
      alert("註冊成功！");
      navigate("/profile"); // 註冊後導向個人頁面
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <form onSubmit={handleSignUp} className="flex flex-col w-80 gap-4 p-8 shadow-md rounded bg-white">
        <h2 className="text-2xl font-semibold text-center">註冊帳號</h2>

        <input
          className="border rounded px-3 py-2"
          placeholder="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="信箱"
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

        <button type="submit" className="custom-button">註冊</button>

        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="border py-2 rounded hover:bg-gray-100 transition"
        >
          已有帳號？前往登入
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
      `}</style>
    </div>
  );
};

export default SignUp;

