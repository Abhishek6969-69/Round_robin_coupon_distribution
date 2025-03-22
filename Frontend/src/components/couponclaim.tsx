import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;


const CouponClaim: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isClaimed, setIsClaimed] = useState<boolean>(false);

  const handleClaim = async () => {
    try {
      const response = await fetch(`${API_URL}/api/coupon/claim`, {
        method: "POST",
        credentials: "include", // Include cookies for session tracking
      });
      const data = await response.json();
      setMessage(data.message);
      setIsClaimed(true);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400 animate-pulse">
        🎉 Claim Your Exclusive Coupon! 🎊
      </h1>
      
      <div className="relative bg-gray-700 p-8 rounded-lg shadow-lg text-center">
        <p className="text-lg text-gray-200 mb-4">
          Click below to unlock your special deal!
        </p>

        <button
          onClick={handleClaim}
          disabled={isClaimed}
          className={`relative px-6 py-3 font-semibold rounded-md transition-all duration-300 
            ${isClaimed ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 transform hover:scale-105 shadow-lg"}
          `}
        >
          {isClaimed ? "✅ Coupon Claimed!" : "🎁 Claim Coupon"}
        </button>

        {message && (
          <div className="mt-6 text-xl font-semibold text-green-400 animate-fade-in">
            {message}
          </div>
        )}
        
        <div className="absolute -top-3 -right-3 bg-yellow-500 text-black px-3 py-1 text-sm font-bold rounded-full shadow-md">
          Limited Offer!
        </div>
      </div>
      
      <p className="mt-6 text-gray-400 text-sm">
        Coupons are distributed on a first-come, first-served basis! 🚀
      </p>
    </div>
  );
};

export default CouponClaim;
