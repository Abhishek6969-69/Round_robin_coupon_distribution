import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6">
      {/* Animated Heading */}
      <motion.h1
        className="text-5xl font-extrabold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-blue-400">Coupon Distribution</span>
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Are you an Admin or a User?
      </motion.p>

      <motion.div
        className="flex space-x-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {/* Admin Button */}
        <motion.button
          onClick={() => navigate("/admin/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          I am an Admin
        </motion.button>

        {/* User Button */}
        <motion.button
          onClick={() => navigate("/claim")}
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          I am a User
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
