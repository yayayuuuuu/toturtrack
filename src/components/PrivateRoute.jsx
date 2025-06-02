// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // 如果沒登入，就導向登入頁
    return <Navigate to="/signin" />;
  }

  // 有登入就顯示原本的元件
  return children;
}

export default PrivateRoute;
