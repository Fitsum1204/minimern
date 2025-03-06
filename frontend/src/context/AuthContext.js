import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Check for existing token on mount and decode it
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken); // Set token if it exists in localStorage
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Clear invalid token
      }
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
        const config = {
            headers: {
               "x-auth-token": localStorage.getItem("token")
            }
          };
      const response = await axios.post("https://minimern-backend.onrender.com/api/auth/login", { email, password },config);
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error; 
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;