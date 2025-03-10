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
      setToken(storedToken); 
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded.user);
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); 
      }
    }
  }, [token]);


  const login = async (email, password) => {
    try {
      const response = await axios.post("https://minimern-backend.onrender.com/api/auth/login", { email, password });
      
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
  
      
      const decoded = jwtDecode(newToken);
      console.log("a",decoded.user)
      setUser(decoded.user);
      
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };
  

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