// admin-frontend/src/components/CouponList.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
interface Coupon {
  id: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios
      .get(`${API_URL}/api/admin/coupons`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setCoupons(response.data))
      .catch((error) => {
        console.error("Error fetching coupons:", error);
        navigate("/");
      });
  }, [token, navigate]);

  const toggleCoupon = async (id: string, isActive: boolean) => {
    console.log("Toggling Coupon ID:", id);  // Debugging
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/coupons/${id}`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoupons(coupons.map((coupon) => (coupon.id === id ? response.data : coupon)));
    } catch (error) {
      console.error("Error toggling coupon:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Admin Panel - Coupons</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-100">
              <td className="p-2 border">{coupon.id}</td>
              <td className="p-2 border">{coupon.code}</td>
              <td className="p-2 border">{coupon.isActive ? "Yes" : "No"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => toggleCoupon((coupon.id), coupon.isActive)}
                  className={`p-1 rounded text-white ${
                    coupon.isActive ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {coupon.isActive ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponList;