import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://minimern-backend.onrender.com/api/auth/me", {
          headers: { "x-auth-token": token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token")); // Remove invalid token
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://minimern-backend.onrender.com/api/auth",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
