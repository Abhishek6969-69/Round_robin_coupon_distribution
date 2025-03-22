// admin-frontend/src/components/CouponList/CouponList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddCouponForm from "./Addcoupnform"; // Fixed typo
import CouponTable from "./CouponTable";

const API_URL = "http://localhost:3000";

interface Coupon {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCoupons();
  }, [token, navigate]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/coupons`, { // Fixed endpoint
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      handleAuthError(error);
    }
  };

  const handleAuthError = (error: any) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      setError("Session expired. Please log in again.");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError("Failed to perform action. Try again later.");
    }
  };

  const handleAddCoupon = (coupon: Coupon) => {
    setCoupons([...coupons, coupon]);
  };

  const handleUpdateCoupon = (updatedCoupon: Coupon) => {
    setCoupons(coupons.map((coupon) => (coupon.id === updatedCoupon.id ? updatedCoupon : coupon)));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleViewClaimHistory = () => {
    navigate("/claimhistory");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Coupons</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleViewClaimHistory}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            View Claim History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      <AddCouponForm onAdd={handleAddCoupon} token={token} setError={setError} />
      <CouponTable
        coupons={coupons}
        onUpdate={handleUpdateCoupon}
        token={token}
        setError={setError}
      />
    </div>
  );
};

export default CouponList;