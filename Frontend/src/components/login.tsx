import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/coupons");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 relative">
      {/* Fixed Top Bar */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-blue-600 text-white text-center py-3 font-semibold shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Use Admin Credentials → <span className="font-bold">Email:</span> admin@example.com | <span className="font-bold">Password:</span> password123
      </motion.div>

      {/* Login Card (Centered) */}
      <motion.div
        className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 text-white text-center border border-white/20 mt-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-transparent border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <motion.button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Login"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
