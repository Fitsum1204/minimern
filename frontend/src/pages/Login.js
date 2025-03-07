import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { user,login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await login(email, password); 

      if (user.role === "admin") {
        navigate("/admin"); // Redirect admin users
      } else {
        navigate("/dashboard"); // Redirect regular users
      } 
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };
  /* const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password); // Get user data from login function
  
      if (user.role === "admin") {
        navigate("/admin"); // Redirect admin users
      } else {
        navigate("/dashboard"); // Redirect regular users
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  }; */
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Login</h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;